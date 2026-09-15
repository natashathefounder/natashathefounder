import { useState } from "react";
import { ArrowUpRight, Instagram } from "lucide-react";

export function InstagramProfile() {
  const [loaded, setLoaded] = useState(false);
  return (
    <section className="instagram-section section" aria-labelledby="instagram-heading">
      <div className="instagram-copy">
        <p className="eyebrow">A window into Natasha’s world</p>
        <h2 id="instagram-heading">Beyond the jewellery.</h2>
        <p>Follow the conversations, moments and details shared by @natasha.thefounder.</p>
        <a
          className="text-link"
          href="https://www.instagram.com/natasha.thefounder/"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Instagram <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="instagram-panel">
        <Instagram size={28} strokeWidth={1.2} aria-hidden="true" />
        <h3>@natasha.thefounder</h3>
        <p className="small">
          Loading this profile connects to Instagram, which may use cookies and receive information
          about your visit.
        </p>
        <button
          className="button"
          aria-expanded={loaded}
          aria-controls="instagram-profile-frame"
          onClick={() => setLoaded(!loaded)}
        >
          {loaded ? "Hide Instagram" : "Load Instagram"}
        </button>
        <div id="instagram-profile-frame">
          {loaded && (
            <iframe
              title="Natasha The Founder’s public Instagram profile"
              src="https://www.instagram.com/natasha.thefounder/embed/"
              width="540"
              height="620"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
        <p className="small">
          If the profile doesn’t appear,{" "}
          <a
            href="https://www.instagram.com/natasha.thefounder/"
            target="_blank"
            rel="noopener noreferrer"
          >
            open it on Instagram ↗
          </a>
          .
        </p>
      </div>
    </section>
  );
}
