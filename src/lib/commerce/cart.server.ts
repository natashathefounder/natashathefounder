import { z } from "zod";
import { shopify } from "./shopify.server";
import * as Q from "./queries";
import type { Cart } from "./types";
const schema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("add"),
    variantId: z.string().regex(/^gid:\/\/shopify\/ProductVariant\/\d+$/),
    quantity: z.number().int().min(1).max(99),
  }),
  z.object({
    action: z.literal("update"),
    lineId: z.string().min(1).max(500),
    quantity: z.number().int().min(1).max(99),
  }),
  z.object({ action: z.literal("remove"), lineId: z.string().min(1).max(500) }),
  z.object({ action: z.literal("reset") }),
]);
export function safeCheckout(url: string) {
  const u = new URL(url);
  const hosts = [
    "i6z1cd-5f.myshopify.com",
    "natashathefounder.myshopify.com",
    "www.natashathefounder.com",
    "natashathefounder.com",
    "checkout.shopify.com",
  ];
  if (u.protocol !== "https:" || !hosts.includes(u.hostname) || u.username || u.password)
    throw new Error("Checkout could not be verified. Please contact us.");
  return u.href;
}
export async function handleCart(request: Request) {
  const headers = new Headers({
    "Cache-Control": "private, no-store",
    "Content-Type": "application/json",
    Vary: "Cookie",
  });
  const respond = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers });
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  const save = (id: string) =>
    headers.set(
      "Set-Cookie",
      `ora_bag=${encodeURIComponent(id)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1209600${secure}`,
    );
  try {
    const raw = request.headers
      .get("cookie")
      ?.split(";")
      .map((v) => v.trim())
      .find((v) => v.startsWith("ora_bag="))
      ?.slice(8);
    const id = raw ? decodeURIComponent(raw) : null;
    if (request.method === "GET") {
      const cart = id ? (await shopify<{ cart: Cart | null }>(Q.CART_QUERY, { id })).cart : null;
      if (cart) cart.checkoutUrl = safeCheckout(cart.checkoutUrl);
      return respond({ cart });
    }
    const origin = request.headers.get("origin");
    if (!origin || new URL(origin).host !== new URL(request.url).host)
      return respond({ error: "Please refresh this page before changing your bag." }, 403);
    if (Number(request.headers.get("content-length") || 0) > 8192)
      return respond({ error: "Request too large" }, 413);
    const data = schema.parse(await request.json());
    if (data.action === "reset") {
      headers.set("Set-Cookie", `ora_bag=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
      return respond({ cart: null });
    }
    let query: string, variables: Record<string, unknown>;
    if (data.action === "add") {
      query = id ? Q.CART_ADD : Q.CART_CREATE;
      variables = id
        ? { id, lines: [{ merchandiseId: data.variantId, quantity: data.quantity }] }
        : {
            input: {
              buyerIdentity: { countryCode: "GB" },
              lines: [{ merchandiseId: data.variantId, quantity: data.quantity }],
            },
          };
    } else {
      if (!id)
        return respond({ error: "Your bag has expired. Please add your pieces again." }, 409);
      query = data.action === "update" ? Q.CART_UPDATE : Q.CART_REMOVE;
      variables =
        data.action === "update"
          ? { id, lines: [{ id: data.lineId, quantity: data.quantity }] }
          : { id, lineIds: [data.lineId] };
    }
    const result = await shopify<
      Record<string, { cart: Cart | null; userErrors: { message: string }[] }>
    >(query, variables);
    const value = Object.values(result)[0];
    if (value.userErrors.length)
      return respond({ error: value.userErrors.map((e) => e.message).join(" ") }, 422);
    if (!value.cart)
      return respond({ error: "Your bag could not be found. Start a new bag to continue." }, 409);
    value.cart.checkoutUrl = safeCheckout(value.cart.checkoutUrl);
    save(value.cart.id);
    return respond({ cart: value.cart });
  } catch (e) {
    return respond(
      {
        error:
          e instanceof z.ZodError
            ? "Please check your selection."
            : "Your bag could not be updated. Your previous selection has been kept. Please try again.",
      },
      503,
    );
  }
}
