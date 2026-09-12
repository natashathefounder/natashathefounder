import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState, useRef } from "react";
import { INSTAGRAM_FOUNDER, SHOP } from "@/lib/catalog";

const links = [
  { to: "/", label: "The story" },
  { to: "/shop", label: "ORA edit" },
  { to: "/stack", label: "Charm atelier" },
  { to: "/custom", label: "Made for you" },
  { to: "/coaching", label: "Founder to founder" },
  { to: "/studio", label: "The studio" },
  { to: "/members", label: "The Private List" },
] as const;
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const close = () => {
    setOpen(false);
    menuButton.current?.focus();
  };
  return (
    <div className="site-house">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header
        className="house-header"
        onKeyDown={(e) => {
          if (e.key === "Escape") close();
        }}
      >
        <div className="header-row">
          <Link to="/" className="wordmark" onClick={() => setOpen(false)}>
            Natasha<span>THE FOUNDER</span>
          </Link>
          <nav aria-label="Main navigation" className="desktop-nav">
            {links.slice(0, 6).map((l) => (
              <Link key={l.to} to={l.to} aria-current={pathname === l.to ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link className="private-nav" to="/members">
            The Private List <ArrowUpRight size={13} />
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="house-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav id="house-menu" className="mobile-nav" aria-label="Mobile navigation">
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                aria-current={pathname === l.to ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span>0{i + 1}</span>
                {l.label}
                <ArrowUpRight size={18} />
              </Link>
            ))}
            <a href={SHOP} target="_blank" rel="noreferrer">
              Shop ORA ↗
            </a>
          </nav>
        )}
      </header>
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <footer className="house-footer">
        <div className="footer-invitation">
          <p className="eyebrow">This is only the beginning</p>
          <Link to="/members">
            A little <em>closer?</em>
            <ArrowUpRight />
          </Link>
          <p>The Private List. New work, private offers and invitations from me.</p>
        </div>
        <div className="footer-bottom">
          <Link to="/" className="wordmark">
            Natasha<span>THE FOUNDER</span>
          </Link>
          <p>
            Jewellery. Instinct. A life in the making.
            <br />
            Natasha Collins · ORA Jewellery
          </p>
          <div>
            <a href={INSTAGRAM_FOUNDER} target="_blank" rel="noreferrer">
              Follow the story ↗
            </a>
            <a href={SHOP} target="_blank" rel="noreferrer">
              Shop ORA ↗
            </a>
            <Link to="/studio">Get in touch ↗</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
