import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { INSTAGRAM_FOUNDER, SHOP } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Story" },
  { to: "/shop", label: "Lookbook" },
  { to: "/stack", label: "Stack" },
  { to: "/custom", label: "Custom" },
  { to: "/coaching", label: "Coaching" },
  { to: "/studio", label: "Studio" },
  { to: "/members", label: "Members" },
] as const;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <p className="bg-cream px-4 py-2 text-center font-sans text-[0.68rem] uppercase tracking-[0.18em] text-ink">
        Handmade in Cape Town · Founder coaching £75 · Shop at orajewellery.com
      </p>
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-8">
          <Link
            to="/"
            className="font-serif text-xl leading-none tracking-wide"
            onClick={() => setOpen(false)}
          >
            Natasha
            <span className="mt-0.5 block font-sans text-[0.58rem] uppercase tracking-[0.28em] text-muted">
              the founder
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "font-sans text-sm tracking-wide text-muted transition-colors hover:text-ink",
                  pathname === l.to && "text-ink",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <a
            href={SHOP}
            target="_blank"
            rel="noreferrer"
            className="ml-auto hidden h-10 items-center border border-ink px-3 font-sans text-[0.68rem] uppercase tracking-[0.16em] hover:bg-ink hover:text-paper md:ml-4 md:inline-flex"
          >
            Shop ORA
          </a>
          <button
            type="button"
            className="ml-auto inline-flex h-11 w-11 items-center justify-center md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open ? (
          <nav className="flex flex-col gap-1 border-t border-line px-4 py-4 md:hidden">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="flex h-11 items-center font-sans text-sm"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={SHOP}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 items-center font-sans text-sm"
            >
              Shop ORA
            </a>
            <a
              href={INSTAGRAM_FOUNDER}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 items-center font-sans text-sm"
            >
              @natasha.thefounder
            </a>
          </nav>
        ) : null}
      </header>
      {children}
      <footer className="border-t border-line px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-serif text-2xl">Natasha</p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Personal house of Natasha Collins, founder of ORA Jewellery. The shop remains at
              orajewellery.com.
            </p>
          </div>
          <p className="text-xs text-faint">Cape Town · Handmade to last</p>
        </div>
      </footer>
    </div>
  );
}
