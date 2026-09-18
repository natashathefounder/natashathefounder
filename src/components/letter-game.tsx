import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Sparkles, X } from "lucide-react";

const WORDS = ["CHARM", "STACK", "GLIDE", "PEARL", "CHAIN", "HEART", "STORY", "CROWN", "HOUSE", "SLIDE"];
const TRIES = 4;
const LEN = 5;
const CODE = "PLAYORA10";
const KEY = "ora-letter-game";

function todayWord() {
  const day = Math.floor(Date.now() / 86400000);
  return WORDS[day % WORDS.length];
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

const tile: Record<string, string> = {
  hit: "#171513",
  near: "#715732",
  miss: "#c9c0b3",
  empty: "#eee9df",
};

export function LetterGame({
  label = "Play for 10%",
  className = "guide-trigger",
}: {
  label?: string;
  className?: string;
}) {
  const word = useMemo(todayWord, []);
  const [open, setOpen] = useState(false);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}") as {
        day?: number;
        guesses?: string[];
        won?: boolean;
      };
      const day = Math.floor(Date.now() / 86400000);
      if (saved.day === day && saved.guesses) {
        setGuesses(saved.guesses);
        setWon(!!saved.won);
        setLost(!saved.won && saved.guesses.length >= TRIES);
      } else if (!saved.day) {
        const t = setTimeout(() => setOpen(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {
      /* first visit */
    }
  }, []);

  function persist(next: string[], win: boolean) {
    localStorage.setItem(
      KEY,
      JSON.stringify({ day: Math.floor(Date.now() / 86400000), guesses: next, won: win }),
    );
  }

  function submit() {
    if (won || lost) return;
    const guess = draft.toUpperCase().replace(/[^A-Z]/g, "");
    if (guess.length !== LEN) {
      setNote("Five letters — like five charms on a chain.");
      return;
    }
    const next = [...guesses, guess];
    const win = guess === word;
    setGuesses(next);
    setDraft("");
    setNote("");
    if (win) setWon(true);
    else if (next.length >= TRIES) setLost(true);
    persist(next, win);
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
            Five letters.
            <br />
            <i>Four goes.</i>
          </Dialog.Title>
          <Dialog.Description>
            Guess today’s word. Each letter is a charm. Get it right and checkout takes {CODE} for
            10% off.
          </Dialog.Description>

          <div className="guide-body">
            <div style={{ display: "grid", gap: 8, margin: "18px 0" }}>
              {rows.slice(0, TRIES).map((row, r) => {
                const locked = r < guesses.length;
                const marks = locked ? score(guesses[r], word) : [];
                return (
                  <div key={r} style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                    {Array.from({ length: LEN }).map((_, i) => {
                      const mark = locked ? marks[i] : "empty";
                      const bg = tile[mark];
                      const color = mark === "empty" || mark === "miss" ? "#171513" : "#eee9df";
                      return (
                        <span
                          key={i}
                          style={{
                            aspectRatio: "1",
                            display: "grid",
                            placeItems: "center",
                            background: bg,
                            border: "1px solid #171513",
                            fontFamily: "var(--font-serif)",
                            fontSize: 28,
                            color,
                          }}
                        >
                          {(row[i] || "").toUpperCase()}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {won && (
              <>
                <p>
                  That word is yours. Use <strong>{CODE}</strong> at Shopify checkout.
                </p>
                <a className="button full" href="/stack">
                  Make the necklace with those letters
                </a>
              </>
            )}
            {lost && !won && (
              <p className="guide-note">Four goes are up. Come back tomorrow for a new word.</p>
            )}
            {!won && !lost && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                <label>
                  <span className="eyebrow">Your guess</span>
                  <input
                    value={draft}
                    maxLength={5}
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
            <p className="guide-note">
              Dark tile = right letter, right place. Gold = right letter, other place. Grey = not in
              the word.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
