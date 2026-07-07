// SEO Agency drop-in — proxies /llms.txt + /llms-full.txt to publishare serve-llms.
// Reached via vercel.json rewrite: /llms.txt → /api/llms  /llms-full.txt → /api/llms?full=1

const SUPABASE_URL = "https://vpysqshhafthuxvokwqj.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweXNxc2hoYWZ0aHV4dm9rd3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTY3ODcsImV4cCI6MjA2NTkzMjc4N30.fza16gc2qHpGzzMFa1H3O6W-YIsVTsCLH9uYy9pR31I";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const host = url.host;
  const full = url.searchParams.get("full") === "1" ? "&full=1" : "";
  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/serve-llms?host=${encodeURIComponent(host)}${full}`,
    { headers: { Authorization: `Bearer ${ANON_KEY}`, apikey: ANON_KEY } },
  );
  if (!res.ok) {
    return new Response(`# llms.txt unavailable\n`, {
      status: 503, headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  }
  return new Response(await res.text(), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
