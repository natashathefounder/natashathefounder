import { StudioPhotograph } from "@/components/studio-photograph";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { getCatalogue } from "@/lib/commerce/catalogue";
import { ProductGrid, CommerceEmpty, Loading } from "@/components/commerce";
import { pageHead } from "@/lib/seo";
import { ShoppingGuide, charmSystems } from "@/components/shopping-guide";
import { imageUrl } from "@/lib/commerce/types";
const categories = [
  { title: "Charms", type: "Clip Charm", href: "/shop?q=charm" },
  { title: "Bracelets", type: "Bracelets", href: "/shop?type=Bracelets" },
  { title: "Necklaces", type: "Necklaces", href: "/shop?type=Necklaces" },
  { title: "Earrings", type: "Earrings", href: "/shop?type=Earrings" },
];
export const Route = createFileRoute("/")({
  loader: async () => {
    const [catalogue, ...edits] = await Promise.all([
      getCatalogue({ data: { sort: "featured" } }),
      ...categories.map(({ type }) => getCatalogue({ data: { type, sort: "featured" } })),
    ]);
    return {
      ...catalogue,
      products: catalogue.products.filter((product) =>
        /ring|bracelet|necklace|earring|charm|bangle|chain|pendant|hoop/i.test(product.productType),
      ),
      categoryImages: edits.map(
        (edit) => edit.products.find((p) => p.featuredImage)?.featuredImage,
      ),
    };
  },
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
  const { products, unavailable, categoryImages } = Route.useLoaderData();
  return (
    <main>
      <section className="shop-hero">
        <figure>
          {" "}
          <img
            src="https://cdn.shopify.com/s/files/1/1032/8047/6489/files/ora-original-site-campaign.jpg?v=1789462631&width=1440"
            srcSet="https://cdn.shopify.com/s/files/1/1032/8047/6489/files/ora-original-site-campaign.jpg?v=1789462631&width=640 640w, https://cdn.shopify.com/s/files/1/1032/8047/6489/files/ora-original-site-campaign.jpg?v=1789462631&width=1440 1440w, https://cdn.shopify.com/s/files/1/1032/8047/6489/files/ora-original-site-campaign.jpg?v=1789462631&width=2048 2048w"
            sizes="100vw"
            width="2048"
            height="1140"
            fetchPriority="high"
            alt="Model wearing a charm necklace, hoop earrings and two bracelets with a white shirt"
          />
        </figure>
        <div className="shop-hero-copy">
          <p className="eyebrow">ORA JEWELLERY · THE HOUSE OF NATASHA</p>
          <h1>
            Your story.
            <br />
            <i>Wear it your way.</i>
          </h1>
          <div className="shop-hero-actions">
            <a className="button" href="/shop">
              Shop jewellery <ArrowUpRight size={18} />
            </a>
            <a className="text-link" href="/shop?q=charm">
              Explore charms <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>
      <section className="shopping-categories section" aria-label="Shop by category">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Find your starting point</p>
            <h2>What speaks to you?</h2>
          </div>
        </div>
        <div className="category-photo-grid">
          {categories.map((category, index) => {
            const photo = categoryImages[index];
            return (
              <a href={category.href} key={category.title}>
                <div className="category-photo">
                  {photo && (
                    <img
                      src={imageUrl(photo.url, 640)}
                      srcSet={
                        imageUrl(photo.url, 320) + " 320w, " + imageUrl(photo.url, 640) + " 640w"
                      }
                      sizes="(max-width:700px) 44vw, 23vw"
                      width={640}
                      height={640}
                      loading="lazy"
                      alt={photo.altText || category.title + " from ORA Jewellery"}
                    />
                  )}
                </div>
                <span>
                  {category.title}
                  <ArrowUpRight size={20} />
                </span>
              </a>
            );
          })}
        </div>
      </section>
      <section className="home-connections section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A little direction</p>
            <h2>Start with the connection.</h2>
          </div>
          <ShoppingGuide />
        </div>
        <div className="connection-grid">
          {charmSystems.map(({ name, icon: Icon, description }) => (
            <article key={name}>
              <Icon size={32} strokeWidth={1} />
              <h3>{name}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <p className="connection-note">
          Three different systems. Check the exact charm and base before combining them.{" "}
          <a href="/stack">Explore the guide ↗</a>
        </p>
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
      <section className="home-reassurance section" aria-label="Choose with confidence">
        <a href="/pages/craftsmanship">
          <h3>Know your materials.</h3>
          <p>Look closer at the metal, finish and care for your piece.</p>
        </a>
        <a href="/contact">
          <h3>Ask a real question.</h3>
          <p>Fit, materials or a special occasion? Begin a conversation.</p>
        </a>
        <a href="/pages/delivery">
          <h3>Before it is yours.</h3>
          <p>Review delivery and returns. Delivery options appear at checkout.</p>
        </a>
      </section>
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
      <section className="perspective-split">
        <div className="philosophy-studio">
          <StudioPhotograph kind="sketching" />
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
      <section className="founder-studio section">
        <StudioPhotograph />
        <div>
          <p className="eyebrow">Natasha Collins — The Founder</p>
          <h2>
            A point of view.
            <br />
            <i>A pair of hands.</i>
          </h2>
          <p>
            Jewellery designer, founder, coach and storyteller. In the studio, Natasha brings ideas
            into focus — sketch by sketch, conversation by conversation.
          </p>
          <a className="text-link" href="/pages/natasha">
            Meet Natasha <ArrowUpRight size={16} />
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
