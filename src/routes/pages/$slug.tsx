import { createFileRoute, notFound } from "@tanstack/react-router";
import { stories } from "@/lib/editorial";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/pages/$slug")({
  loader: ({ params }) => {
    const story = stories[params.slug];
    if (!story) throw notFound();
    return story;
  },
  head: ({ loaderData, params }) =>
    pageHead(
      `${loaderData?.title || "The house"} — Natasha The Founder`,
      loaderData?.lede || "Explore the house.",
      `/pages/${params.slug}`,
    ),
  component: function Page() {
    const s = Route.useLoaderData();
    return (
      <main className="editorial">
        <p className="eyebrow">{s.eyebrow}</p>
        <h1>{s.title}</h1>
        <p className="lede">{s.lede}</p>
        {s.sections.map(([title, body]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
        <div className="actions">
          <a className="button" href="/shop">
            Explore ORA
          </a>
          <a className="text-link" href="/contact">
            Ask us a question ↗
          </a>
        </div>
      </main>
    );
  },
});
