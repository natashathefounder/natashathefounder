import { products, type Product } from "@/lib/products";

export type CharmSystem = "glide" | "hoop" | "clip";
export type GuideKind = "Charms" | "Earrings" | "Bracelets" | "Necklaces" | "Rings";
export type GuideIntent = "self" | "gift";

const systemKinds: Record<CharmSystem, GuideKind[]> = {
  glide: ["Necklaces", "Bracelets", "Charms"],
  hoop: ["Earrings", "Charms"],
  clip: ["Charms", "Bracelets", "Necklaces"],
};

export const systemFit: Record<
  CharmSystem,
  { limit: string; mix: string }
> = {
  glide: {
    limit: "Slider chains with silicone-lined balls only. Check the charm opening against that ball.",
    mix: "Do not mix Glide charms onto hoops or clip links. Ask before you combine systems.",
  },
  hoop: {
    limit: "Hoops up to 2.5 mm wide. Measure the hoop, not the look of the charm.",
    mix: "A hoop charm that looks like a clip charm will not open the same way. Ask before you mix.",
  },
  clip: {
    limit: "Clip opening must clear the exact link (curve chain or paperclip-style).",
    mix: "Clip charms are not hoop charms. Send both product names if you are unsure.",
  },
};

function rank(pool: Product[], intent: GuideIntent): Product[] {
  const list = pool.slice();
  if (intent === "gift") {
    list.sort((a, b) => {
      const ap = a.price ?? 9e9;
      const bp = b.price ?? 9e9;
      const mid = (p: number) => Math.abs(p - 700);
      return mid(ap) - mid(bp);
    });
  }
  return list.slice(0, 3);
}

export function picksForSystem(system: CharmSystem, intent: GuideIntent = "self"): Product[] {
  const kinds = new Set(systemKinds[system]);
  return rank(
    products.filter((p) => kinds.has(p.category as GuideKind)),
    intent,
  );
}

export function picksForKind(kind: GuideKind, intent: GuideIntent = "self"): Product[] {
  const pool = products.filter((p) => p.category === kind);
  return rank(pool.length ? pool : products, intent);
}

export function productPath(id: string) {
  return `/products/${id}`;
}
