import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getProduct } from "@/lib/commerce/catalogue";
import { ProductGrid, CommerceEmpty, Loading, useBag } from "@/components/commerce";
import { imageUrl, money, type Product } from "@/lib/commerce/types";
import { pageHead, jsonLd, SITE } from "@/lib/seo";
import { ShoppingGuide } from "@/components/shopping-guide";
export const Route = createFileRoute("/products/$handle")({
  loader: ({ params }) => getProduct({ data: params.handle }),
  pendingComponent: Loading,
  head: ({ loaderData, params }) =>
    pageHead(
      `${loaderData?.product?.seo.title || loaderData?.product?.title || "Piece"} — ORA Jewellery`,
      loaderData?.product?.seo.description ||
        loaderData?.product?.description.slice(0, 155) ||
        "Explore a piece from ORA Jewellery.",
      `/products/${params.handle}`,
    ),
  component: ProductPage,
});
function ProductPage() {
  const { product: p, related, unavailable } = Route.useLoaderData();
  if (!p)
    return (
      <main className="section">
        <CommerceEmpty unavailable={unavailable} />
      </main>
    );
  return <ProductDetail key={p.id} p={p} related={related} />;
}
function ProductDetail({ p, related }: { p: Product; related: Product[] }) {
  const first = p.variants.nodes.find((v) => v.availableForSale) || p.variants.nodes[0];
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(first?.selectedOptions.map((o) => [o.name, o.value]) || []),
  );
  const [image, setImage] = useState(0),
    [quantity, setQuantity] = useState(1),
    [added, setAdded] = useState(false);
  const bag = useBag();
  const variant = p.variants.nodes.find((v) =>
    v.selectedOptions.every((o) => selected[o.name] === o.value),
  );
  const currentImage = p.images.nodes[image] || p.featuredImage;
  const [recent, setRecent] = useState<Product[]>([]);
  useEffect(() => {
    let active = true;
    try {
      const handles = JSON.parse(localStorage.getItem("ora_recent_handles") || "[]") as string[];
      void Promise.all(
        handles
          .filter((h) => h !== p.handle)
          .slice(0, 4)
          .map((handle) => getProduct({ data: handle })),
      ).then((rows) => {
        if (active) setRecent(rows.flatMap((r) => (r.product ? [r.product] : [])));
      });
      localStorage.setItem(
        "ora_recent_handles",
        JSON.stringify([p.handle, ...handles.filter((h) => h !== p.handle)].slice(0, 5)),
      );
      localStorage.removeItem("ora_recent");
    } catch {
      /* optional device history */
    }
    return () => {
      active = false;
    };
  }, [p.handle]);
  const structured = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description,
    image: p.images.nodes.map((i) => i.url),
    brand: { "@type": "Brand", name: p.vendor || "ORA Jewellery" },
    offers: p.variants.nodes.map((v) => ({
      "@type": "Offer",
      price: v.price.amount,
      priceCurrency: v.price.currencyCode,
      availability: `https://schema.org/${v.availableForSale ? "InStock" : "OutOfStock"}`,
      url: `${SITE}/products/${p.handle}`,
    })),
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structured) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE },
              { "@type": "ListItem", position: 2, name: "Shop", item: SITE + "/shop" },
              {
                "@type": "ListItem",
                position: 3,
                name: p.title,
                item: SITE + "/products/" + p.handle,
              },
            ],
          }),
        }}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">The house</a>
        <span>/</span>
        <a href="/shop">The collection</a>
        <span>/</span>
        <span>{p.title}</span>
      </nav>
      <div className="pdp">
        <div>
          <div className="gallery-main">
            {currentImage ? (
              <img
                src={imageUrl(currentImage.url, 1200)}
                srcSet={`${imageUrl(currentImage.url, 600)} 600w, ${imageUrl(currentImage.url, 1200)} 1200w`}
                sizes="(max-width:700px) 90vw, 50vw"
                width={currentImage.width || 1200}
                height={currentImage.height || 1500}
                fetchPriority="high"
                alt={currentImage.altText || p.title}
              />
            ) : (
              <span className="image-placeholder">Image forthcoming</span>
            )}
          </div>
          <div className="gallery-thumbs" aria-label="Product images">
            {p.images.nodes.map((m, i) => (
              <button
                key={m.url}
                aria-label={`View image ${i + 1}`}
                aria-pressed={image === i}
                onClick={() => setImage(i)}
              >
                <img width="75" height="85" loading="lazy" src={imageUrl(m.url, 150)} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="pdp-info">
          <p className="eyebrow">ORA JEWELLERY / {p.productType || "THE COLLECTION"}</p>
          <h1>{p.title}</h1>
          <p className="pdp-price">
            {variant ? money(variant.price) : `From ${money(p.priceRange.minVariantPrice)}`}
          </p>
          {p.options
            .filter((o) => !(o.name === "Title" && o.values[0] === "Default Title"))
            .map((option) => (
              <fieldset key={option.name}>
                <legend className="eyebrow">{option.name}</legend>
                <div className="option-values">
                  {option.values.map((value) => (
                    <button
                      key={value}
                      aria-pressed={selected[option.name] === value}
                      onClick={() => {
                        setSelected({ ...selected, [option.name]: value });
                        setAdded(false);
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          <div className="pdp-guidance">
            <span className="eyebrow">A confident choice starts with a question.</span>
            <ShoppingGuide product={p.title} label="Fit, materials or care?" />
            <p>Check the details for this exact piece. Ask us about anything you need confirmed.</p>
          </div>
          <div className="purchase-panel">
            <p className="small" role="status">
              {!variant
                ? "This combination is not available."
                : variant.availableForSale
                  ? "Available to add to your bag."
                  : "This selection is currently unavailable."}
            </p>
            <label className="quantity">
              <span className="sr-only">Quantity</span>
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((n) => n - 1)}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= 99}
                onClick={() => setQuantity((n) => n + 1)}
              >
                +
              </button>
            </label>
            <button
              className="button full"
              disabled={!variant?.availableForSale || bag.busy}
              onClick={async () => {
                if (variant)
                  setAdded(await bag.act({ action: "add", variantId: variant.id, quantity }));
              }}
            >
              {bag.busy
                ? "Adding…"
                : added
                  ? "Added to your bag"
                  : variant?.availableForSale
                    ? "Add to bag"
                    : "Unavailable"}
            </button>
            {bag.error && (
              <p role="alert" className="notice">
                {bag.error}
              </p>
            )}
          </div>
          <div className="pdp-description">
            {p.description ||
              "A fuller description is forthcoming. Please contact us for details before ordering."}
          </div>
          <div className="disclosures">
            <details open>
              <summary>Materials, dimensions & provenance</summary>
              <p>
                Confirmed product details appear in the description above. Where a material origin,
                craft location, dimension or certification is not specified, it has not been
                verified here.
              </p>
              <a href="/pages/transparency" className="text-link">
                Our transparency approach
              </a>
            </details>
            <details>
              <summary>Care for your piece</summary>
              <p>
                Care depends on the exact material and finish. Contact us for guidance for this
                piece before using chemical cleaners or specialist treatments.
              </p>
            </details>
            <details>
              <summary>Delivery & returns</summary>
              <p>
                Available delivery services and costs are shown at checkout. Contact us before
                ordering if you need a confirmed arrival date, made-to-order timeline or return
                terms.
              </p>
              <a className="text-link" href="/pages/delivery">
                Delivery information
              </a>
            </details>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <h2>More to discover.</h2>
          </div>
          <p className="small muted">An edit to explore, not a compatibility recommendation.</p>
          <ProductGrid products={related.slice(0, 4)} />
        </section>
      )}
      {recent.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <h2>A second look.</h2>
          </div>
          <p className="small muted">
            Recently viewed on this device. Open a piece for its current price and availability.
          </p>
          <ProductGrid products={recent} />
        </section>
      )}
    </main>
  );
}
