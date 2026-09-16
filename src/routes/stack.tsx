import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { ShoppingGuide, charmSystems } from "@/components/shopping-guide";
import { Loading } from "@/components/commerce";
import { getStackCatalogue } from "@/lib/commerce/stack-catalogue";
import { StackBuilder } from "@/components/stack-builder";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/stack")({
  loader: () => getStackCatalogue(),
  pendingComponent: Loading,
  head: () =>
    pageHead(
      "Build your charm stack — ORA Jewellery",
      "Choose a slider chain, select Glide & Stack charms and add your personal combination to your Shopify bag.",
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
          <p className="eyebrow">ORA / BUILD YOUR CHARM STACK</p>
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
            <a className="button light" href="#build-stack">
              Build my stack <ArrowDown size={16} />
            </a>
            <ShoppingGuide />
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
      <StackBuilder products={data.products} />
      {data.incomplete && (
        <p className="section" role="status">
          Some pieces could not be loaded. Refresh to try again.
        </p>
      )}
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
    </main>
  );
}
