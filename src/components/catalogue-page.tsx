import type { Catalogue } from "@/lib/commerce/types";
import { ProductGrid, CommerceEmpty } from "./commerce";
import { ShoppingGuide } from "./shopping-guide";
export function CataloguePage({
  data,
  title = "Objects of expression.",
  q = "",
  sort = "featured",
  available = false,
  type = "",
  path = "/shop",
}: {
  data: Catalogue;
  title?: string;
  q?: string;
  sort?: string;
  available?: boolean;
  type?: string;
  path?: string;
}) {
  const more = new URLSearchParams({
    q,
    sort,
    ...(available ? { available: "true" } : {}),
    ...(type ? { type } : {}),
    after: data.pageInfo.endCursor || "",
  });
  return (
    <main>
      <header className="page-intro">
        <p className="eyebrow">ORA JEWELLERY / THE COLLECTION</p>
        <h1>{title}</h1>
        <p>A piece to punctuate your day. A detail that says something only you can say.</p>
        <ShoppingGuide />
      </header>
      <section className="section catalogue-section">
        <details className="filter-disclosure">
          <summary>
            Refine your edit <span>Search · type · availability · sort</span>
          </summary>
          <form className="catalogue-controls" action={path}>
            <label>
              Search
              <input type="search" name="q" defaultValue={q} placeholder="Find your piece" />
            </label>
            <label>
              Type
              <select name="type" defaultValue={type}>
                <option value="">All jewellery</option>
                {[
                  "Earrings",
                  "Rings",
                  "Bracelets",
                  "Necklaces",
                  "Glide & Stack Charms",
                  "Clip Charm",
                  "Hoop Charm",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Sort
              <select name="sort" defaultValue={sort}>
                <option value="featured">Featured</option>
                <option value="newest">Newest first</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
            <label className="check">
              <input type="checkbox" name="available" value="true" defaultChecked={available} /> In
              stock
            </label>
            <button className="button">Apply</button>
            <a className="text-link" href={path}>
              Clear
            </a>
          </form>
        </details>
        {data.products.length ? (
          <ProductGrid products={data.products} />
        ) : (
          <CommerceEmpty unavailable={data.unavailable} />
        )}{" "}
        {data.pageInfo.hasNextPage && (
          <div className="pagination">
            <a className="button outline" href={`${path}?${more}`}>
              Next pieces →
            </a>
          </div>
        )}
        {data.collections.length > 1 && (
          <nav className="actions" aria-label="Collections">
            {data.collections.map((c) => (
              <a className="text-link" href={`/collections/${c.handle}`} key={c.id}>
                {c.title}
              </a>
            ))}
          </nav>
        )}
      </section>
    </main>
  );
}
