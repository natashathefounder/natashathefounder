import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/prize")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get("origin");
        if (!origin || new URL(origin).host !== new URL(request.url).host) {
          return Response.json({ error: "Refresh and try again." }, { status: 403 });
        }
        let body: { email?: string; word?: string; extras?: string[] };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "That email could not be read." }, { status: 400 });
        }
        const email = String(body.email || "")
          .trim()
          .toLowerCase();
        if (!/^[^
\s@]+@[^
\s@]+\.[^
\s@]+$/.test(email) || email.length > 254) {
          return Response.json({ error: "Enter a real email address." }, { status: 400 });
        }
        console.info("[prize]", email, body.word || "", (body.extras || []).join(","));
        const hook = process.env.PRIZE_NOTIFY_URL;
        if (hook) {
          try {
            await fetch(hook, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email,
                word: body.word || "",
                extras: body.extras || [],
                source: "letter-game",
                at: new Date().toISOString(),
              }),
              signal: AbortSignal.timeout(4000),
            });
          } catch {
            /* optional notify */
          }
        }
        return Response.json({ ok: true });
      },
    },
  },
});
