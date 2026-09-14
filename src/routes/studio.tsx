import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/studio")({
  head: () =>
    pageHead(
      "Studio conversations — ORA Jewellery",
      "Arrange a conversation about your ORA piece.",
      "/studio",
    ),
  component: () => (
    <main className="editorial">
      <p className="eyebrow">THE STUDIO</p>
      <h1>
        Make room for
        <br />
        <i>a conversation.</i>
      </h1>
      <p>
        Ask about a consultation, a custom idea or a piece you would like to understand better.
        Location, availability and appointment details will be confirmed individually.
      </p>
      <a className="button" href="/contact">
        Contact the house ↗
      </a>
    </main>
  ),
});
