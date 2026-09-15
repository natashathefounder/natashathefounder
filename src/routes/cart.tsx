import { createFileRoute } from "@tanstack/react-router";
import { BagContents } from "@/components/commerce";
export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Your bag — ORA Jewellery" }, { name: "robots", content: "noindex,follow" }],
  }),
  component: () => (
    <main className="editorial">
      <p className="eyebrow">YOUR PERSONAL EDIT</p>
      <h1>Your bag.</h1>
      <BagContents />
    </main>
  ),
});
