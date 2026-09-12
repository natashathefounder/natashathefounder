import { createFileRoute, useRouter, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, Check, Gem, LockKeyhole, Sparkles, TicketPercent } from "lucide-react";
import { useState } from "react";
import { approveMember, getMembership } from "@/lib/members";
import { SignInButtons } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SHOP } from "@/lib/catalog";

export const Route = createFileRoute("/members")({
  loader: () => getMembership(),
  errorComponent: MembersError,
  component: MembersPage,
});

const offers = [
  {
    eyebrow: "Private offer",
    title: "Your member special is coming soon",
    body: "The first members-only ORA offer will appear here, with its private code and expiry date.",
    icon: TicketPercent,
  },
  {
    eyebrow: "First access",
    title: "See new work before the public edit",
    body: "Members will be first through the door for selected drops, limited pieces and studio releases.",
    icon: Sparkles,
  },
];

function MembersError() {
  const state = useRouterState();
  const error = state.matches.find((match) => match.error)?.error;
  const unauthorized = error instanceof Error && error.message === "Unauthorized";
  return (
    <main className="mx-auto max-w-xl px-5 py-20 text-center">
      <LockKeyhole className="mx-auto size-7 text-metal" />
      <h1 className="mt-5 text-title">
        {unauthorized ? "Members only." : "We could not open the private list."}
      </h1>
      <p className="mt-4 text-sm text-muted">
        {unauthorized
          ? "Sign in to request access. Every membership is personally approved."
          : "Please try again in a moment."}
      </p>
      {unauthorized ? (
        <div className="mx-auto mt-8 max-w-sm">
          <SignInButtons />
        </div>
      ) : null}
    </main>
  );
}

function MembersPage() {
  const { membership, pending } = Route.useLoaderData();
  const { user } = useCurrentUserState();
  const router = useRouter();
  const approve = useServerFn(approveMember);
  const [working, setWorking] = useState<string | null>(null);

  if (membership.status !== "active") {
    return (
      <main className="mx-auto flex min-h-[68dvh] max-w-2xl items-center px-5 py-16 text-center">
        <section className="w-full border border-line bg-card px-6 py-14 md:px-12">
          <Gem className="mx-auto size-7 text-metal" />
          <p className="mt-7 text-[0.7rem] uppercase tracking-[0.22em] text-metal">
            Request received
          </p>
          <h1 className="mt-3 text-title">You are on the private list.</h1>
          <p className="mx-auto mt-5 max-w-md text-sm text-muted">
            Natasha will approve your membership personally. Once approved, this page will reveal
            private offers and premiere-event invitations.
          </p>
          <p className="mt-7 text-xs text-faint">Signed in as {user?.primaryEmail}</p>
        </section>
      </main>
    );
  }

  const firstName = membership.name?.split(" ")[0] || "Member";
  return (
    <main>
      <section className="relative overflow-hidden bg-ink px-5 py-16 text-paper md:px-12 md:py-24">
        <div className="absolute -right-24 -top-24 size-72 rounded-full border border-metal/30" />
        <div className="absolute -right-8 top-10 size-48 rounded-full border border-metal/20" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-metal-soft">
            The private list · Member access
          </p>
          <h1 className="mt-4 max-w-3xl text-display">Welcome in, {firstName}.</h1>
          <p className="mt-6 max-w-xl text-sm text-paper/70">
            Specials, private codes and invitations from Natasha and ORA Jewellery—kept together in
            one place.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {offers.map(({ eyebrow, title, body, icon: Icon }) => (
            <article key={title} className="bg-card p-7 md:p-10">
              <Icon className="size-6 text-metal" />
              <p className="mt-8 text-[0.68rem] uppercase tracking-[0.2em] text-metal">{eyebrow}</p>
              <h2 className="mt-3 text-3xl">{title}</h2>
              <p className="mt-4 max-w-md text-sm text-muted">{body}</p>
              <a
                href={SHOP}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex border-b border-ink pb-1 text-xs uppercase tracking-[0.15em]"
              >
                Visit ORA
              </a>
            </article>
          ))}
        </div>

        <article className="mt-10 grid overflow-hidden border border-line md:grid-cols-[0.75fr_1.25fr]">
          <div className="min-h-64 bg-[url('/media/studio.jpg')] bg-cover bg-center" />
          <div className="bg-cream p-7 md:p-12">
            <CalendarDays className="size-6 text-metal" />
            <p className="mt-8 text-[0.68rem] uppercase tracking-[0.2em] text-metal">
              Premiere events
            </p>
            <h2 className="mt-3 text-title">Your next invitation will appear here.</h2>
            <p className="mt-4 max-w-xl text-sm text-muted">
              Private studio evenings, first looks and founder gatherings. Event details and member
              booking access will stay locked to approved accounts.
            </p>
          </div>
        </article>

        {membership.role === "admin" ? (
          <section className="mt-14 border-t border-line pt-10">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-metal">Membership desk</p>
            <h2 className="mt-3 text-3xl">Pending approvals</h2>
            {pending.length ? (
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {pending.map((person) => (
                  <li
                    key={person.user_id}
                    className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted">{person.email}</p>
                    </div>
                    <button
                      type="button"
                      disabled={working === person.user_id}
                      onClick={async () => {
                        setWorking(person.user_id);
                        try {
                          await approve({ data: { userId: person.user_id } });
                          await router.invalidate({ sync: true });
                        } finally {
                          setWorking(null);
                        }
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 bg-ink px-4 text-xs uppercase tracking-[0.14em] text-paper disabled:opacity-50"
                    >
                      <Check className="size-4" />{" "}
                      {working === person.user_id ? "Approving…" : "Approve member"}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm text-muted">No membership requests are waiting.</p>
            )}
          </section>
        ) : null}
      </section>
    </main>
  );
}
