import { fetchLiveReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

// The CDN keeps an answer for 30 minutes and serves the old one while it fetches a new one,
// so Yandex is asked at most twice an hour however many guests open the page.
const CACHE = "public, s-maxage=1800, stale-while-revalidate=86400";

export async function GET() {
  const live = await fetchLiveReviews();
  if (!live) {
    return Response.json({ error: "Yandex Maps did not answer" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
  return Response.json(live, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "CDN-Cache-Control": CACHE,
      "Netlify-CDN-Cache-Control": CACHE,
    },
  });
}
