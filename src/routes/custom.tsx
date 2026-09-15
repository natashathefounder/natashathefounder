import { StudioPhotograph } from "@/components/studio-photograph";
import { createFileRoute } from "@tanstack/react-router";
import { EnquiryForm } from "@/components/enquiry-form";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/custom")({
  head: () =>
    pageHead(
      "Custom jewellery — Natasha The Founder",
      "Start a personal jewellery conversation with Natasha. Share your inspiration, preferences and budget.",
      "/custom",
    ),
  component: () => (
    <main>
      <header className="page-intro">
        <p className="eyebrow">Something only you could begin</p>
        <h1>
          Give your story
          <br />
          <i>a shape.</i>
        </h1>
        <p>
          A memory, a milestone, an idea that will not leave you alone. A personal piece starts with
          a conversation.
        </p>
      </header>
      <div className="custom-studio section">
        <StudioPhotograph kind="sketching" />
      </div>
      <section className="section feature-grid">
        <article>
          <p className="eyebrow">01 / THE CONVERSATION</p>
          <h2>Tell us what matters.</h2>
          <p>
            Share the feeling, occasion and references behind your idea. There is room for a clear
            vision or a beginning.
          </p>
        </article>
        <article>
          <p className="eyebrow">02 / THE POSSIBILITIES</p>
          <h2>Understand the choices.</h2>
          <p>
            Materials, feasibility, budget and timing need an individual discussion. Your preferred
            date is a request, not a commitment.
          </p>
        </article>
        <article>
          <p className="eyebrow">03 / THE AGREEMENT</p>
          <h2>Clarity before commitment.</h2>
          <p>
            Any design scope, quotation, production process and delivery arrangements must be agreed
            before work begins.
          </p>
        </article>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Begin your brief</p>
            <h2>We are listening.</h2>
          </div>
        </div>
        <EnquiryForm custom />
      </section>
    </main>
  ),
});
