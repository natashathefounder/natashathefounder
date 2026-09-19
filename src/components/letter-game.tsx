import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Sparkles, X } from "lucide-react";

const WORDS = ["GOLD", "LOVE", "RING", "HOOP", "LOCK", "LINK", "WISH", "GIFT", "OATH", "BOND"];
const TRIES = 4;
const LEN = 4;
const CODE = "PLAYORA10";

const PIECES = [
  {
    name: "Girl Birthstone Charm",
    image:
      "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/49_563db8ca-d132-430a-a579-42a4f9639bb0.png?v=1772531042",
  },
  {
    name: "Boy Birthstone Charm",
    image:
      "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/16_33b80e65-8476-43b7-9249-1f573300628a.png?v=1772531107",
  },
  {
    name: "Ace of Hearts Charm",
    image:
      "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/7_964cab5a-dd97-46f6-8abb-6fabe8025e72.png?v=1772541585",
  },
  {
    name: "Eiffel Tower Charm",
    image:
      "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/23_07d6948a-b4ed-4edc-9a52-76a508c23c03.png?v=1772629723",
  },
  {
    name: "Teddy Charm",
    image:
      "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/11_adcecdf4-d274-4ea3-99b9-346eac49a509.png?v=1772537447",
  },
  {
    name: "Croissant Charm",
    image:
      "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/17_bce3d38b-e981-425d-91e4-bc13c4342400.png?v=1772537356",
  },
  {
    name: "Orbit Hoops",
    image:
      "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/18_2b010f79-7d57-4d81-b896-b6fc01fc93ce.png?v=1783426692",
  },
  {
    name: "Bone Chain",
    image:
      "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/ClipCharmsonchain_20.png?v=1783094631",
  },
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

function pieceFor(letter: string, col: number) {
  if (!letter) return PIECES[col % PIECES.length];
  return PIECES[(letter.charCodeAt(0) - 65 + col) % PIECES.length];
}

function Charm({
  letter,
  mark,
  col,
}: {
  letter: string;
  mark: "hit" | "near" | "miss" | "empty";
  col: number;
}) {
  const piece = pieceFor(letter, col);
  const ring =
    mark === "hit" ? "#171513" : mark === "near" ? "#715732" : mark === "miss" ? "#b9afa2" : "#c9c0b3";
  return (
    <span
      title={piece.name}
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
  label = "Play for 10%",
  className = "guide-trigger",
}: {
  label?: string;
  className?: string;
}) {
  const [word, setWord] = useState(WORDS[0]);
  const [open, setOpen] = useState(false);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [slots, setSlots] = useState(["", "", "", ""]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [note, setNote] = useState("");

  const lock = kept(guesses, word);

  useEffect(() => {
    setWord(pick());
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setSlots((s) => lock.map((ch, i) => ch || s[i] || ""));
  }, [guesses.join("|"), word]);

  function replay() {
    setWord(pick(word));
    setGuesses([]);
    setSlots(["", "", "", ""]);
    setWon(false);
    setLost(false);
    setNote("");
  }

  function submit() {
    if (won || lost) return;
    const guess = lock.map((ch, i) => ch || slots[i] || "").join("").toUpperCase();
    if (guess.length !== LEN || /[^A-Z]/.test(guess)) {
      setNote("Fill the empty charms. Letters that were right stay put.");
      return;
    }
    const next = [...guesses, guess];
    const win = guess === word;
    setGuesses(next);
    if (win) setWon(true);
    else if (next.length >= TRIES) setLost(true);
    setNote("");
    if (!win) {
      const nextLock = kept(next, word);
      setSlots(nextLock.map((ch) => ch || ""));
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
            <span className="eyebrow">ORA / LETTER CHARMS</span>
            <Dialog.Close className="icon-button" aria-label="Close">
              <X />
            </Dialog.Close>
          </header>
          <Dialog.Title>
            Four pieces.
            <br />
            <i>Right letters stay.</i>
          </Dialog.Title>
          <Dialog.Description>
            Each box is a different ORA piece. A correct letter stays on that charm. Win for {CODE}.
          </Dialog.Description>

          <div className="guide-body">
            <div style={{ display: "grid", gap: 10, margin: "18px 0" }}>
              {guesses.map((g) => {
                const marks = score(g, word);
                return (
                  <div key={g + marks.join("")} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                    {g.split("").map((ch, i) => (
                      <Charm key={i} letter={ch} mark={marks[i]} col={i} />
                    ))}
                  </div>
                );
              })}
              {!won && !lost && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {slots.map((ch, i) => {
                    const frozen = !!lock[i];
                    return (
                      <label key={i} style={{ display: "grid", gap: 6 }}>
                        <Charm letter={frozen ? lock[i] : ch} mark={frozen ? "hit" : "empty"} col={i} />
                        <input
                          value={frozen ? lock[i] : ch}
                          maxLength={1}
                          disabled={frozen}
                          aria-label={`Letter ${i + 1}${frozen ? ", locked" : ""}`}
                          autoCapitalize="characters"
                          onChange={(e) => {
                            const v = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(-1);
                            setSlots((s) => s.map((x, j) => (j === i ? v : x)));
                          }}
                          style={{
                            width: "100%",
                            textAlign: "center",
                            letterSpacing: 0,
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

            {won && (
              <p>
                That word is yours. Use <strong>{CODE}</strong> at checkout.
              </p>
            )}
            {lost && !won && (
              <p className="guide-note">
                Four goes are up. The word was <strong>{word}</strong>.
              </p>
            )}
            {note && <p className="guide-note">{note}</p>}
            {!won && !lost && (
              <button className="button full" type="button" onClick={submit}>
                Lock these charms
              </button>
            )}
            <button className="button full" type="button" onClick={replay} style={{ marginTop: 12 }}>
              Play again
            </button>
            <a className="button full" href="/products/letter-charms" style={{ marginTop: 8 }}>
              Shop letter charms
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
