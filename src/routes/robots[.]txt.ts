import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          process.env.VERCEL_ENV === "production" && process.env.ALLOW_INDEXING === "true"
            ? "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /cart\nDisallow: /search\nSitemap: https://www.natashathefounder.com/sitemap.xml"
            : "User-agent: *\nDisallow: /",
          { headers: { "Content-Type": "text/plain" } },
        ),
    },
  },
});
