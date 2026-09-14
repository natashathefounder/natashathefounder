import { createFileRoute } from "@tanstack/react-router";
import { handleCart } from "@/lib/commerce/cart.server";
export const Route = createFileRoute("/api/bag")({
  server: {
    handlers: {
      GET: ({ request }) => handleCart(request),
      POST: ({ request }) => handleCart(request),
    },
  },
});
