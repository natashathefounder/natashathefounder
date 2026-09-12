import { createFileRoute } from "@tanstack/react-router";
import { CoachingCheckoutButton } from "@/components/coaching-checkout";
import { PageIntro } from "@/components/page-intro";
import { COACHING_PRICE_GBP, EMAIL } from "@/lib/catalog";
export const Route = createFileRoute("/coaching")({
  component: CoachingPage,
  head: () => ({ meta: [{ title: "Founder to founder — Natasha Collins" }] }),
});
function CoachingPage() {
  return (
    <main>
      <PageIntro
        number="04"
        eyebrow="Founder to founder"
        title={
          <>
            Let’s talk about
            <br />
            <em>the real thing.</em>
          </>
        }
        description="The business. The decision. The thing you’ve been turning over at 2am. Bring it to the table."
        image="/media/studio.jpg"
        caption="From the bench. From experience."
      />
      <section className="coaching-body editorial-container">
        <div>
          <p className="eyebrow">A session with Natasha</p>
          <h2>
            No performance.
            <br />
            <em>A proper conversation.</em>
          </h2>
          <p>
            I’m building a business too. This is a space to look honestly at where you are, ask the
            questions you haven’t found a place for, and work through what comes next.
          </p>
          <ol className="conversation-topics">
            {[
              [
                "Bring the knot",
                "A collection, a business decision, or a direction that no longer feels like yours. Pick the question that matters most.",
              ],
              [
                "Look at it together",
                "An honest founder perspective on the choices in front of you. Space to think out loud.",
              ],
              [
                "Find your next move",
                "Leave with a clearer focus for what to work on next. No promise of overnight transformation.",
              ],
            ].map(([title, body], i) => (
              <li key={title}>
                <span className="eyebrow">0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <aside className="session-note">
          <p className="eyebrow">One to one</p>
          <h3>
            Your seat
            <br />
            <em>at the table.</em>
          </h3>
          <p className="session-price">£{COACHING_PRICE_GBP}</p>
          <p>One hour · A private founder session</p>
          <div className="my-7">
            <CoachingCheckoutButton />
          </div>
          <p className="text-xs">
            Payment is handled securely by Stripe in GBP. Ask about availability and arrangements
            before paying if you need a particular date.
          </p>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Founder coaching — availability and questions")}`}
            className="text-link mt-5"
          >
            Ask Natasha a question ↗
          </a>
        </aside>
      </section>
    </main>
  );
}
