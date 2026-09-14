import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Customer sign-in — ORA Jewellery" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: () => (
    <main className="editorial">
      <p className="eyebrow">THE PRIVATE SALON</p>
      <h1>Welcome back.</h1>
      <p>
        Use Shopify’s secure customer account experience to sign in or create an account. We do not
        collect your password here.
      </p>
      <a className="button" href="https://i6z1cd-5f.myshopify.com/account">
        Continue with Shopify ↗
      </a>
    </main>
  ),
});
