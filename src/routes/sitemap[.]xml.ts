import { createFileRoute } from "@tanstack/react-router";
import { stories, journal } from "@/lib/editorial";
import { SITE } from "@/lib/seo";
import { shopify } from "@/lib/commerce/shopify.server";
const query = `query Sitemap($after:String) { products(first:250,after:$after) {nodes {handle} pageInfo{hasNextPage endCursor}} collections(first:250){nodes{handle}} }`;
const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          "/",
          "/shop",
          "/custom",
          "/coaching",
          "/contact",
          "/members",
          "/events",
          "/journal",
          ...Object.keys(stories).map((s) => "/pages/" + s),
          ...Object.keys(journal).map((s) => "/journal/" + s),
        ];
        let after: string | null = null;
        try {
          do {
            const r: {
              products: {
                nodes: { handle: string }[];
                pageInfo: { hasNextPage: boolean; endCursor: string | null };
              };
              collections: { nodes: { handle: string }[] };
            } = await shopify(query, { after }, 60000);
            paths.push(...r.products.nodes.map((p) => "/products/" + p.handle));
            if (!after) paths.push(...r.collections.nodes.map((c) => "/collections/" + c.handle));
            after = r.products.pageInfo.hasNextPage ? r.products.pageInfo.endCursor : null;
          } while (after);
        } catch {
          /* Unavailable commerce does not leak private catalogue data. */
        }
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${escape(SITE + p)}</loc></url>`).join("")}</urlset>`,
          { headers: { "Content-Type": "application/xml" } },
        );
      },
    },
  },
});
