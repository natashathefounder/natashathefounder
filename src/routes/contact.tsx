import { createFileRoute } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/enquiry-form";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>) => ({
    topic: typeof search.topic === "string" ? search.topic.slice(0, 80) : "",
    piece: typeof search.piece === "string" ? search.piece.slice(0, 200) : "",
  }),
  head: () =>
    pageHead(
      "Contact — Natasha The Founder",
      "Ask about a piece, a custom idea, coaching or a conversation with the house.",
      "/contact",
    ),
  component: ContactPage,
});
function ContactPage() {
  const { topic, piece } = Route.useSearch();
  return (
    <main>
      <header className="page-intro">
        <p className="eyebrow">A conversation starts here</p>
        <h1>
          Tell us
          <br />
          <i>what is on your mind.</i>
        </h1>
        <p>For a piece, a possibility, or a question worth asking.</p>
        <a className="text-link" href="mailto:me@natashathefounder.com">
          me@natashathefounder.com ↗
        </a>
      </header>
      <section className="section">
        <EnquiryForm
          topic={topic === "Product guidance" ? topic : "General enquiry"}
          piece={piece}
        />
      </section>
    </main>
  );
}
