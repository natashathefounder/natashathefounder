import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, ArrowLeft, X, Sparkles } from "lucide-react";
import { products, type Product } from "@/lib/products";
import { productPath } from "@/lib/guide-picks";

const bases = products.filter((p) => p.category === "Necklaces" || p.category === "Bracelets");
const charms = products.filter((p) => p.category === "Charms");

function Photo({ product, tall }: { product: Product; tall?: boolean }) {
  return (
    <span
      style={{
        display: "block",
        background: "#e4ddd3",
        aspectRatio: tall ? "4 / 5" : "1",
        overflow: "hidden",
        marginBottom: 10,
      }}
    >
      <img
        src={product.image}
        alt=""
        width={480}
        height={480}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </span>
  );
}

function Stage({ base, charms: on }: { base: Product; charms: Product[] }) {
  return (
    <div
      style={{
        position: "relative",
        background: "#e4ddd3",
        aspectRatio: "4 / 5",
        margin: "12px 0 20px",
        overflow: "hidden",
      }}
      aria-label={`${base.name} with ${on.length} charm${on.length === 1 ? "" : "s"}`}
    >
      <img
        src={base.image}
        alt={base.name}
        width={640}
        height={800}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      {on.map((c, i) => (
        <img
          key={c.id}
          src={c.image}
          alt={c.name}
          width={200}
          height={200}
          style={{
            position: "absolute",
            width: "28%",
            height: "auto",
            left: `${18 + i * 22}%`,
            bottom: `${10 + (i % 2) * 8}%`,
            objectFit: "contain",
            filter: "drop-shadow(0 6px 10px #0004)",
          }}
        />
      ))}
    </div>
  );
}

export function DressUp({
  label = "Make a necklace",
  className = "guide-trigger",
}: {
  label?: string;
  className?: string;
}) {
  const [step, setStep] = useState<"base" | "charms" | "done">("base");
  const [base, setBase] = useState<Product | null>(null);
  const [picked, setPicked] = useState<Product[]>([]);

  function toggle(c: Product) {
    setPicked((list) => {
      if (list.some((x) => x.id === c.id)) return list.filter((x) => x.id !== c.id);
      if (list.length >= 3) return list;
      return [...list, c];
    });
  }

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (open) {
          setStep("base");
          setBase(null);
          setPicked([]);
        }
      }}
    >
      <Dialog.Trigger className={className}>
        <Sparkles size={18} />
        <span>{label}</span>
        <ArrowUpRight size={16} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-shade" />
        <Dialog.Content className="shopping-guide">
          <header>
            <span className="eyebrow">ORA / DRESS-UP</span>
            <Dialog.Close className="icon-button" aria-label="Close">
              <X />
            </Dialog.Close>
          </header>
          <Dialog.Title>
            {step === "base" && (
              <>
                First, the necklace.
                <br />
                <i>Then the charms.</i>
              </>
            )}
            {step === "charms" && (
              <>
                Now hook on charms.
                <br />
                <i>Up to three.</i>
              </>
            )}
            {step === "done" && (
              <>
                That’s your piece.
                <br />
                <i>Look, then buy.</i>
              </>
            )}
          </Dialog.Title>
          <Dialog.Description>
            {step === "base" && "Pick the chain you can see. Charms come after."}
            {step === "charms" && `On ${base?.name ?? "your base"}. Tap a picture to hook it on.`}
            {step === "done" && "This is the set. Open a picture to buy that piece."}
          </Dialog.Description>

          {step !== "base" && (
            <button
              className="text-link guide-back"
              onClick={() => setStep(step === "done" ? "charms" : "base")}
            >
              <ArrowLeft size={15} /> Back
            </button>
          )}

          <div className="guide-body" aria-live="polite">
            {step === "base" && (
              <div
                className="guide-choices"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
              >
                {bases.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setBase(p);
                      setStep("charms");
                    }}
                    style={{ textAlign: "left" }}
                  >
                    <Photo product={p} tall />
                    <span className="eyebrow">{p.category}</span>
                    <strong>{p.name}</strong>
                    <span>{p.price != null ? `£${p.price}` : "Ask"}</span>
                  </button>
                ))}
              </div>
            )}

            {step === "charms" && base && (
              <>
                <Stage base={base} charms={picked} />
                <p className="guide-piece">
                  Base <strong>{base.name}</strong> · {picked.length}/3 charms
                </p>
                <div
                  className="guide-choices"
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
                >
                  {charms.map((c) => {
                    const on = picked.some((x) => x.id === c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggle(c)}
                        aria-pressed={on}
                        style={{
                          textAlign: "left",
                          outline: on ? "2px solid #171513" : undefined,
                        }}
                      >
                        <Photo product={c} />
                        <span className="eyebrow">{on ? "On the chain" : "Charm"}</span>
                        <strong>{c.name}</strong>
                        <span>{c.price != null ? `£${c.price}` : "Ask"}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  className="button full"
                  disabled={!picked.length}
                  onClick={() => setStep("done")}
                >
                  Show my necklace <ArrowUpRight size={16} />
                </button>
              </>
            )}

            {step === "done" && base && (
              <>
                <Stage base={base} charms={picked} />
                <div className="guide-destinations">
                  <a href={productPath(base.id)}>
                    {base.name} — the necklace <ArrowUpRight />
                  </a>
                  {picked.map((c) => (
                    <a key={c.id} href={productPath(c.id)}>
                      {c.name} — charm <ArrowUpRight />
                    </a>
                  ))}
                  <a href="/stack">
                    Open the full stack builder <ArrowUpRight />
                  </a>
                </div>
                <p className="guide-note">
                  Pictures are the real products. The overlay is a preview, not a studio composite.
                </p>
                <a className="button full" href="/contact?topic=Product+guidance">
                  Ask if this combination fits <ArrowUpRight size={16} />
                </a>
              </>
            )}
          </div>
          <p className="guide-signoff">Necklace first. Charms second. Done.</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
