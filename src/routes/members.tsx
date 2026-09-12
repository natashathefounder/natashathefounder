import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, type ReactNode } from "react";
import { ArrowUpRight, Check, Copy, LockKeyhole, Plus, RefreshCw } from "lucide-react";
import { getMembership, requestMembership, updateMember, saveEntry } from "@/lib/members";
import { SignInButtons } from "@/lib/auth/gates";
import type { EntryInput, PrivateEntry } from "@/lib/private-list-schema";

export const Route = createFileRoute("/members")({
  loader: async () => {
    try {
      return { ...(await getMembership()), signedOut: false };
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized")
        return { membership: null, entries: [], people: [], signedOut: true };
      throw error;
    }
  },
  head: () => ({
    meta: [
      { title: "The Private List — Natasha Collins" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  pendingComponent: () => (
    <main className="private-wait" aria-busy="true">
      <p className="eyebrow">The Private List</p>
      <h1>Opening your invitation…</h1>
    </main>
  ),
  errorComponent: MembersError,
  component: MembersPage,
});

function Invitation({ children }: { children: ReactNode }) {
  return (
    <main className="private-intro">
      <section className="private-letter">
        <p className="eyebrow">A little closer to the work</p>
        <h1>
          The
          <br />
          <em>Private</em> List<span className="gold-dot">.</span>
        </h1>
        <p className="private-deck">For the ones who want to be in the room.</p>
        <p>
          New work before it meets the world. Occasional private offers. Invitations to moments
          worth showing up for.
        </p>
        <div className="private-signature">
          A little more ORA. A little more me.
          <br />
          <span>Natasha x</span>
        </div>
        {children}
      </section>
      <figure className="private-image">
        <img src="/media/necklace.jpg" alt="ORA jewellery, seen up close" />
        <figcaption>Closer. By invitation.</figcaption>
      </figure>
    </main>
  );
}
function MembersError({ error, reset }: { error: unknown; reset: () => void }) {
  if (error instanceof Error && error.message === "Unauthorized")
    return (
      <Invitation>
        <div className="invite-action">
          <p className="eyebrow">Your first step</p>
          <p className="mb-5 text-sm">
            Sign in, then request your place. Membership is personally approved.
          </p>
          <SignInButtons />
        </div>
      </Invitation>
    );
  return (
    <main className="private-wait">
      <p className="eyebrow">The Private List</p>
      <h1>The door hasn’t opened.</h1>
      <p role="alert">We couldn’t load your membership. Please try again.</p>
      <button className="editorial-button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}

function MembersPage() {
  const { membership, entries, people, signedOut } = Route.useLoaderData();
  const router = useRouter();
  const request = useServerFn(requestMembership);
  const update = useServerFn(updateMember);
  const save = useServerFn(saveEntry);
  const [working, setWorking] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"list" | "desk">("list");
  const [editing, setEditing] = useState<EntryInput | null>(null);
  async function action(fn: () => Promise<unknown>, success: string) {
    setWorking(true);
    setError("");
    setNotice("");
    try {
      await fn();
      await router.invalidate({ sync: true });
      setNotice(success);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      return false;
    } finally {
      setWorking(false);
    }
  }
  const feedback = (
    <>
      <p role="status" className="text-sm text-metal">
        {notice}
      </p>
      {error && (
        <p role="alert" className="my-4 border-l-2 border-red-700 pl-4 text-sm">
          {error}
        </p>
      )}
    </>
  );
  if (signedOut)
    return (
      <Invitation>
        <div className="invite-action">
          <p className="mb-5 text-sm">
            Sign in, then request your place. Every membership is personally approved.
          </p>
          <SignInButtons />
        </div>
      </Invitation>
    );
  if (!membership)
    return (
      <Invitation>
        <div className="invite-action">
          <button
            className="editorial-button"
            disabled={working}
            onClick={() => action(() => request(), "Your request is with Natasha.")}
          >
            {working ? "Sending your request…" : "Request my place"}
            <ArrowUpRight size={16} />
          </button>
          <p className="mt-4 text-xs text-muted">
            Requesting access creates your membership application.
          </p>
          {feedback}
        </div>
      </Invitation>
    );
  if (membership.status !== "active")
    return (
      <main className="private-wait">
        <LockKeyhole size={20} className="text-metal" />
        <p className="eyebrow mt-8">
          The Private List ·{" "}
          {membership.status === "paused" ? "Membership paused" : "Request received"}
        </p>
        <h1>
          {membership.status === "paused" ? (
            <>
              A pause.
              <br />
              <em>Not goodbye.</em>
            </>
          ) : (
            <>
              Your name is here.
              <br />
              <em>Leave the rest with me.</em>
            </>
          )}
        </h1>
        <p>
          {membership.status === "paused"
            ? "Your private access is currently paused. Contact the studio if you would like Natasha to review it."
            : "Your request is waiting for Natasha’s approval. When your membership opens, your private offers and invitations will be waiting here."}
        </p>
        <div className="flex flex-wrap justify-center gap-5">
          <button
            className="editorial-button"
            disabled={working}
            onClick={() => action(() => router.invalidate({ sync: true }), "Membership checked.")}
          >
            <RefreshCw size={14} />
            Check my status
          </button>
          <Link to="/studio" className="text-link">
            Contact the studio ↗
          </Link>
        </div>
        {feedback}
        <Link to="/shop" className="text-link mt-10">
          Explore the ORA edit ↗
        </Link>
      </main>
    );
  const admin = membership.role === "admin";
  const publicEntries = entries.filter(
    (e) => e.status === "published" && (!e.starts_at || Date.parse(e.starts_at) <= Date.now()),
  );
  return (
    <main>
      <section className="member-welcome">
        <div>
          <p className="eyebrow">The Private List · {admin ? "Natasha’s view" : "You’re in"}</p>
          <h1>
            Welcome in,
            <br />
            <em>{membership.name?.split(" ")[0] || "you"}.</em>
          </h1>
          <p>A place for the things I want you to see first.</p>
        </div>
        <span className="member-seal" aria-hidden="true">
          N<span>THE PRIVATE LIST</span>
        </span>
      </section>
      <div className="editorial-container py-10">
        <div className="member-toolbar">
          <p className="eyebrow">Your inside line</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/login" className="text-link">
              My account
            </Link>
            {admin && (
              <>
                <button
                  className="text-link"
                  aria-pressed={tab === "list"}
                  onClick={() => setTab("list")}
                >
                  Member view
                </button>
                <button
                  className="text-link"
                  aria-pressed={tab === "desk"}
                  onClick={() => setTab("desk")}
                >
                  Owner desk
                </button>
              </>
            )}
            <button
              className="text-link"
              disabled={working}
              onClick={() => action(() => router.invalidate({ sync: true }), "Up to date.")}
            >
              Refresh
            </button>
          </div>
        </div>
        {feedback}
        {tab === "list" ? (
          <>
            <EntrySection
              title="Just for you."
              eyebrow="Private offers & first access"
              entries={publicEntries.filter((e) => e.kind !== "event")}
              empty="A little quiet here, for now. Your next private offer or first look will appear here."
            />
            <EntrySection
              title="Be in the room."
              eyebrow="Premiere invitations"
              entries={publicEntries.filter((e) => e.kind === "event")}
              empty="No invitations just yet. When there is a date to put in your diary, you’ll find it here."
            />
          </>
        ) : (
          admin && (
            <section className="owner-desk">
              <header className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="eyebrow">Only you can see this</p>
                  <h2 className="mt-4 text-title">The membership desk.</h2>
                </div>
                <button className="editorial-button" onClick={() => setEditing(blankEntry())}>
                  <Plus size={16} />
                  Create an entry
                </button>
              </header>
              <p className="mt-5 text-sm text-muted">
                Drafts stay private to you. Publish when the details are ready. A shared offer
                reaches all active members; a personal offer reaches only the member you choose.
              </p>
              {editing && (
                <EntryEditor
                  key={editing.id ?? "new"}
                  initial={editing}
                  people={people}
                  working={working}
                  cancel={() => setEditing(null)}
                  submit={async (data) => {
                    if (await action(() => save({ data }), "Entry saved.")) setEditing(null);
                  }}
                />
              )}
              <h3 className="mt-14 text-3xl">Offers, releases & events</h3>
              <div className="mt-5 divide-y divide-line border-y border-line">
                {entries.length === 0 && (
                  <div className="py-8">
                    <p className="text-muted">Your desk is ready. Start with a draft.</p>
                    <button
                      className="text-link mt-4"
                      onClick={() =>
                        setEditing({
                          ...blankEntry(),
                          title: "Starter — your first private offer",
                          description:
                            "Replace this starter text with the offer, eligibility and redemption details before publishing.",
                          starter: true,
                        })
                      }
                    >
                      Use labelled starter content ↗
                    </button>
                  </div>
                )}
                {entries.map((entry) => (
                  <article className="desk-row" key={entry.id}>
                    <div>
                      <p className="eyebrow">
                        {entry.kind} · {entry.status} {entry.starter ? "· Starter" : ""}
                      </p>
                      <h4 className="mt-2 font-serif text-2xl">{entry.title}</h4>
                      <p className="text-xs text-muted">
                        {entry.audience_user_id ? "Personal access" : "All active members"}
                      </p>
                    </div>
                    <button className="text-link" onClick={() => setEditing(toInput(entry))}>
                      Edit & manage ↗
                    </button>
                  </article>
                ))}
              </div>
              <h3 className="mt-14 text-3xl">The names on the list</h3>
              <p className="mt-3 text-sm text-muted">
                {people.filter((p) => p.status === "pending").length} awaiting your approval
              </p>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {people.map((p) => (
                  <li key={p.user_id} className="desk-row">
                    <div>
                      <p className="font-serif text-2xl">{p.name}</p>
                      <p className="break-all text-sm text-muted">{p.email}</p>
                      <p className="eyebrow mt-2">{p.status}</p>
                    </div>
                    {p.user_id !== membership.user_id && (
                      <button
                        disabled={working}
                        className="editorial-button"
                        onClick={() =>
                          action(
                            () =>
                              update({
                                data: {
                                  userId: p.user_id,
                                  status: p.status === "active" ? "paused" : "active",
                                },
                              }),
                            "Membership updated.",
                          )
                        }
                      >
                        {p.status === "active"
                          ? "Pause"
                          : p.status === "paused"
                            ? "Restore"
                            : "Approve"}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )
        )}
      </div>
    </main>
  );
}

function EntrySection({
  title,
  eyebrow,
  entries,
  empty,
}: {
  title: string;
  eyebrow: string;
  entries: PrivateEntry[];
  empty: string;
}) {
  return (
    <section className="private-section">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {entries.length ? (
        <div className="private-entries">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="private-empty">
          <span aria-hidden="true">✳</span>
          <p>{empty}</p>
          <Link to="/shop" className="text-link">
            In the meantime, explore ORA ↗
          </Link>
        </div>
      )}
    </section>
  );
}
function EntryCard({ entry: e }: { entry: PrivateEntry }) {
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  const [copyError, setCopyError] = useState(false);
  const expired = Boolean(e.ends_at && Date.parse(e.ends_at) <= now);
  const pastEvent = e.kind === "event" && Boolean(e.event_at && Date.parse(e.event_at) <= now);
  const available = !expired && !pastEvent && e.availability === "available";
  const state = expired
    ? "Expired"
    : pastEvent
      ? "Event passed"
      : e.availability === "sold_out"
        ? "Sold out"
        : e.availability === "closed"
          ? "Closed"
          : e.kind === "event"
            ? "Upcoming"
            : "Available now";
  return (
    <article className="private-entry">
      <p className="eyebrow">
        {e.kind === "release" ? "First access" : e.kind} · {state}
      </p>
      {e.starter && <p className="starter-label">Starter content — details to be confirmed</p>}
      <h3>{e.title}</h3>
      <p className="whitespace-pre-wrap text-sm text-muted">{e.description}</p>
      {e.event_at && <p className="mt-5 text-sm">{formatDate(e.event_at, true)}</p>}
      {e.location && <p className="text-sm text-muted">{e.location}</p>}
      {e.ends_at && (
        <p className="mt-4 text-xs text-muted">
          {expired ? "Ended" : "Available until"} {formatDate(e.ends_at, true)}
        </p>
      )}
      {e.code && available && (
        <div className="private-code">
          <code>{e.code}</code>
          <button
            aria-label="Copy discount code"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(e.code);
                setCopied(true);
                setCopyError(false);
              } catch {
                setCopyError(true);
              }
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <span role="status" className="text-xs">
            {copied ? "Copied" : copyError ? "Select the code to copy it" : ""}
          </span>
        </div>
      )}
      {e.link && available && (
        <a className="text-link mt-7" href={e.link} target="_blank" rel="noreferrer">
          {e.kind === "event" ? "View reservation details" : "Explore on ORA"} ↗
        </a>
      )}
    </article>
  );
}
function formatDate(value: string, time = false) {
  return (
    new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      ...(time ? { timeStyle: "short" as const } : {}),
      timeZone: "Africa/Johannesburg",
    }).format(new Date(value)) + (time ? " SAST" : "")
  );
}
function blankEntry(): EntryInput {
  return {
    kind: "offer",
    title: "",
    description: "",
    status: "draft",
    availability: "available",
    starts_at: "",
    ends_at: "",
    event_at: "",
    location: "",
    link: "",
    code: "",
    audience_user_id: "",
    starter: false,
  };
}
function toInput(e: PrivateEntry): EntryInput {
  return {
    ...e,
    starts_at: e.starts_at ? new Date(e.starts_at).toISOString() : "",
    ends_at: e.ends_at ? new Date(e.ends_at).toISOString() : "",
    event_at: e.event_at ? new Date(e.event_at).toISOString() : "",
  };
}
function EntryEditor({
  initial,
  people,
  working,
  cancel,
  submit,
}: {
  initial: EntryInput;
  people: { user_id: string; name: string; email: string }[];
  working: boolean;
  cancel: () => void;
  submit: (data: EntryInput) => Promise<void>;
}) {
  const [data, setData] = useState(initial);
  const field = (key: keyof EntryInput, value: string | boolean) =>
    setData((old) => ({ ...old, [key]: value }));
  return (
    <form
      className="entry-editor"
      onSubmit={(event) => {
        event.preventDefault();
        void submit(data);
      }}
    >
      <h3 className="text-3xl">{data.id ? "Edit the details" : "Something for the list"}</h3>
      <div className="editor-fields">
        <label>
          Entry type
          <select value={data.kind} onChange={(e) => field("kind", e.target.value)}>
            <option value="offer">Private offer</option>
            <option value="release">Early release</option>
            <option value="event">Premiere event</option>
          </select>
        </label>
        <label>
          Visibility
          <select value={data.status} onChange={(e) => field("status", e.target.value)}>
            <option value="draft">Draft — only you</option>
            <option value="published">Published — eligible members</option>
            <option value="expired">Expired — hidden from members</option>
            <option value="archived">Archived — only you</option>
          </select>
        </label>
        <label className="md:col-span-2">
          Title
          <input
            required
            maxLength={160}
            value={data.title}
            onChange={(e) => field("title", e.target.value)}
          />
        </label>
        <label className="md:col-span-2">
          Details & terms
          <textarea
            rows={5}
            maxLength={5000}
            value={data.description}
            onChange={(e) => field("description", e.target.value)}
          />
        </label>
        <label>
          Availability
          <select value={data.availability} onChange={(e) => field("availability", e.target.value)}>
            <option value="available">Available</option>
            <option value="sold_out">Sold out</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label>
          Who can see this
          <select
            value={data.audience_user_id}
            onChange={(e) => field("audience_user_id", e.target.value)}
          >
            <option value="">All active members</option>
            {people.map((p) => (
              <option key={p.user_id} value={p.user_id}>
                {p.name} — {p.email}
              </option>
            ))}
          </select>
        </label>
        {(
          [
            ["starts_at", "Visible from"],
            ["ends_at", "Expires"],
            ...(data.kind === "event" ? [["event_at", "Event date"]] : []),
          ] as ["starts_at" | "ends_at" | "event_at", string][]
        ).map(([key, label]) => (
          <label key={key}>
            {label} (UTC)
            <input
              type="datetime-local"
              value={data[key] ? new Date(data[key]).toISOString().slice(0, 16) : ""}
              onChange={(e) =>
                field(key, e.target.value ? new Date(e.target.value + "Z").toISOString() : "")
              }
            />
          </label>
        ))}
        {data.kind === "event" ? (
          <label>
            Location
            <input
              maxLength={300}
              value={data.location}
              onChange={(e) => field("location", e.target.value)}
            />
          </label>
        ) : (
          <label>
            Discount code (optional)
            <input
              maxLength={100}
              autoComplete="off"
              value={data.code}
              onChange={(e) => field("code", e.target.value)}
            />
          </label>
        )}
        <label className="md:col-span-2">
          {data.kind === "event" ? "Reservation link (HTTPS)" : "ORA Shopify link (HTTPS)"}
          <input
            type="url"
            value={data.link}
            onChange={(e) => field("link", e.target.value)}
            placeholder="https://"
          />
        </label>
        <label className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={data.starter}
            onChange={(e) => field("starter", e.target.checked)}
          />{" "}
          Clearly label this as starter content
        </label>
      </div>
      <div className="mt-6 flex flex-wrap gap-5">
        <button className="editorial-button" disabled={working} type="submit">
          {working ? "Saving…" : data.status === "published" ? "Save & publish" : "Save entry"}
        </button>
        <button disabled={working} className="text-link" type="button" onClick={cancel}>
          Close editor
        </button>
      </div>
    </form>
  );
}
