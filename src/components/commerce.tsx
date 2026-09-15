import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ArrowUpRight, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Cart, Product } from "@/lib/commerce/types";
import { money, imageUrl } from "@/lib/commerce/types";
import { predictiveSearch } from "@/lib/commerce/catalogue";
type BagAction =
  | { action: "add"; variantId: string; quantity: number }
  | { action: "update"; lineId: string; quantity: number }
  | { action: "remove"; lineId: string }
  | { action: "reset" };
const BagContext = createContext<{
  cart: Cart | null;
  busy: boolean;
  error: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  act: (a: BagAction) => Promise<boolean>;
  reload: () => void;
} | null>(null);
export function useBag() {
  const c = useContext(BagContext);
  if (!c) throw new Error("Bag provider missing");
  return c;
}
export function BagProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [open, setOpen] = useState(false),
    [message, setMessage] = useState("");
  const pending = useRef(false);
  const reload = () => {
    fetch("/api/bag")
      .then((r) => r.json())
      .then((r) => {
        if (r.error) setError(r.error);
        else {
          setCart(r.cart);
          setError("");
        }
      })
      .catch(() => setError("Your bag is unavailable. Please retry."));
  };
  useEffect(() => {
    reload();
  }, []);
  async function act(a: BagAction) {
    if (pending.current) return false;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/bag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(a),
      });
      const r = await response.json();
      if (!response.ok) throw new Error(r.error || "Please try again.");
      setCart(r.cart);
      setMessage(a.action === "add" ? "Added to your bag." : "Your bag has been updated.");
      if (a.action === "add") setOpen(true);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
      return false;
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <BagContext.Provider value={{ cart, busy, error, open, setOpen, act, reload }}>
      {children}
      <span className="sr-only" role="status" aria-live="polite">
        {message}
      </span>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-shade" />
          <Dialog.Content className="bag-drawer">
            <header>
              <Dialog.Title>Your bag</Dialog.Title>
              <Dialog.Close className="icon-button" aria-label="Close bag">
                <X />
              </Dialog.Close>
            </header>
            <Dialog.Description className="muted">
              A few things worth keeping close.
            </Dialog.Description>
            <BagContents />
            <a className="text-link" href="/cart">
              View full bag <ArrowUpRight size={16} />
            </a>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </BagContext.Provider>
  );
}
export function BagContents() {
  const { cart, busy, error, act, reload } = useBag();
  return (
    <div className="bag-content" aria-busy={busy}>
      {error && (
        <div role="alert" className="notice">
          <p>{error}</p>
          <button onClick={reload}>Retry</button>
          <button
            disabled={busy}
            onClick={() => {
              if (window.confirm("Clear this bag and begin again?")) void act({ action: "reset" });
            }}
          >
            Start a new bag
          </button>
        </div>
      )}
      {!cart?.totalQuantity ? (
        <div className="empty-state">
          <ShoppingBag size={32} />
          <h2>
            Leave room for
            <br />
            <i>something personal.</i>
          </h2>
          <p>Your bag is empty. Find the piece that feels like you.</p>
          <a href="/shop" className="button">
            Explore the collection
          </a>
        </div>
      ) : (
        <>
          <ul className="bag-lines">
            {cart.lines.nodes.map((line) => (
              <li key={line.id}>
                {line.merchandise.image && (
                  <img
                    src={imageUrl(line.merchandise.image.url, 200)}
                    width="100"
                    height="125"
                    alt={line.merchandise.image.altText || line.merchandise.product.title}
                  />
                )}
                <div>
                  <a href={`/products/${line.merchandise.product.handle}`}>
                    {line.merchandise.product.title}
                  </a>
                  <p className="small muted">{line.merchandise.title}</p>
                  <p>{money(line.cost.totalAmount)}</p>
                  <div className="quantity">
                    <button
                      disabled={busy || line.quantity <= 1}
                      aria-label={`Decrease quantity of ${line.merchandise.product.title}`}
                      onClick={() =>
                        void act({ action: "update", lineId: line.id, quantity: line.quantity - 1 })
                      }
                    >
                      <Minus size={14} />
                    </button>
                    <span aria-label="Quantity">{line.quantity}</span>
                    <button
                      disabled={busy || line.quantity >= 99}
                      aria-label={`Increase quantity of ${line.merchandise.product.title}`}
                      onClick={() =>
                        void act({ action: "update", lineId: line.id, quantity: line.quantity + 1 })
                      }
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      className="remove"
                      disabled={busy}
                      onClick={() => void act({ action: "remove", lineId: line.id })}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bag-summary">
            <p>
              <span>Subtotal</span>
              <span>{money(cart.cost.subtotalAmount)}</span>
            </p>
            <p>
              <span>Estimated total</span>
              <span>{money(cart.cost.totalAmount)}</span>
            </p>
            <p className="small muted">
              Shipping, applicable taxes and final totals are confirmed at Shopify checkout. Enter
              eligible discount codes there.
            </p>
            {!busy && !error && (
              <a className="button full" href={cart.checkoutUrl}>
                Continue to secure checkout <ArrowUpRight size={17} />
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
export function ProductCard({ product: p }: { product: Product }) {
  return (
    <article className="product-card">
      <a href={`/products/${p.handle}`}>
        <div className="product-image">
          {p.featuredImage ? (
            <img
              src={imageUrl(p.featuredImage.url, 640)}
              srcSet={`${imageUrl(p.featuredImage.url, 360)} 360w, ${imageUrl(p.featuredImage.url, 640)} 640w, ${imageUrl(p.featuredImage.url, 960)} 960w`}
              sizes="(max-width:600px) 46vw, (max-width:1000px) 45vw, 23vw"
              width={p.featuredImage.width || 640}
              height={p.featuredImage.height || 800}
              loading="lazy"
              alt={p.featuredImage.altText || p.title}
            />
          ) : (
            <span className="image-placeholder">
              ORA
              <br />
              <small>Image forthcoming</small>
            </span>
          )}
          <span className="card-arrow">
            <ArrowUpRight size={20} />
          </span>
          {!p.availableForSale && <span className="stock-label">Currently unavailable</span>}
        </div>
        <div className="card-meta">
          <p className="eyebrow">{p.productType || "ORA Jewellery"}</p>
          <h3>{p.title}</h3>
          <p className="small">From {money(p.priceRange.minVariantPrice)}</p>
        </div>
      </a>
    </article>
  );
}
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
export function CommerceEmpty({ unavailable = false }: { unavailable?: boolean }) {
  return (
    <div className="empty-state">
      <span className="eyebrow">The ORA edit</span>
      <h2>
        {unavailable ? "The collection is taking a moment." : "A little space for what comes next."}
      </h2>
      <p>
        {unavailable
          ? "We cannot load the live collection right now. Please try again, or write to us about a piece you have in mind."
          : "No pieces match this selection. Explore another edit or clear your filters."}
      </p>
      <div className="actions">
        <a className="button" href="/shop">
          {unavailable ? "Try the collection again" : "View all pieces"}
        </a>
        <a className="text-link" href="/contact">
          Talk to us <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
}
export function Loading() {
  return (
    <main className="section" aria-busy="true">
      <p role="status">Opening the house…</p>
      <div className="skeleton-grid">
        {[1, 2, 3, 4].map((n) => (
          <div className="skeleton" key={n} />
        ))}
      </div>
    </main>
  );
}
export function PredictiveSearch() {
  const [q, setQ] = useState(""),
    [results, setResults] = useState<Product[]>([]);
  useEffect(() => {
    let active = true;
    const t = setTimeout(() => {
      void predictiveSearch({ data: q }).then((r) => {
        if (active) setResults(r);
      });
    }, 300);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [q]);
  return (
    <div className="search-block">
      <form action="/search">
        <label htmlFor="house-search">Find your piece</label>
        <div className="search-field">
          <input
            id="house-search"
            name="q"
            type="search"
            placeholder="A ring, a charm, a feeling…"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button aria-label="Search collection">
            <ArrowUpRight />
          </button>
        </div>
      </form>
      {results.length > 0 && (
        <ul aria-label="Suggested products" className="search-results">
          {results.map((p) => (
            <li key={p.id}>
              <a href={`/products/${p.handle}`}>
                {p.title}
                <span>{money(p.priceRange.minVariantPrice)}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
