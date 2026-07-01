// SEO Agency drop-in — proxies to publishare's serve-sitemap edge function
// which renders a per-host sitemap from the articles table.
// Cached at the CDN for 1h so search engine refetches don't hammer Supabase.

const SUPABASE_URL = "https://vpysqshhafthuxvokwqj.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweXNxc2hoYWZ0aHV4dm9rd3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTY3ODcsImV4cCI6MjA2NTkzMjc4N30.fza16gc2qHpGzzMFa1H3O6W-YIsVTsCLH9uYy9pR31I";

export const revalidate = 3600;
export const dynamic = "force-static";

export async function GET(req: Request) {
  const host = new URL(req.url).host;
  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/serve-sitemap?host=${encodeURIComponent(host)}`,
    {
      headers: { Authorization: `Bearer ${ANON_KEY}`, apikey: ANON_KEY },
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) {
    return new Response(`<!-- sitemap unavailable: ${res.status} -->`, {
      status: 503,
      headers: { "Content-Type": "application/xml" },
    });
  }
  return new Response(await res.text(), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
