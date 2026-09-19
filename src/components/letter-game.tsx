import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Sparkles, X } from "lucide-react";
import { getLookLines } from "@/lib/commerce/look-lines";
import { useBag } from "@/components/commerce";
import { productPath } from "@/lib/guide-picks";

const WORDS = ["GOLD", "LOVE", "RING", "HOOP", "LOCK", "LINK", "WISH", "GIFT", "OATH", "BOND"];
const TRIES = 4;
const LEN = 4;
const CODE = "PLAYORA20";

const SET = [
  {
    id: "slider-9ct-gold-chain",
    name: "Slider chain — 9ct gold",
    kind: "Necklace",
    image:
      "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/ClipCharmsonchain_20.png?v=1783094631",
  },
  {
    id: "girl-gold-plated-charm",
    name: "Girl Birthstone Charm",
    kind: "Charm",
    image:
      "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/49_563db8ca-d132-430a-a579-42a4f9639bb0.png?v=1772531042",
  },
  {
    id: "boy-gold-plated-charm",
    name: "Boy Birthstone Charm",
    kind: "Charm",
    image:
      "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/16_33b80e65-8476-43b7-9249-1f573300628a.png?v=1772531107",
  },
  {
    id: "ace-of-hearts-gold-plated-charm",
    name: "Ace of Hearts Charm",
    kind: "Charm",
    image:
      "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/7_964cab5a-dd97-46f6-8abb-6fabe8025e72.png?v=1772541585",
  },
];

const spots = [
  { x: 28, y: 62 },
  { x: 50, y: 70 },
  { x: 72, y: 62 },
];

function pick(avoid?: string) {
  const pool = WORDS.filter((w) => w !== avoid);
  return pool[Math.floor(Math.random() * pool.length)] || WORDS[0];
}

function score(guess: string, word: string) {
  const marks: Array<"hit" | "near" | "miss"> = Array(LEN).fill("miss");
  const left = word.split("");
  guess.split("").forEach((ch, i) => {
    if (ch === word[i]) {
      marks[i] = "hit";
      left[i] = "";
    }
  });
  guess.split("").forEach((ch, i) => {
    if (marks[i] === "hit") return;
    const at = left.indexOf(ch);
    if (at >= 0) {
      marks[i] = "near";
      left[at] = "";
    }
  });
  return marks;
}

function kept(guesses: string[], word: string) {
  const lock = ["", "", "", ""];
  for (const g of guesses) {
    g.split("").forEach((ch, i) => {
      if (ch === word[i]) lock[i] = ch;
    });
  }
  return lock;
}

function payUrl(checkout: string) {
  const u = new URL(checkout);
  u.searchParams.set("discount", CODE);
  return u.href;
}

function NecklaceView() {
  const chain = SET[0];
  const charms = SET.slice(1);
  return (
    <div
      style={{
        position: "relative",
        background: "#e4ddd3",
        aspectRatio: "4 / 5",
        margin: "12px 0 16px",
        overflow: "hidden",
      }}
    >
      <img
        src={chain.image}
        alt={chain.name}
        width={640}
        height={800}
        style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
      />
      {charms.map((c, i) => (
        <img
          key={c.id}
          src={c.image}
          alt={c.name}
          width={120}
          height={120}
          style={{
            position: "absolute",
            width: "22%",
            height: "auto",
            left: `${spots[i].x}%`,
            top: `${spots[i].y}%`,
            transform: "translate(-50%, -50%)",
            objectFit: "contain",
            mixBlendMode: "multiply",
          }}
        />
      ))}
    </div>
  );
}

function Tile({
  letter,
  mark,
  col,
}: {
  letter: string;
  mark: "hit" | "near" | "miss" | "empty";
  col: number;
}) {
  const piece = SET[col];
  const ring =
    mark === "hit" ? "#171513" : mark === "near" ? "#715732" : mark === "miss" ? "#b9afa2" : "#c9c0b3";
  return (
    <span
      title={`${piece.kind}: ${piece.name}`}
      style={{
        position: "relative",
        aspectRatio: "1",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        border: `3px solid ${ring}`,
        background: "#e4ddd3",
      }}
    >
      <img
        src={piece.image}
        alt={piece.name}
        width={160}
        height={160}
        style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
      />
      <span
        style={{
          position: "absolute",
          left: 6,
          top: 6,
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          background: "#eee9dfcc",
          padding: "1px 5px",
        }}
      >
        {piece.kind}
      </span>
      {letter ? (
        <span
          style={{
            position: "absolute",
            bottom: 4,
            right: 6,
            fontFamily: "var(--font-serif)",
            fontSize: 18,
            background: "#eee9dfcc",
            padding: "0 6px",
          }}
        >
          {letter}
        </span>
      ) : null}
    </span>
  );
}

export function LetterGame({
  label = "Play for 20%",
  className = "guide-trigger",
}: {
  label?: string;
  className?: string;
}) {
  const { reload, setOpen: setBagOpen } = useBag();
  const [word, setWord] = useState(WORDS[0]);
  const [open, setOpen] = useState(false);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [slots, setSlots] = useState(["", "", "", ""]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [pay, setPay] = useState("");
  const [showNecklace, setShowNecklace] = useState(false);
  const lock = kept(guesses, word);

  useEffect(() => {
    setWord(pick());
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, []);

  function replay() {
    setWord(pick(word));
    setGuesses([]);
    setSlots(["", "", "", ""]);
    setWon(false);
    setLost(false);
    setNote("");
    setPay("");
    setShowNecklace(false);
  }

  function submit() {
    if (won || lost) return;
    const guess = lock.map((ch, i) => ch || slots[i] || "").join("").toUpperCase();
    if (guess.length !== LEN || /[^A-Z]/.test(guess)) {
      setNote("Fill the empty boxes. Right letters stay on that piece.");
      return;
    }
    const next = [...guesses, guess];
    setGuesses(next);
    if (guess === word) {
      setWon(true);
      setShowNecklace(true);
    } else if (next.length >= TRIES) setLost(true);
    setNote("");
    if (guess !== word) setSlots(kept(next, word).map((ch) => ch || ""));
  }

  async function checkoutSet() {
    setBusy(true);
    setNote("");
    try {
      const look = await Promise.race([
        getLookLines({ data: SET.map((p) => p.id) }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("That took too long. Open a piece and add it from there.")), 12000),
        ),
      ]);
      if (look.lines.length < 2) throw new Error("The set could not be added. Open each piece to buy.");
      const response = await fetch("/api/bag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addStack", lines: look.lines }),
        signal: AbortSignal.timeout(12000),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "The bag could not take this set.");
      const url = body.cart?.checkoutUrl ? payUrl(body.cart.checkoutUrl) : "";
      setPay(url);
      reload();
      if (url) window.location.assign(url);
      else setBagOpen(true);
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Checkout could not open.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={className}>
        <Sparkles size={16} />
        <span>{label}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-shade" />
        <Dialog.Content className="shopping-guide">
          <header>
            <span className="eyebrow">ORA / ONE NECKLACE + THREE CHARMS</span>
            <Dialog.Close className="icon-button" aria-label="Close">
              <X />
            </Dialog.Close>
          </header>
          <Dialog.Title>
            {won ? (
              <>
                Your necklace.
                <br />
                <i>Look, then pay.</i>
              </>
            ) : (
              <>
                Four pieces.
                <br />
                <i>20% if you spell it.</i>
              </>
            )}
          </Dialog.Title>
          <Dialog.Description>
            {won
              ? `Slider necklace with three charms. ${CODE} applies at payment.`
              : "Box 1 is the slider necklace. The other three are charms. Right letters stay."}
          </Dialog.Description>

          <div className="guide-body">
            <button className="button full" type="button" onClick={() => setShowNecklace((v) => !v)}>
              {showNecklace ? "Hide the necklace" : "Show the necklace"}
            </button>
            {showNecklace && (
              <>
                <NecklaceView />
                <a className="button full" href={productPath(SET[0].id)}>
                  Open the necklace page
                </a>
              </>
            )}

            {!won && (
              <div style={{ display: "grid", gap: 10, margin: "18px 0" }}>
                {guesses.map((g) => {
                  const marks = score(g, word);
                  return (
                    <div key={g} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                      {g.split("").map((ch, i) => (
                        <Tile key={i} letter={ch} mark={marks[i]} col={i} />
                      ))}
                    </div>
                  );
                })}
                {!lost && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                    {slots.map((ch, i) => {
                      const frozen = !!lock[i];
                      return (
                        <label key={i} style={{ display: "grid", gap: 6 }}>
                          <Tile letter={frozen ? lock[i] : ch} mark={frozen ? "hit" : "empty"} col={i} />
                          <input
                            value={frozen ? lock[i] : ch}
                            maxLength={1}
                            disabled={frozen}
                            autoCapitalize="characters"
                            onChange={(e) => {
                              const v = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(-1);
                              setSlots((s) => s.map((x, j) => (j === i ? v : x)));
                            }}
                            style={{
                              width: "100%",
                              textAlign: "center",
                              textTransform: "uppercase",
                              opacity: frozen ? 0.55 : 1,
                            }}
                          />
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {won && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0" }}>
                  {SET.map((p) => (
                    <a key={p.id} href={productPath(p.id)} style={{ textDecoration: "none" }}>
                      <span style={{ display: "block", background: "#e4ddd3", aspectRatio: "1", overflow: "hidden" }}>
                        <img
                          src={p.image}
                          alt={p.name}
                          width={320}
                          height={320}
                          style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
                        />
                      </span>
                      <span className="eyebrow">{p.kind}</span>
                      <strong style={{ display: "block" }}>{p.name}</strong>
                    </a>
                  ))}
                </div>
                <button className="button full" type="button" disabled={busy} onClick={() => void checkoutSet()}>
                  {busy ? "Opening checkout…" : "Check out and pay — 20% off"}
                </button>
                {pay ? (
                  <a className="button full" href={pay} style={{ marginTop: 8 }}>
                    Continue to payment
                  </a>
                ) : null}
              </>
            )}
            {lost && !won && (
              <p className="guide-note">
                Four goes are up. The word was <strong>{word}</strong>.
              </p>
            )}
            {note && <p className="guide-note">{note}</p>}
            {!won && !lost && (
              <button className="button full" type="button" onClick={submit} style={{ marginTop: 12 }}>
                Lock these charms
              </button>
            )}
            <button className="button full" type="button" onClick={replay} style={{ marginTop: 12 }}>
              Play again
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
