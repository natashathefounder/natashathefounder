import { createFileRoute } from "@tanstack/react-router";
// Retain the legacy URL without exposing a parallel password/registration system.
export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: () => Response.redirect("https://i6z1cd-5f.myshopify.com/account", 302),
      POST: () =>
        new Response("Use Shopify Customer Accounts", { status: 405, headers: { Allow: "GET" } }),
    },
  },
});
