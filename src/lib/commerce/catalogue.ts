import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Catalogue, Collection, Product, PageInfo } from "./types";
import * as Q from "./queries";
const input = z.object({
  q: z.string().max(200).optional(),
  after: z.string().max(1000).optional(),
  sort: z.enum(["featured", "newest", "price-asc", "price-desc"]).default("featured"),
  available: z.boolean().optional(),
  type: z.string().max(100).optional(),
  collection: z.string().max(200).optional(),
});
export const getCatalogue = createServerFn({ method: "GET" })
  .inputValidator(input)
  .handler(async ({ data }): Promise<Catalogue> => {
    const { shopify } = await import("./shopify.server");
    const sort = data.sort.startsWith("price")
      ? "PRICE"
      : data.sort === "newest"
        ? "CREATED_AT"
        : "BEST_SELLING";
    const reverse = data.sort === "price-desc" || data.sort === "newest";
    const query = [
      data.q ? `title:*${data.q.replace(/[^\p{L}\p{N} -]/gu, "")}*` : "",
      data.available ? "available_for_sale:true" : "",
      data.type ? `product_type:"${data.type.replace(/["\\]/g, "")}"` : "",
    ]
      .filter(Boolean)
      .join(" AND ");
    try {
      if (data.collection) {
        const r = await shopify<{
          collection: (Collection & { products: { nodes: Product[]; pageInfo: PageInfo } }) | null;
        }>(
          Q.COLLECTION,
          {
            handle: data.collection,
            after: data.after,
            sort: sort === "CREATED_AT" ? "CREATED" : sort,
            reverse,
            filters: [
              ...(data.available ? [{ available: true }] : []),
              ...(data.type ? [{ productType: data.type }] : []),
            ],
          },
          60000,
        );
        return {
          products: (r.collection?.products.nodes || []).filter(
            (p) => !data.q || p.title.toLowerCase().includes(data.q.toLowerCase()),
          ),
          collections: r.collection ? [r.collection] : [],
          pageInfo: r.collection?.products.pageInfo || { hasNextPage: false, endCursor: null },
          unavailable: false,
        };
      }
      const r = await shopify<{
        products: { nodes: Product[]; pageInfo: PageInfo };
        collections: { nodes: Collection[] };
      }>(Q.CATALOGUE, { query, after: data.after, sort, reverse }, 60000);
      return {
        products: r.products.nodes,
        collections: r.collections.nodes,
        pageInfo: r.products.pageInfo,
        unavailable: false,
      };
    } catch {
      return {
        products: [],
        collections: [],
        pageInfo: { hasNextPage: false, endCursor: null },
        unavailable: true,
      };
    }
  });
export const getProduct = createServerFn({ method: "GET" })
  .inputValidator(z.string().min(1).max(200))
  .handler(async ({ data }) => {
    const { shopify } = await import("./shopify.server");
    try {
      const r = await shopify<{ product: Product | null }>(Q.PRODUCT, { handle: data }, 30000);
      if (!r.product) return { product: null, related: [], unavailable: false };
      while (r.product.variants.pageInfo.hasNextPage) {
        const next = await shopify<{ product: Pick<Product, "variants"> }>(
          Q.MORE_VARIANTS,
          { handle: data, after: r.product.variants.pageInfo.endCursor },
          30000,
        );
        r.product.variants.nodes.push(...next.product.variants.nodes);
        r.product.variants.pageInfo = next.product.variants.pageInfo;
      }
      const related = await shopify<{ productRecommendations: Product[] | null }>(
        Q.RECOMMENDATIONS,
        { id: r.product.id },
        60000,
      ).catch(() => ({ productRecommendations: [] }));
      return {
        product: r.product,
        related: related.productRecommendations || [],
        unavailable: false,
      };
    } catch {
      return { product: null, related: [], unavailable: true };
    }
  });
export const predictiveSearch = createServerFn({ method: "GET" })
  .inputValidator(z.string().max(100))
  .handler(async ({ data }) => {
    if (data.trim().length < 2) return [];
    const { shopify } = await import("./shopify.server");
    try {
      return (
        await shopify<{ predictiveSearch: { products: Product[] } }>(
          Q.PREDICTIVE,
          { query: data },
          30000,
        )
      ).predictiveSearch.products;
    } catch {
      return [];
    }
  });
