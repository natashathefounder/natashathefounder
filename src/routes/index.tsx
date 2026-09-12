import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { chapters } from "@/lib/catalog";

export const Route = createFileRoute("/")({ component: Home });
function Home() {
  return (
    <main>
      <section className="opening">
        <div className="opening-top">
          <p className="eyebrow">The world of Natasha Collins</p>
          <span className="eyebrow">Founder · Designer · A work in progress</span>
        </div>
        <div className="opening-grid">
          <div className="opening-copy">
            <h1>
              A life.
              <br />A little gold.
              <br />
              <em>My own way.</em>
            </h1>
            <p>
              I’m Natasha. I make jewellery, build a business, and share what happens along the way.
              Welcome to my corner of the world.
            </p>
            <Link className="text-link" to="/shop">
              Step into ORA <ArrowUpRight size={17} />
            </Link>
            <a className="opening-scroll" href="#story">
              <ArrowDown size={16} />
              There’s a story behind it
            </a>
          </div>
          <figure className="opening-image">
            <img
              src="/media/hoop-charms.jpg"
              alt="Gold ORA hoop and charms on a pale textured surface"
              fetchPriority="high"
            />
            <figcaption>
              <span>01 / THE OBJECTS</span>
              <span>Small things. Entire stories.</span>
            </figcaption>
            <span className="image-note">Worn your way.</span>
          </figure>
        </div>
        <div className="opening-bottom">
          <span>ORA JEWELLERY</span>
          <span>HERE. NOW. ALWAYS.</span>
          <span>COME AS YOU ARE.</span>
        </div>
      </section>
      <section className="founder-note editorial-container">
        <p className="eyebrow">A note from me</p>
        <blockquote>
          “I don’t want to make things
          <br className="hidden md:block" /> you save for <em>someday.</em>”
        </blockquote>
        <div>
          <p>
            Jewellery should belong to your life. The ordinary days. The turning points. The
            versions of yourself you haven’t met yet.
          </p>
          <span className="signature">Natasha x</span>
        </div>
      </section>
      <section className="story-section" id="story">
        <div className="editorial-container story-grid">
          <div className="story-heading">
            <p className="eyebrow">01 / The founder diary</p>
            <h2>
              Not a straight line.
              <br />
              <em>A story.</em>
            </h2>
            <figure>
              <img
                src="/media/studio.jpg"
                alt="Details from the jewellery workbench"
                loading="lazy"
              />
              <figcaption>The work behind the work.</figcaption>
            </figure>
          </div>
          <div className="story-chapters">
            {chapters.map((c) => (
              <article key={c.num}>
                <span className="chapter-number">{c.num}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))}
            <Link className="text-link" to="/coaching">
              Building something of your own? ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="house-edit editorial-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / Objects with a point of view</p>
            <h2>
              The ORA <em>edit.</em>
            </h2>
          </div>
          <Link to="/shop" className="text-link">
            The whole collection ↗
          </Link>
        </div>
        <div className="edit-grid">
          {[
            {
              to: "/stack" as const,
              image: "hoop-charms",
              name: "A little of everything you are.",
              label: "The charm atelier",
            },
            {
              to: "/shop" as const,
              image: "signet",
              name: "Leave your own mark.",
              label: "Rings & signatures",
            },
            {
              to: "/custom" as const,
              image: "necklace",
              name: "It could only be yours.",
              label: "Made for you",
            },
          ].map((item, i) => (
            <Link to={item.to} key={item.name} className="edit-item">
              <figure>
                <img src={`/media/${item.image}.jpg`} alt={item.label} loading="lazy" />
                <span>0{i + 1}</span>
              </figure>
              <p className="eyebrow">{item.label}</p>
              <h3>
                {item.name}
                <ArrowUpRight size={22} />
              </h3>
            </Link>
          ))}
        </div>
      </section>
      <section className="founder-conversation">
        <div className="editorial-container">
          <p className="eyebrow">03 / Founder to founder</p>
          <h2>
            You don’t have to
            <br />
            figure it all out <em>alone.</em>
          </h2>
          <div>
            <p>
              A straight conversation about the business you’re building. Bring the question you
              keep circling. We’ll start there.
            </p>
            <Link to="/coaching" className="text-link">
              Pull up a chair ↗
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
