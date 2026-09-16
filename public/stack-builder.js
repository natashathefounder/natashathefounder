(() => {
  if (customElements.get("ora-stack-builder")) return;
  const el = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  customElements.define(
    "ora-stack-builder",
    class extends HTMLElement {
      connectedCallback() {
        if (this.ready) return;
        this.ready = true;
        this.chosenBase = null;
        this.charms = new Map();
        this.pending = false;
        try {
          this.products = JSON.parse(
            this.querySelector('script[type="application/json"]').textContent,
          );
        } catch {
          this.replaceChildren(
            el("p", "The builder could not load. Please refresh or browse the collection."),
          );
          return;
        }
        if (this.dataset.mode === "shopify") {
          this.products = this.products.filter(Boolean).map((item) => {
            const p = item.product;
            return {
              handle: p.handle,
              title: p.title,
              base: item.base,
              image: p.featured_image || p.images?.[0] || "",
              variants: p.variants
                .filter((v) => item.base || /(?:^|\/)\s*Charm(?: Only)?\s*(?:\/|$)/i.test(v.title))
                .map((v) => ({
                  id: String(v.id),
                  image: v.featured_image?.src || p.featured_image || "",
                  title: v.title,
                  available: v.available,
                  price: v.price / 100,
                  currency: this.dataset.currency || "GBP",
                })),
            };
          });
        }
        this.products = this.products.filter((p) => p.variants.length);
        this.replaceChildren();
        this.append(
          el("p", "GLIDE & STACK / YOUR PERSONAL EDIT", "eyebrow"),
          el(this.dataset.mode === "shopify" ? "h1" : "h2", "Build something that is yours."),
        );
        this.append(
          el(
            "p",
            "Choose one slider chain, then add your charms. This builder uses the Glide & Stack pieces listed in ORA’s original stack edit; hoop and clip charms are kept separate. Charms are selected without an additional chain.",
            "stack-intro",
          ),
        );
        const layout = el("div", null, "stack-layout"),
          catalogue = el("div"),
          aside = el("aside", null, "stack-summary");
        aside.setAttribute("aria-label", "Your stack");
        this.summary = aside;
        aside.id = "ora-stack-summary";
        const review = el("a", "Review your stack ↓", "text-link stack-review");
        review.href = "#ora-stack-summary";
        this.append(review);
        this.append(layout);
        layout.append(catalogue, aside);
        const bases = this.products.filter((p) => p.base),
          charms = this.products.filter((p) => !p.base);
        catalogue.append(el("h3", "1. Choose your slider chain"));
        const baseGrid = el("div", null, "stack-products");
        catalogue.append(baseGrid);
        bases.forEach((p) => baseGrid.append(this.card(p)));
        if (!bases.length)
          baseGrid.append(el("p", "Slider chains are not available in this catalogue right now."));
        catalogue.append(el("h3", "2. Add the charms that speak to you"));
        const searchLabel = el("label", "Find a charm", "stack-search");
        const search = el("input");
        search.type = "search";
        search.placeholder = "Heart, letter, birthstone…";
        searchLabel.append(search);
        catalogue.append(searchLabel);
        const charmGrid = el("div", null, "stack-products");
        catalogue.append(charmGrid);
        const cards = charms.map((p) => ({ p, node: this.card(p) }));
        cards.forEach((c) => charmGrid.append(c.node));
        const noMatches = el("p", "No matching charms in this edit. Try another search.");
        noMatches.hidden = true;
        catalogue.append(noMatches);
        search.addEventListener("input", () => {
          let visible = 0;
          cards.forEach((c) => {
            c.node.hidden = !c.p.title.toLowerCase().includes(search.value.toLowerCase());
            if (!c.node.hidden) visible++;
          });
          noMatches.hidden = visible > 0;
        });
        if (!charms.length)
          charmGrid.append(
            el("p", "The charm edit is unavailable right now. Please try again later."),
          );
        this.status = el("p", null, "stack-status");
        this.status.setAttribute("role", "status");
        this.append(this.status);
        this.renderSummary();
      }
      format(v) {
        return new Intl.NumberFormat("en-GB", { style: "currency", currency: v.currency }).format(
          v.price,
        );
      }
      card(p) {
        const card = el("article", null, "stack-product");
        if (p.image) {
          const image = el("img");
          image.src = p.image + (p.image.includes("?") ? "&" : "?") + "width=360";
          image.alt = p.title;
          image.width = 360;
          image.height = 360;
          image.loading = "lazy";
          card.append(image);
        }
        const link = el("a", p.title);
        link.href = "/products/" + encodeURIComponent(p.handle);
        card.append(link);
        const label = el("label", "Choose an option");
        const select = el("select");
        label.append(select);
        card.append(label);
        p.variants.forEach((v) => {
          const option = el("option", v.title + (v.available ? "" : " — Sold out"));
          option.value = v.id;
          option.disabled = !v.available;
          select.append(option);
        });
        const first = p.variants.find((v) => v.available) || p.variants[0];
        if (first) select.value = first.id;
        const price = el("p", first ? this.format(first) : "Unavailable", "stack-price");
        card.append(price);
        select.addEventListener("change", () => {
          const v = p.variants.find((v) => v.id === select.value);
          if (v) {
            price.textContent = this.format(v);
            const img = card.querySelector("img");
            if (img && v.image) {
              img.src = v.image + (v.image.includes("?") ? "&" : "?") + "width=360";
              img.alt = p.title + " — " + v.title;
            }
          }
        });
        const button = el("button", p.base ? "Choose chain" : "Add charm", "button");
        button.type = "button";
        button.disabled = !p.variants.some((v) => v.available);
        button.addEventListener("click", () => {
          if (this.pending) return;
          const variant = p.variants.find((v) => v.id === select.value);
          if (!variant?.available) return;
          const item = { product: p, variant, quantity: 1 };
          if (p.base) {
            this.chosenBase = item;
          } else {
            const total = [...this.charms.values()].reduce((n, c) => n + c.quantity, 0);
            if (total >= 15) {
              this.status.textContent =
                "You can add up to 15 charms to one selection. This is not a guarantee of physical chain capacity.";
              return;
            }
            const current = this.charms.get(variant.id);
            if (current && current.quantity >= 10) {
              this.status.textContent = "Maximum 10 of one charm per selection.";
              return;
            }
            item.quantity = (current?.quantity || 0) + 1;
            this.charms.set(variant.id, item);
          }
          this.status.textContent = p.title + " selected.";
          this.renderSummary();
        });
        card.append(button);
        return card;
      }
      renderSummary() {
        this.summary.replaceChildren(
          el("p", "YOUR STACK", "eyebrow"),
          el("h3", "A little more you."),
        );
        const items = [...(this.chosenBase ? [this.chosenBase] : []), ...this.charms.values()];
        if (!this.chosenBase) this.summary.append(el("p", "Choose a slider chain to begin."));
        if (!this.charms.size) this.summary.append(el("p", "Add at least one charm."));
        items.forEach((item) => {
          const row = el("div", null, "stack-line");
          if (item.variant.image || item.product.image) {
            const im = el("img");
            im.src =
              item.product.image + (item.product.image.includes("?") ? "&" : "?") + "width=120";
            im.alt = "";
            im.width = 64;
            im.height = 64;
            row.append(im);
          }
          const body = el("div");
          body.append(el("strong", item.product.title));
          if (item.variant.title !== "Default Title") body.append(el("p", item.variant.title));
          body.append(
            el("p", this.format({ ...item.variant, price: item.variant.price * item.quantity })),
          );
          const controls = el("div", null, "stack-line-controls");
          if (!item.product.base) {
            const minus = el("button", "−");
            minus.type = "button";
            minus.setAttribute("aria-label", "Remove one " + item.product.title);
            const plus = el("button", "+");
            plus.type = "button";
            plus.setAttribute("aria-label", "Add one " + item.product.title);
            minus.disabled = this.pending;
            plus.disabled =
              this.pending ||
              item.quantity >= 10 ||
              [...this.charms.values()].reduce((n, c) => n + c.quantity, 0) >= 15;
            minus.addEventListener("click", () => {
              if (item.quantity > 1) item.quantity--;
              else this.charms.delete(item.variant.id);
              this.renderSummary();
              this.status.textContent = "Stack updated.";
            });
            plus.addEventListener("click", () => {
              item.quantity++;
              this.renderSummary();
              this.status.textContent = "Stack updated.";
            });
            controls.append(minus, el("span", String(item.quantity)), plus);
          }
          const remove = el("button", "Remove");
          remove.type = "button";
          remove.disabled = this.pending;
          remove.setAttribute("aria-label", "Remove " + item.product.title);
          remove.addEventListener("click", () => {
            if (item.product.base) this.chosenBase = null;
            else this.charms.delete(item.variant.id);
            this.renderSummary();
            this.status.textContent = "Piece removed.";
          });
          controls.append(remove);
          body.append(controls);
          row.append(body);
          this.summary.append(row);
        });
        const currencies = new Set(items.map((i) => i.variant.currency));
        if (items.length)
          this.summary.append(
            el(
              "p",
              "Subtotal " +
                this.format({
                  price: items.reduce((n, i) => n + i.variant.price * i.quantity, 0),
                  currency: items[0].variant.currency,
                }),
              "stack-total",
            ),
          );
        this.summary.append(
          el(
            "p",
            "Delivery and any applicable taxes or duties are confirmed at checkout. Product photos show your selection, not a to-scale fit simulation.",
            "small",
          ),
        );
        const add = el(
          "button",
          this.pending ? "Adding your stack…" : "Add stack to bag",
          "button",
        );
        add.type = "button";
        add.disabled =
          this.pending || !this.chosenBase || !this.charms.size || currencies.size !== 1;
        add.addEventListener("click", () => this.addStack(items));
        this.summary.append(add);
        const bag = el("a", "View your bag ↗", "text-link");
        bag.href = "/cart";
        this.summary.append(bag);
      }
      async addStack(items) {
        if (this.pending) return;
        this.pending = true;
        this.renderSummary();
        this.status.textContent = "Adding your selection…";
        try {
          const native = this.dataset.mode === "shopify";
          const root = window.Shopify?.routes?.root || "/";
          const response = await fetch(native ? root + "cart/add.js" : "/api/bag", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              native
                ? { items: items.map((i) => ({ id: i.variant.id, quantity: i.quantity })) }
                : {
                    action: "addStack",
                    lines: items.map((i) => ({ variantId: i.variant.id, quantity: i.quantity })),
                  },
            ),
          });
          const result = await response.json();
          if (!response.ok || result.error || result.status >= 400)
            throw new Error(
              result.error || result.description || "Some pieces could not be added.",
            );
          this.status.textContent = "Your stack is in your bag.";
          window.location.assign(root + "cart");
        } catch (error) {
          this.status.textContent =
            (error.message || "The request could not be confirmed.") +
            " Please check your bag before trying again.";
          this.pending = false;
          this.renderSummary();
        }
      }
    },
  );
})();
