import { products, type Product } from "@/lib/products";

export type CharmSystem = "glide" | "hoop" | "clip";
export type GuideKind = "Charms" | "Earrings" | "Bracelets" | "Necklaces" | "Rings";

const systemKinds: Record<CharmSystem, GuideKind[]> = {
  glide: ["Necklaces", "Bracelets", "Charms"],
  hoop: ["Earrings", "Charms"],
  clip: ["Charms", "Bracelets", "Necklaces"],
};

export function picksForSystem(system: CharmSystem): Product[] {
  const kinds = new Set(systemKinds[system]);
  return products.filter((p) => kinds.has(p.category as GuideKind)).slice(0, 3);
}

export function picksForKind(kind: GuideKind): Product[] {
  const pool = products.filter((p) => p.category === kind);
  return (pool.length ? pool : products).slice(0, 3);
}

export function productPath(id: string) {
  return `/products/${id}`;
}
