import { createFileRoute, notFound } from "@tanstack/react-router";
import { journal } from "@/lib/editorial";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const article = journal[params.slug];
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData, params }) =>
    pageHead(
      `${loaderData?.title || "Journal"} — Natasha The Founder`,
      loaderData?.lede || "A note from the house.",
      `/journal/${params.slug}`,
    ),
  component: function Page() {
    const s = Route.useLoaderData();
    return (
      <main className="editorial">
        <p className="eyebrow">A note from the house / perspective</p>
        <h1>{s.title}</h1>
        <p className="lede">{s.lede}</p>
        <p>{s.body}</p>
        <a className="text-link" href="/journal">
          ← All notes
        </a>
      </main>
    );
  },
});
