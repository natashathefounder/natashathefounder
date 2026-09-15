const cache = new Map<string, { expires: number; value: unknown }>();
export async function shopify<T>(
  query: string,
  variables: Record<string, unknown> = {},
  ttl = 0,
): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || "i6z1cd-5f.myshopify.com";
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain))
    throw new Error("Invalid store configuration");
  const key = JSON.stringify([query, variables]);
  const hit = cache.get(key);
  if (ttl && hit && hit.expires > Date.now()) return hit.value as T;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.SHOPIFY_STOREFRONT_TOKEN)
    headers["X-Shopify-Storefront-Access-Token"] = process.env.SHOPIFY_STOREFRONT_TOKEN;
  const response = await fetch(`https://${domain}/api/2026-07/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(12000),
  });
  const body = await response.json();
  if (!response.ok || body.errors?.length || !body.data) {
    console.error(
      "[commerce] Shopify request failed",
      response.status,
      body.errors?.map((e: { message: string }) => e.message),
    );
    throw new Error("The collection is temporarily unavailable. Please try again shortly.");
  }
  if (ttl) {
    if (cache.size >= 100) cache.delete(cache.keys().next().value!);
    cache.set(key, { expires: Date.now() + ttl, value: body.data });
  }
  return body.data as T;
}
