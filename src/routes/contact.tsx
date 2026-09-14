import { createFileRoute } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/enquiry-form";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead(
      "Contact — Natasha The Founder",
      "Ask about a piece, a custom idea, coaching or a conversation with the house.",
      "/contact",
    ),
  component: () => (
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
        <EnquiryForm />
      </section>
    </main>
  ),
});
