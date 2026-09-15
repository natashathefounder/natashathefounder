import { createFileRoute } from "@tanstack/react-router";
import { events, eventDate } from "@/lib/events";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/events/")({
  head: () =>
    pageHead(
      "Premier events — Natasha The Founder",
      "Gatherings, conversations and premier invitations from the house.",
      "/events",
    ),
  component: () => (
    <main>
      <header className="page-intro">
        <p className="eyebrow">PREMIER EVENTS</p>
        <h1>
          Good company.
          <br />
          <i>New perspective.</i>
        </h1>
        <p>Spaces to meet, look closer and begin a different conversation.</p>
      </header>
      <section className="section">
        {events.length ? (
          <div className="feature-grid">
            {events.map((e) => (
              <article key={e.slug}>
                <span className="eyebrow">
                  {e.state} {e.membersOnly ? " / MEMBERS" : ""}
                </span>
                <h2>{e.title}</h2>
                <p>
                  {eventDate(e)} · {e.timezone}
                </p>
                <a className="text-link" href={`/events/${e.slug}`}>
                  View invitation ↗
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="eyebrow">THE NEXT INVITATION</span>
            <h2>A gathering worth waiting for.</h2>
            <p>
              No upcoming or past event details have been confirmed for this page. Dates, venues,
              access and RSVP details will appear when ready.
            </p>
            <a className="button" href="/contact?topic=events">
              Ask about future invitations ↗
            </a>
          </div>
        )}
      </section>
    </main>
  ),
});
