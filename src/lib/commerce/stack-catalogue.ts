import { createServerFn } from "@tanstack/react-start";
import { stackHandles, stackBaseHandles } from "./stack-selection";
import { PRODUCT } from "./queries";
import type { Product } from "./types";
export const getStackCatalogue = createServerFn({ method: "GET" }).handler(async () => {
  const { shopify } = await import("./shopify.server");
  const results = await Promise.allSettled(
    stackHandles.map((handle) => shopify<{ product: Product | null }>(PRODUCT, { handle }, 60000)),
  );
  const products = results.flatMap((result) => {
    if (result.status !== "fulfilled" || !result.value.product) return [];
    const p = result.value.product;
    const base = stackBaseHandles.includes(p.handle as (typeof stackHandles)[number]);
    if (!base && p.productType !== "Glide & Stack Charms") return [];
    if (p.variants.pageInfo.hasNextPage) return [];
    return [
      {
        handle: p.handle,
        title: p.title,
        base,
        image: p.featuredImage?.url || "",
        variants: p.variants.nodes
          .filter(
            (v) =>
              base ||
              v.selectedOptions.some(
                (o) =>
                  /with or without a chain/i.test(o.name) && /^charm(?: only)?$/i.test(o.value),
              ),
          )
          .map((v) => ({
            id: v.id,
            image: v.image?.url || p.featuredImage?.url || "",
            title: v.title,
            available: v.availableForSale,
            price: Number(v.price.amount),
            currency: v.price.currencyCode,
          })),
      },
    ];
  });
  return { products, incomplete: results.some((r) => r.status === "rejected") };
});
