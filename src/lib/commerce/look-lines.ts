import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PRODUCT } from "./queries";
import type { Product } from "./types";

export const getLookLines = createServerFn({ method: "GET" })
  .inputValidator(z.array(z.string().min(1).max(200)).min(1).max(6))
  .handler(async ({ data }) => {
    const { shopify } = await import("./shopify.server");
    const lines: { variantId: string; quantity: number }[] = [];
    const missed: string[] = [];
    for (const handle of data) {
      try {
        const r = await shopify<{ product: Product | null }>(PRODUCT, { handle }, 0);
        const nodes = r.product?.variants.nodes || [];
        const necklace = nodes.find(
          (v) =>
            v.availableForSale &&
            v.selectedOptions.some((o) => /necklace/i.test(o.value) || /necklace/i.test(o.name)),
        );
        const charmOnly = nodes.find(
          (v) =>
            v.availableForSale &&
            v.selectedOptions.some((o) => /charm(?: only)?/i.test(o.value)),
        );
        const any = nodes.find((v) => v.availableForSale) || nodes[0];
        const pick = necklace || charmOnly || any;
        if (!pick) missed.push(handle);
        else lines.push({ variantId: pick.id, quantity: 1 });
      } catch {
        missed.push(handle);
      }
    }
    return { lines, missed };
  });
