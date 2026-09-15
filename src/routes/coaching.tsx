import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/coaching")({
  head: () =>
    pageHead(
      "Founder conversations — Natasha Collins",
      "Explore a coaching conversation with Natasha Collins about your next move.",
      "/coaching",
    ),
  component: () => (
    <main className="editorial">
      <p className="eyebrow">Founder to founder</p>
      <h1>
        What are you
        <br />
        <i>really building?</i>
      </h1>
      <p className="lede">
        A conversation with Natasha about the work, the decisions and the person behind them.
      </p>
      <h2>Bring the real question.</h2>
      <p>
        The next move. The idea you keep returning to. The moment when your business needs more of
        your point of view, not another borrowed formula.
      </p>
      <h2>Start with a conversation.</h2>
      <p>
        Ask about current availability, format and fees. A request is not a confirmed appointment,
        and no payment is taken here.
      </p>
      <a className="button" href="/contact?topic=coaching">
        Enquire about coaching ↗
      </a>
    </main>
  ),
});
