import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Sparkles, X } from "lucide-react";

const WORDS = ["GOLD", "LOVE", "RING", "HOOP", "LOCK", "LINK", "WISH", "GIFT", "OATH", "BOND"];
const TRIES = 4;
const LEN = 4;
const CODE = "PLAYORA10";
const KEY = "ora-letter-game-v2";
const CHARM =
  "https://cdn.shopify.com/s/files/1/0680/7725/6998/files/49_563db8ca-d132-430a-a579-42a4f9639bb0.png?v=1772531042";

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

function Charm({ letter, mark }: { letter: string; mark: "hit" | "near" | "miss" | "empty" }) {
  const ring =
    mark === "hit" ? "#171513" : mark === "near" ? "#715732" : mark === "miss" ? "#b9afa2" : "#c9c0b3";
  return (
    <span
      style={{
        position: "relative",
        aspectRatio: "1",
        display: "grid",
        placeItems: "center",
        borderRadius: "50%",
        overflow: "hidden",
        border: `3px solid ${ring}`,
        background: "#e4ddd3",
      }}
    >
      <img
        src={CHARM}
        alt=""
        width={120}
        height={120}
        style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply" }}
      />
      <span
        style={{
          position: "absolute",
          fontFamily: "var(--font-serif)",
          fontSize: 22,
          color: "#171513",
          textShadow: "0 1px 0 #fff8",
        }}
      >
        {letter}
      </span>
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
  const [draft, setDraft] = useState("");
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    setWord(pick());
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, []);

  function replay() {
    setWord(pick(word));
    setGuesses([]);
    setDraft("");
    setWon(false);
    setLost(false);
    setNote("");
    localStorage.removeItem(KEY);
  }

  function submit() {
    if (won || lost) return;
    const guess = draft.toUpperCase().replace(/[^A-Z]/g, "");
    if (guess.length !== LEN) {
      setNote("Four letters — four charms on the chain.");
      return;
    }
    const next = [...guesses, guess];
    const win = guess === word;
    setGuesses(next);
    setDraft("");
    setNote("");
    if (win) setWon(true);
    else if (next.length >= TRIES) setLost(true);
  }

  const rows = [...guesses, ...(won || lost ? [] : [draft])];
  while (rows.length < TRIES) rows.push("");

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
            Four charms.
            <br />
            <i>Four goes.</i>
          </Dialog.Title>
          <Dialog.Description>
            Spell today’s word with letter charms. Win and checkout takes {CODE} for 10% off.
          </Dialog.Description>

          <div className="guide-body">
            <div style={{ display: "grid", gap: 10, margin: "18px 0" }}>
              {rows.slice(0, TRIES).map((row, r) => {
                const locked = r < guesses.length;
                const marks = locked ? score(guesses[r], word) : [];
                return (
                  <div key={r} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                    {Array.from({ length: LEN }).map((_, i) => (
                      <Charm
                        key={i}
                        letter={(row[i] || "").toUpperCase()}
                        mark={locked ? marks[i] : "empty"}
                      />
                    ))}
                  </div>
                );
              })}
            </div>

            {won && (
              <p>
                That word is yours. Use <strong>{CODE}</strong> at Shopify checkout.
              </p>
            )}
            {lost && !won && (
              <p className="guide-note">
                Four goes are up. The word was <strong>{word}</strong>.
              </p>
            )}
            {!won && !lost && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                <label>
                  <span className="eyebrow">Your four letters</span>
                  <input
                    value={draft}
                    maxLength={4}
                    autoCapitalize="characters"
                    autoComplete="off"
                    onChange={(e) => setDraft(e.target.value.toUpperCase())}
                    style={{ width: "100%", letterSpacing: "0.4em", textTransform: "uppercase" }}
                  />
                </label>
                {note && <p className="guide-note">{note}</p>}
                <button className="button full" type="submit" style={{ marginTop: 16 }}>
                  Lock these charms
                </button>
              </form>
            )}
            <button className="button full" type="button" onClick={replay} style={{ marginTop: 12 }}>
              Play again
            </button>
            <a className="button full" href="/products/letter-charms" style={{ marginTop: 8 }}>
              Shop letter charms
            </a>
            <p className="guide-note">
              Dark ring = right place. Gold ring = right letter, other place. Pale ring = not in the
              word.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
