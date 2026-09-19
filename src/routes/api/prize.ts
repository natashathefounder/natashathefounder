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
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
          return Response.json({ error: "Enter a real email address." }, { status: 400 });
        }

        const key = process.env.KLAVIYO_PRIVATE_API_KEY;
        const list = process.env.KLAVIYO_LIST_ID;
        const revision = process.env.KLAVIYO_REVISION || "2024-10-15";

        if (key && list) {
          const klaviyo = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
            method: "POST",
            headers: {
              Authorization: `Klaviyo-API-Key ${key}`,
              revision,
              accept: "application/vnd.api+json",
              "content-type": "application/vnd.api+json",
            },
            body: JSON.stringify({
              data: {
                type: "profile-subscription-bulk-create-job",
                attributes: {
                  custom_source: "ORA letter game",
                  profiles: {
                    data: [
                      {
                        type: "profile",
                        attributes: {
                          email,
                          properties: {
                            prize_word: body.word || "",
                            prize_extras: (body.extras || []).join(", "),
                            prize_code: "PLAYORA20",
                          },
                          subscriptions: {
                            email: { marketing: { consent: "SUBSCRIBED" } },
                          },
                        },
                      },
                    ],
                  },
                },
                relationships: {
                  list: { data: { type: "list", id: list } },
                },
              },
            }),
            signal: AbortSignal.timeout(8000),
          });
          if (!klaviyo.ok) {
            const detail = await klaviyo.text();
            console.error("[prize] Klaviyo", klaviyo.status, detail.slice(0, 400));
            return Response.json(
              { error: "Klaviyo could not take that address. Try checkout anyway." },
              { status: 502 },
            );
          }
        } else {
          console.info("[prize] no Klaviyo keys", email);
        }

        return Response.json({ ok: true, klaviyo: Boolean(key && list) });
      },
    },
  },
});
