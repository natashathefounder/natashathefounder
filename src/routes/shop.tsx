import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { collections, SHOP } from "@/lib/catalog";
import { products, productUrl } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({ component: ShopPage });

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category))).sort()];

function formatZar(price: number | null) {
  if (price == null) return "";
  return `R${price.toLocaleString("en-ZA", { maximumFractionDigits: 0 })}`;
}

function ShopPage() {
  const [tag, setTag] = useState("All");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const collectionItems = useMemo(
    () => (tag === "All" ? collections : collections.filter((c) => c.tag === tag)),
    [tag],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.id.includes(q)) return false;
      return true;
    });
  }, [category, query]);

  const collectionTags = ["All", ...Array.from(new Set(collections.map((c) => c.tag)))];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-metal">Lookbook</p>
      <h1 className="mt-3 font-serif text-title">The shop lives at orajewellery.com</h1>
      <p className="mt-4 max-w-xl text-muted">
        Pieces from the ORA house, pulled from the live Shopify catalogue. Open any product and
        checkout stays on orajewellery.com — 24-month warranty, free SA shipping over R1 500.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {collectionTags.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTag(t)}
            className={cn(
              "h-10 border px-4 font-sans text-[0.7rem] uppercase tracking-[0.14em]",
              tag === t ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink hover:text-ink",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collectionItems.map((c) => (
          <a
            key={c.id}
            href={c.href}
            target="_blank"
            rel="noreferrer"
            className="group block overflow-hidden bg-card"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-5">
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.16em] text-metal">{c.tag}</p>
              <h2 className="mt-1 font-serif text-3xl">{c.name}</h2>
              <p className="mt-2 text-sm text-muted">{c.blurb}</p>
            </div>
          </a>
        ))}
      </div>

      <section className="mt-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-metal">Pieces</p>
            <h2 className="mt-2 font-serif text-4xl">From the house</h2>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the house"
            className="h-11 w-full border border-line bg-paper px-3 font-sans text-sm outline-none focus:border-ink md:max-w-xs"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "h-9 border px-3 font-sans text-[0.65rem] uppercase tracking-[0.14em]",
                category === c ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink hover:text-ink",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-muted">{filtered.length} pieces</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <a
              key={p.id}
              href={productUrl(p.id)}
              target="_blank"
              rel="noreferrer"
              className="group block overflow-hidden bg-card"
            >
              <div className="aspect-square overflow-hidden bg-paper">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-metal">ORA</div>
                )}
              </div>
              <div className="p-4">
                <p className="font-sans text-[0.6rem] uppercase tracking-[0.16em] text-metal">{p.category}</p>
                <h3 className="mt-1 font-serif text-lg leading-snug">{p.name}</h3>
                {p.price != null && <p className="mt-1 text-sm text-muted">{formatZar(p.price)}</p>}
              </div>
            </a>
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild>
          <a href={SHOP} target="_blank" rel="noreferrer">
            Open orajewellery.com
          </a>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/stack">Compose a stack here first</Link>
        </Button>
      </div>
    </main>
  );
}
