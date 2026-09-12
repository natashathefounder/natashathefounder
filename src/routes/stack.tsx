import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { StackCanvas } from "@/components/stack-canvas";
import { Button } from "@/components/ui/button";
import { charms, SHOP } from "@/lib/catalog";
import { useStackStore, type Base, type Metal } from "@/lib/stack-store";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/stack")({ component: StackPage });

function StackPage() {
  const store = useStackStore();
  useEffect(() => {
    void useStackStore.persist.rehydrate();
  }, []);
  const hydrated = useHydrated();
  const [name, setName] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("all");
  const selected = store.charmIds
    .map((id) => charms.find((c) => c.id === id))
    .filter((c) => c !== undefined);

  return (
    <main className="stack-page editorial-container grid gap-10 md:grid-cols-2">
      <div className="stack-preview-column">
        <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-metal">
          02 / The charm atelier
        </p>
        <h1 className="mt-3 font-serif text-title">
          A little more <em>you.</em>
        </h1>
        <p className="mt-4 text-muted">
          A heart. A sign. A memory. Pick a base and compose up to eight charms. There’s no right
          answer — only yours.
        </p>

        <div className="mt-8 overflow-hidden">
          <StackCanvas base={store.base} metal={store.metal} charmIds={store.charmIds} />
        </div>
        <p className="mt-3 text-xs text-muted">
          An illustrative composition, not an exact product rendering.
        </p>
        <p
          aria-live="polite"
          className="mt-3 font-sans text-xs uppercase tracking-[0.14em] text-muted tabular-nums"
        >
          {store.charmIds.length} / 8 charms · {store.metal} · {store.base}
        </p>
      </div>

      <div>
        <Field label="Base">
          {(["hoop", "bangle"] as Base[]).map((b) => (
            <Chip key={b} active={store.base === b} onClick={() => store.setBase(b)}>
              {b}
            </Chip>
          ))}
        </Field>
        <Field label="Metal">
          {(["gold", "silver"] as Metal[]).map((m) => (
            <Chip key={m} active={store.metal === m} onClick={() => store.setMetal(m)}>
              {m === "gold" ? "Gold plated" : "Silver"}
            </Chip>
          ))}
        </Field>

        <p className="mt-8 font-sans text-[0.7rem] uppercase tracking-[0.16em] text-metal">
          Charms
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {["all", "story", "star", "stone", "letter"].map((kind) => (
            <button
              className="text-link"
              aria-pressed={filter === kind}
              key={kind}
              onClick={() => setFilter(kind)}
            >
              {kind === "all" ? "All charms" : kind}
            </button>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {charms
            .filter((c) => filter === "all" || c.kind === filter)
            .map((c) => {
              const on = store.charmIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  disabled={!on && store.charmIds.length >= 8}
                  onClick={() => {
                    store.toggleCharm(c.id);
                    setNotice(on ? `${c.name} removed.` : `${c.name} added.`);
                  }}
                  className={cn(
                    "charm-choice flex h-20 items-center gap-2 border px-3 text-left text-sm",
                    on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
                  )}
                >
                  <span className="font-serif text-lg">{c.glyph}</span>
                  <span className="leading-tight">{c.name}</span>
                </button>
              );
            })}
        </div>

        <p role="status" className="mt-5 text-xs text-muted">
          {store.charmIds.length === 8
            ? "Your stack is full. Remove a charm to make room for another."
            : notice}
        </p>
        {selected.length > 0 && (
          <ol className="stack-order">
            {selected.map((c, i) => (
              <li key={c.id}>
                <span>
                  {String(i + 1).padStart(2, "0")} / {c.name}
                </span>
                <div>
                  <button
                    aria-label={`Move ${c.name} earlier`}
                    disabled={i === 0}
                    onClick={() => store.moveCharm(c.id, -1)}
                  >
                    ←
                  </button>
                  <button
                    aria-label={`Move ${c.name} later`}
                    disabled={i === selected.length - 1}
                    onClick={() => store.moveCharm(c.id, 1)}
                  >
                    →
                  </button>
                  <a
                    href={c.shop}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${c.name} on ORA`}
                  >
                    ↗
                  </a>
                </div>
              </li>
            ))}
          </ol>
        )}
        <div className="mt-8 flex flex-wrap gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Name this stack"
            maxLength={80}
            placeholder="Name this stack"
            className="h-11 min-w-[12rem] flex-1 border border-line bg-card px-3 font-serif text-lg outline-none focus:border-ink"
          />
          <Button
            type="button"
            disabled={selected.length === 0}
            onClick={() => {
              store.saveStack(name);
              setNotice("Saved on this device.");
            }}
          >
            Save stack
          </Button>
          <Button type="button" variant="ghost" onClick={() => store.clearCharms()}>
            Clear
          </Button>
        </div>

        {selected.length > 0 ? (
          <a
            href={SHOP + "/pages/build-your-charm-stack"}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex h-11 items-center font-sans text-[0.72rem] uppercase tracking-[0.16em] text-metal hover:text-ink"
          >
            Recreate your stack on ORA ↗
          </a>
        ) : null}

        <p className="mt-3 text-xs text-muted">
          Your composition stays here. Use the piece links above to check the real designs, metal
          options and availability. The ORA builder opens fresh.
        </p>
        {hydrated && store.saved.length > 0 ? (
          <div className="mt-10 border-t border-line pt-8">
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.16em] text-metal">
              Saved on this device
            </p>
            <ul className="mt-4 space-y-2">
              {store.saved.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 border border-line px-3 py-3"
                >
                  <button type="button" className="text-left" onClick={() => store.loadStack(s.id)}>
                    <span className="block font-serif text-xl">{s.name}</span>
                    <span className="text-xs text-muted">
                      {s.metal} {s.base} · {s.charmIds.length} charms
                    </span>
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => store.removeStack(s.id)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <p className="font-sans text-[0.7rem] uppercase tracking-[0.16em] text-metal">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-11 border px-4 font-sans text-[0.72rem] uppercase tracking-[0.12em]",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line text-muted hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
