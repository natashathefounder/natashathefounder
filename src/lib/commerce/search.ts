export function searchParams(s: Record<string, unknown>) {
  return {
    q: typeof s.q === "string" ? s.q.slice(0, 200) : "",
    sort: (["featured", "newest", "price-asc", "price-desc"].includes(String(s.sort))
      ? String(s.sort)
      : "featured") as "featured" | "newest" | "price-asc" | "price-desc",
    after: typeof s.after === "string" ? s.after.slice(0, 1000) : undefined,
    available: s.available === "true" || s.available === true,
    type: typeof s.type === "string" ? s.type.slice(0, 100) : "",
  };
}
