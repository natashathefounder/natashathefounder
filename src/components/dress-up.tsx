import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, ArrowLeft, X, Sparkles } from "lucide-react";
import type { Product } from "@/lib/products";
import { productPath } from "@/lib/guide-picks";
import { getProduct } from "@/lib/commerce/catalogue";
import { useBag } from "@/components/commerce";
import { glideCharms, sliderBases } from "@/lib/dress-up-kit";

type Spot = { x: number; y: number };

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
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          mixBlendMode: "multiply",
        }}
      />
    </span>
  );
}

function Stage({
  base,
  charms,
  spots,
  onMove,
}: {
  base: Product;
  charms: Product[];
  spots: Record<string, Spot>;
  onMove: (id: string, spot: Spot) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);

  function place(id: string, clientX: number, clientY: number) {
    const box = stage.current?.getBoundingClientRect();
    if (!box) return;
    const x = Math.min(88, Math.max(4, ((clientX - box.left) / box.width) * 100));
    const y = Math.min(88, Math.max(4, ((clientY - box.top) / box.height) * 100));
    onMove(id, { x, y });
  }

  return (
    <div
      ref={stage}
      style={{
        position: "relative",
        background: "#e4ddd3",
        aspectRatio: "4 / 5",
        margin: "12px 0 20px",
        overflow: "hidden",
        touchAction: "none",
      }}
      aria-label={`${base.name} with ${charms.length} charm${charms.length === 1 ? "" : "s"}. Drag a charm to place it.`}
    >
      <img
        src={base.image}
        alt={base.name}
        width={640}
        height={800}
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
      />
      {charms.map((c, i) => {
        const spot = spots[c.id] ?? { x: 18 + i * 22, y: 72 - (i % 2) * 8 };
        return (
          <img
            key={c.id}
            src={c.image}
            alt={c.name}
            width={160}
            height={160}
            draggable={false}
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              place(c.id, e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (e.buttons === 0) return;
              place(c.id, e.clientX, e.clientY);
            }}
            style={{
              position: "absolute",
              width: "26%",
              height: "auto",
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              transform: "translate(-50%, -50%)",
              objectFit: "contain",
              mixBlendMode: "multiply",
              cursor: "grab",
              touchAction: "none",
              userSelect: "none",
            }}
          />
        );
      })}
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
  const { reload, setOpen } = useBag();
  const [step, setStep] = useState<"base" | "charms" | "done">("base");
  const [base, setBase] = useState<Product | null>(null);
  const [picked, setPicked] = useState<Product[]>([]);
  const [spots, setSpots] = useState<Record<string, Spot>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function toggle(c: Product) {
    setPicked((list) => {
      if (list.some((x) => x.id === c.id)) return list.filter((x) => x.id !== c.id);
      if (list.length >= 3) return list;
      return [...list, c];
    });
  }

  async function buyAll() {
    if (!base || picked.length < 1) return;
    setBusy(true);
    setError("");
    try {
      const rows = await Promise.all([base, ...picked].map((p) => getProduct({ data: p.id })));
      const lines = rows.flatMap((row) => {
        const variant =
          row.product?.variants.nodes.find((v) => v.availableForSale) ||
          row.product?.variants.nodes[0];
        return variant ? [{ variantId: variant.id, quantity: 1 }] : [];
      });
      if (lines.length < 2) {
        setError("Those pieces could not be added together. Open each product to buy.");
        return;
      }
      const response = await fetch("/api/bag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addStack", lines }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "The bag could not take this set.");
      reload();
      setOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The bag could not take this set.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (open) {
          setStep("base");
          setBase(null);
          setPicked([]);
          setSpots({});
          setError("");
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
            <span className="eyebrow">ORA / GLIDE & STACK</span>
            <Dialog.Close className="icon-button" aria-label="Close">
              <X />
            </Dialog.Close>
          </header>
          <Dialog.Title>
            {step === "base" && (
              <>
                Start with the slider chain.
                <br />
                <i>Only this chain takes Glide charms.</i>
              </>
            )}
            {step === "charms" && (
              <>
                Slide a charm on.
                <br />
                <i>Drag it where it should sit.</i>
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
            {step === "base" &&
              "Glide & Stack charms lock on the ORA slider chain only — not Bone, Motion or clip chains."}
            {step === "charms" &&
              "White around the charm is knocked out. Drag it along the chain."}
            {step === "done" && "Necklace and charms go in the bag together. Remove any you do not want."}
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
                {sliderBases.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setBase(p);
                      setStep("charms");
                    }}
                    style={{ textAlign: "left" }}
                  >
                    <Photo product={p} tall />
                    <span className="eyebrow">Slider chain</span>
                    <strong>{p.name}</strong>
                  </button>
                ))}
              </div>
            )}

            {step === "charms" && base && (
              <>
                <Stage
                  base={base}
                  charms={picked}
                  spots={spots}
                  onMove={(id, spot) => setSpots((s) => ({ ...s, [id]: spot }))}
                />
                <p className="guide-piece">
                  Base <strong>{base.name}</strong> · {picked.length}/3 charms · drag to place
                </p>
                <div
                  className="guide-choices"
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
                >
                  {glideCharms.map((c) => {
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
                <Stage
                  base={base}
                  charms={picked}
                  spots={spots}
                  onMove={(id, spot) => setSpots((s) => ({ ...s, [id]: spot }))}
                />
                <div className="guide-destinations">
                  <a href={productPath(base.id)}>
                    {base.name} <ArrowUpRight />
                  </a>
                  {picked.map((c) => (
                    <a key={c.id} href={productPath(c.id)}>
                      {c.name} <ArrowUpRight />
                    </a>
                  ))}
                </div>
                {error && (
                  <p className="guide-note" role="alert">
                    {error}
                  </p>
                )}
                <button className="button full" disabled={busy} onClick={() => void buyAll()}>
                  {busy ? "Adding your set…" : "Go on — get it and purchase"}
                  <ArrowUpRight size={16} />
                </button>
              </>
            )}
          </div>
          <p className="guide-signoff">Slider chain first. Charms second. Drag to place.</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
