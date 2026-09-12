import { createFileRoute, Link } from "@tanstack/react-router";
import { Gem } from "lucide-react";
import { SignInButtons, SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-6xl items-center px-4 py-16 md:px-8">
      <section className="grid w-full overflow-hidden border border-line bg-card md:grid-cols-[1.15fr_0.85fr]">
        <div className="bg-ink px-7 py-14 text-paper md:px-12 md:py-20">
          <Gem className="size-7 text-metal-soft" aria-hidden="true" />
          <p className="mt-10 text-[0.7rem] uppercase tracking-[0.22em] text-metal-soft">
            The private list
          </p>
          <h1 className="mt-3 max-w-lg text-title">A little closer to the house.</h1>
          <p className="mt-5 max-w-md text-sm text-paper/70">
            Sign in to request membership for private offers, first access and invitations to
            premiere events.
          </p>
        </div>
        <div className="flex flex-col justify-center px-7 py-12 md:px-10">
          <SignedOut>
            <h2 className="font-serif text-3xl">Enter The Private List</h2>
            <p className="mt-3 mb-7 text-sm text-muted">
              Use your preferred account. Every new membership is personally approved.
            </p>
            <SignInButtons />
          </SignedOut>
          <SignedIn>
            <h2 className="font-serif text-3xl">You are signed in.</h2>
            <div className="mt-5">
              <UserButton />
            </div>
            <Link
              to="/members"
              className="mt-8 inline-flex h-11 items-center justify-center bg-ink px-5 text-xs uppercase tracking-[0.16em] text-paper"
            >
              Open The Private List
            </Link>
          </SignedIn>
        </div>
      </section>
    </main>
  );
}
