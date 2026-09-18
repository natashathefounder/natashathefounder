import { useState, type ReactNode } from "react";
import { Menu, X, ShoppingBag, ArrowUpRight, Search, Gem, UserRound } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { BagProvider, useBag, PredictiveSearch } from "./commerce";
import { DressUp } from "./dress-up";
import { LetterGame } from "./letter-game";
import { InstagramProfile } from "./instagram-profile";
const links = [
  ["The collection", "/shop"],
  ["Build your charm stack", "/stack"],
  ["Natasha", "/pages/natasha"],
  ["The private salon", "/members"],
];
function Shell({ children }: { children: ReactNode }) {
  const { cart, setOpen } = useBag();
  const [search, setSearch] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="announcement">
        ORA JEWELLERY <span>·</span> PLAY FOR 10% OFF WITH LETTER CHARMS
      </div>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Natasha The Founder home">
          natasha<span>THE FOUNDER</span>
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map(([label, url]) => (
            <a key={url} href={url}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <LetterGame className="desktop-guide guide-trigger" />
          <DressUp className="desktop-guide guide-trigger" />
          <button
            className="icon-button"
            aria-label="Search"
            onClick={() => setSearch(!search)}
            aria-expanded={search}
          >
            {search ? <X size={19} /> : <Search size={19} />}
          </button>
          <button
            className="bag-button"
            aria-label={`Open bag, ${cart?.totalQuantity || 0} items`}
            onClick={() => setOpen(true)}
          >
            <ShoppingBag size={18} />
            <span>{cart?.totalQuantity || 0}</span>
          </button>
          <Dialog.Root>
            <Dialog.Trigger className="icon-button mobile-menu" aria-label="Open navigation">
              <Menu />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-shade" />
              <Dialog.Content className="mobile-nav">
                <Dialog.Title className="eyebrow">The house of Natasha</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Explore the collection and stories.
                </Dialog.Description>
                <Dialog.Close className="icon-button" aria-label="Close navigation">
                  <X />
                </Dialog.Close>
                <nav>
                  {[
                    ...links,
                    ["Custom jewellery", "/custom"],
                    ["Coaching", "/coaching"],
                    ["Journal", "/journal"],
                    ["Contact", "/contact"],
                  ].map(([label, url]) => (
                    <a key={url} href={url}>
                      {label}
                    </a>
                  ))}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
      {search && (
        <section className="search-panel">
          <PredictiveSearch />
        </section>
      )}
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <nav className="mobile-shopping-nav" aria-label="Quick shopping navigation">
        <a href="/shop">
          <Gem size={19} />
          Shop
        </a>
        <DressUp label="Make" className="mobile-guide" />
        <LetterGame label="Play" className="mobile-guide" />
        <button onClick={() => setOpen(true)}>
          <ShoppingBag size={19} />
          Bag ({cart?.totalQuantity || 0})
        </button>
      </nav>
      <InstagramProfile />
      <section className="newsletter section">
        <div>
          <p className="eyebrow">Letters from the house</p>
          <h2>A closer conversation.</h2>
          <p>New perspectives, new pieces and invitations worth opening.</p>
        </div>
        <div>
          <a className="button light" href="/contact?topic=newsletter">
            Ask to join the letters <ArrowUpRight size={16} />
          </a>
          <p className="small">Tell us you would like to hear from us. No automatic enrolment.</p>
        </div>
      </section>
      <footer className="footer section">
        <div className="footer-top">
          <a className="wordmark" href="/">
            natasha<span>THE FOUNDER</span>
          </a>
          <p>Jewellery. Perspective. Possibility.</p>
        </div>
        <div className="footer-grid">
          <div>
            <p className="eyebrow">The collection</p>
            <a href="/shop">All jewellery</a>
            <a href="/stack">Build your charm stack</a>
            <a href="/custom">Something personal</a>
            <a href="/cart">Your bag</a>
          </div>
          <div>
            <p className="eyebrow">The house</p>
            <a href="/pages/natasha">Natasha Collins</a>
            <a href="/pages/ora">ORA Jewellery</a>
            <a href="/pages/transparency">Provenance & transparency</a>
            <a href="/pages/craftsmanship">Craftsmanship</a>
          </div>
          <div>
            <p className="eyebrow">Come closer</p>
            <a href="/members">The private salon</a>
            <a href="/events">Premier events</a>
            <a href="/coaching">Founder conversations</a>
            <a href="/journal">Journal</a>
          </div>
          <div>
            <p className="eyebrow">At your service</p>
            <a href="/contact">Contact</a>
            <a href="/pages/delivery">Delivery & returns</a>
            <a href="/pages/privacy">Privacy</a>
            <a href="/pages/terms">Terms</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Natasha The Founder / ORA Jewellery</span>
          <span>United Kingdom · GBP £</span>
          <a href="https://www.instagram.com/natasha.thefounder/" target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
        </div>
      </footer>
    </>
  );
}
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <BagProvider>
      <Shell>{children}</Shell>
    </BagProvider>
  );
}
