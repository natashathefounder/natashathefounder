import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getCatalogue } from "@/lib/commerce/catalogue";
import { ProductGrid, CommerceEmpty, Loading } from "@/components/commerce";
import { pageHead } from "@/lib/seo";
import { DiscoveryEntry } from "@/components/shopping-guide";
export const Route = createFileRoute("/")({
  loader: () => getCatalogue({ data: { sort: "featured" } }),
  pendingComponent: Loading,
  head: () =>
    pageHead(
      "Natasha The Founder — ORA Jewellery",
      "An independent house of jewellery, perspective and possibility. Explore ORA Jewellery and the world of Natasha Collins.",
      "/",
    ),
  component: Home,
});
function Home() {
  const { products, collections, unavailable } = Route.useLoaderData();
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">THE HOUSE OF NATASHA · ORA JEWELLERY</p>
          <h1>
            Never ask
            <br />
            permission
            <br />
            to <i>be.</i>
          </h1>
          <p>
            Wear your story.
            <br />
            Question where it begins.
          </p>
          <a className="button light" href="/shop">
            Discover ORA <ArrowUpRight size={18} />
          </a>
          <a className="hero-scroll" href="#perspective">
            <ArrowDown size={15} /> A DIFFERENT PERSPECTIVE
          </a>
        </div>
        <figure className="hero-portrait">
          <img
            src="/media/portrait-1080.webp"
            srcSet="/media/portrait-640.webp 640w, /media/portrait-1080.webp 1080w"
            sizes="(max-width:700px) 100vw, 53vw"
            width="1080"
            height="1440"
            fetchPriority="high"
            alt="Editorial portrait of a woman in a checked dress against warm timber"
          />
          <figcaption>INDIVIDUALITY IS THE SIGNATURE.</figcaption>
        </figure>
        <span className="hero-edition">01 / THE ORIGIN EDIT</span>
      </section>
      <DiscoveryEntry />
      <section id="perspective" className="manifesto section">
        <div className="section-label">
          <span className="eyebrow">01 — A question of origin</span>
          <span className="eyebrow">CHANGE THE CONVERSATION</span>
        </div>
        <h2>
          “Why buy gold or diamonds from China or America when you can purchase directly from their
          natural source—<i>Africa?</i>”
        </h2>
        <div className="manifesto-bottom">
          <p>
            A provocation. An invitation to look closer.
            <br />
            Our question expresses a perspective, not a sourcing guarantee for every piece.
          </p>
          <a className="text-link" href="/pages/transparency">
            Provenance should be visible <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      <section className="section product-edit">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 — The ORA edit</p>
            <h2>Personal, by nature.</h2>
          </div>
          <a className="text-link" href="/shop">
            Shop the collection <ArrowUpRight size={16} />
          </a>
        </div>
        {products.length ? (
          <ProductGrid products={products.slice(0, 4)} />
        ) : (
          <CommerceEmpty unavailable={unavailable} />
        )}
      </section>
      {collections.length > 0 && (
        <section className="collection-index section">
          <p className="eyebrow">Find your own language</p>
          {collections.map((c, i) => (
            <a href={`/collections/${c.handle}`} key={c.id}>
              <span className="small">0{i + 1}</span>
              <h2>{c.title === "Home page" ? "The opening edit" : c.title}</h2>
              <ArrowUpRight />
            </a>
          ))}
        </section>
      )}
      <section className="perspective-split">
        <div className="atmosphere">
          <img
            src="/media/atmosphere.webp"
            srcSet="/media/atmosphere-768.webp 768w, /media/atmosphere.webp 1536w"
            sizes="(max-width:700px) 100vw, 50vw"
            width="1536"
            height="1024"
            loading="lazy"
            alt="Atmospheric still life of dark stone and oxblood fabric"
          />
          <span className="eyebrow">FORM. FEELING. PERSPECTIVE.</span>
        </div>
        <div className="section">
          <p className="eyebrow">03 — The philosophy</p>
          <h2>
            Closer to source.
            <br />
            <i>Closer to yourself.</i>
          </h2>
          <p>
            Origin is more than a line on a label. It is a conversation about what we value, whose
            work we recognise, and the questions we are prepared to ask.
          </p>
          <p>
            Rooted in African perspective. Open to the world. Committed to making the distinction
            between a story and a verified fact clear.
          </p>
          <a href="/pages/origin" className="text-link">
            Explore our perspective <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      <section className="founder-note section">
        <p className="eyebrow">04 — From Natasha</p>
        <h2>
          Jewellery, perspective and the freedom to become more fully <i>yourself.</i>
        </h2>
        <div>
          <span className="signature">Natasha</span>
          <a className="text-link" href="/pages/natasha">
            Meet the mind behind the house <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      {products.length > 4 && (
        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Wear your own signature</p>
              <h2>The pieces you make yours.</h2>
            </div>
          </div>
          <ProductGrid products={products.slice(4, 8)} />
        </section>
      )}
      <section className="invitation-grid">
        <a className="invitation custom-invitation" href="/custom">
          <p className="eyebrow">A piece that begins with you</p>
          <h2>
            Some stories
            <br />
            need their
            <br />
            <i>own shape.</i>
          </h2>
          <span className="text-link">
            Begin a custom conversation <ArrowUpRight size={18} />
          </span>
        </a>
        <a className="invitation salon-invitation" href="/members">
          <p className="eyebrow">The private salon</p>
          <h2>
            Not a crowd.
            <br />
            <i>A connection.</i>
          </h2>
          <p>
            A quieter space for private edits, early access and premier invitations as they become
            available.
          </p>
          <span className="text-link">
            Come closer <ArrowUpRight size={18} />
          </span>
        </a>
      </section>
      <section className="section house-paths">
        <a href="/events">
          <span className="eyebrow">Premier events</span>
          <h3>The next gathering.</h3>
          <p>Dates will appear here when confirmed.</p>
          <ArrowUpRight />
        </a>
        <a href="/coaching">
          <span className="eyebrow">Founder conversations</span>
          <h3>Make your next move.</h3>
          <p>A thoughtful conversation about what you are building.</p>
          <ArrowUpRight />
        </a>
        <a href="/journal">
          <span className="eyebrow">The journal</span>
          <h3>Things worth asking.</h3>
          <p>Notes on jewellery, identity and perspective.</p>
          <ArrowUpRight />
        </a>
      </section>
    </main>
  );
}
