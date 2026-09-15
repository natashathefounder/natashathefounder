import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { ShoppingGuide, charmSystems } from "@/components/shopping-guide";
import { ProductGrid, CommerceEmpty, Loading } from "@/components/commerce";
import { getCatalogue } from "@/lib/commerce/catalogue";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/stack")({
  loader: () => getCatalogue({ data: { q: "charm", sort: "featured" } }),
  pendingComponent: Loading,
  head: () =>
    pageHead(
      "The charm guide — ORA Jewellery",
      "Find your starting point. Understand ORA’s three charm systems and explore the current charm collection.",
      "/stack",
    ),
  component: CharmGuide,
});
function CharmGuide() {
  const data = Route.useLoaderData();
  return (
    <main>
      <section className="charm-hero">
        <div>
          <p className="eyebrow">ORA / THE CHARM GUIDE</p>
          <h1>
            A story.
            <br />
            <i>
              One piece
              <br />
              at a time.
            </i>
          </h1>
          <p>
            Keep the possibilities. Lose the guesswork. Start with the connection, then follow your
            own eye.
          </p>
          <div className="actions">
            <ShoppingGuide className="button light" />
            <a className="text-link" href="#systems">
              Meet the three systems <ArrowDown size={16} />
            </a>
          </div>
        </div>
        <div className="charm-hero-note">
          <span className="guide-number">03</span>
          <p className="eyebrow">SYSTEMS. DIFFERENT CONNECTIONS.</p>
          <h2>
            The first question
            <br />
            isn’t “which charm?”
            <br />
            <i>It’s “what will I wear it on?”</i>
          </h2>
          <p>
            Your chain or hoop is the starting point. A charm’s attachment decides what comes next.
          </p>
        </div>
      </section>
      <section className="section" id="systems">
        <div className="section-heading">
          <div>
            <p className="eyebrow">START WITH THE CONNECTION</p>
            <h2>Three ways to make it yours.</h2>
          </div>
        </div>
        <div className="charm-system-grid">
          {charmSystems.map((s, i) => (
            <article key={s.name}>
              <div className="system-heading">
                <span className="eyebrow">0{i + 1}</span>
                <s.icon size={30} strokeWidth={1} aria-hidden="true" />
              </div>
              <h3>{s.name}</h3>
              <p className="system-lede">{s.description}</p>
              <p>{s.detail}</p>
            </article>
          ))}
        </div>
        <p className="guide-note">
          These are general system descriptions. Product-level compatibility still needs to be
          checked for the exact charm and base. The three systems are not universally
          interchangeable.
        </p>
      </section>
      <section className="charm-check section">
        <div>
          <p className="eyebrow">BEFORE YOU ADD TO BAG</p>
          <h2>
            A small check.
            <br />
            <i>A better choice.</i>
          </h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <h3>Name your starting piece.</h3>
              <p>Find the chain or hoops you already have, or the base you want to buy.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Look at the connection.</h3>
              <p>Read the attachment details and measurements for both pieces.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Ask if there’s any doubt.</h3>
              <p>
                Send the product names or links together. We can discuss the combination before you
                order.
              </p>
              <a className="text-link" href="/contact?topic=Product+guidance">
                Ask about a combination <ArrowUpRight size={16} />
              </a>
            </div>
          </li>
        </ol>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FOLLOW YOUR OWN EYE</p>
            <h2>A few possibilities.</h2>
          </div>
          <a className="text-link" href="/shop?q=charm">
            Explore all charms <ArrowUpRight size={16} />
          </a>
        </div>
        <p className="small muted">
          From the current charm catalogue. This edit is inspiration, not a set of confirmed
          compatible pieces.
        </p>
        {data.products.length ? (
          <ProductGrid products={data.products.slice(0, 4)} />
        ) : (
          <CommerceEmpty unavailable={data.unavailable} />
        )}
      </section>
    </main>
  );
}
