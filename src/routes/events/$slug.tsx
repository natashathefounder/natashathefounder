import { createFileRoute, notFound } from "@tanstack/react-router";
import { events, eventDate } from "@/lib/events";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/events/$slug")({
  loader: ({ params }) => {
    const event = events.find((e) => e.slug === params.slug);
    if (!event) throw notFound();
    return event;
  },
  head: ({ loaderData, params }) =>
    pageHead(
      `${loaderData?.title || "Event"} — Natasha The Founder`,
      loaderData?.description || "An invitation from the house.",
      `/events/${params.slug}`,
    ),
  component: function Page() {
    const e = Route.useLoaderData();
    return (
      <main className="editorial">
        <p className="eyebrow">
          {e.membersOnly ? "MEMBER INVITATION" : "PREMIER EVENT"} / {e.state}
        </p>
        <h1>{e.title}</h1>
        <p className="lede">{e.description}</p>
        <p>
          {eventDate(e)} · {e.timezone}
        </p>
        <p>{e.venue}</p>
        {e.capacity !== null && (
          <p>
            Capacity: {e.capacity}
            {e.remaining !== null ? ` · Places remaining: ${e.remaining}` : ""}
          </p>
        )}
        {e.state === "past" ? (
          <p>This gathering has ended.</p>
        ) : e.membersOnly ? (
          <a className="button" href="/members">
            Member access ↗
          </a>
        ) : e.rsvpUrl && new URL(e.rsvpUrl).protocol === "https:" ? (
          <a className="button" href={e.rsvpUrl}>
            {e.state === "waitlist" ? "Join the waiting list" : "RSVP"} ↗
          </a>
        ) : (
          <a className="button" href="/contact?topic=events">
            Ask about this invitation ↗
          </a>
        )}
      </main>
    );
  },
});
