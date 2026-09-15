import { createFileRoute } from "@tanstack/react-router";
import { journal } from "@/lib/editorial";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/journal/")({
  head: () =>
    pageHead(
      "Journal — Natasha The Founder",
      "Notes on jewellery, identity and perspective.",
      "/journal",
    ),
  component: () => (
    <main>
      <header className="page-intro">
        <p className="eyebrow">The journal</p>
        <h1>Things worth asking.</h1>
      </header>
      <section className="section house-paths">
        {Object.entries(journal).map(([slug, s], i) => (
          <a href={`/journal/${slug}`} key={slug}>
            <span className="eyebrow">NOTE 0{i + 1} / PERSPECTIVE</span>
            <h3>{s.title}</h3>
            <p>{s.lede}</p>
            <span className="text-link">Read the note ↗</span>
          </a>
        ))}
      </section>
    </main>
  ),
});
