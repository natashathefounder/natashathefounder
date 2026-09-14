import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/stack")({
  head: () =>
    pageHead(
      "Your personal stack — ORA Jewellery",
      "Explore charms and start a personal ORA edit.",
      "/stack",
    ),
  component: () => (
    <main className="editorial">
      <p className="eyebrow">YOUR OWN COMPOSITION</p>
      <h1>
        A story.
        <br />
        <i>One piece at a time.</i>
      </h1>
      <p>
        Build your own combination from the current collection. Check each piece’s description for
        attachment details and ask us to confirm compatibility before ordering.
      </p>
      <a className="button" href="/shop?type=Glide+%26+Stack+Charms">
        Explore charms ↗
      </a>
    </main>
  ),
});
