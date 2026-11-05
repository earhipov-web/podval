// Live reviews from Yandex Maps.
//
// The organisation's reviews page renders its first 50 reviews into the HTML as JSON
// ("reviewResults") together with the rating ("ratingData"). We read that, sort by date and keep the
// newest. If the page cannot be read (a captcha, a markup change), the official Yandex reviews widget
// is the second source, and the saved reviews in data.ts are the last resort.

export type Review = {
  id: string;
  name: string;
  avatar?: string;
  /** ISO date of the review */
  date: string;
  rating: number;
  text: string;
};

export type ReviewsPayload = {
  source: "yandex" | "yandex-widget" | "saved";
  fetchedAt: string;
  rating: number;
  ratings: number;
  reviewsCount: number;
  reviews: Review[];
};

export const ORG_ID = "159775749858";
export const REVIEWS_URL = `https://yandex.ru/maps/org/podval/${ORG_ID}/reviews/`;
const WIDGET_URL = `https://yandex.ru/maps-reviews-widget/${ORG_ID}?comments`;
const SHOW = 6;

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  "Accept-Language": "ru-RU,ru;q=0.9",
  Accept: "text/html,application/xhtml+xml",
};

async function get(url: string) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { headers: HEADERS, signal: ctrl.signal, cache: "no-store", redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

/** Reads a JSON value that starts right after `key` in a page. */
function jsonAfter(html: string, key: string): unknown {
  const i = html.indexOf(key);
  if (i < 0) return null;
  const start = i + key.length;
  // find the matching end of the object or array by counting brackets outside strings
  const open = html[start];
  if (open !== "{" && open !== "[") return null;
  let depth = 0;
  let inStr = false;
  for (let k = start; k < html.length; k++) {
    const c = html[k];
    if (inStr) {
      if (c === "\\") k++;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") {
      depth--;
      if (depth === 0) return JSON.parse(html.slice(start, k + 1));
    }
  }
  return null;
}

type RawReview = {
  reviewId?: string;
  author?: { name?: string; avatarUrl?: string };
  text?: string;
  rating?: number;
  updatedTime?: string;
};

async function fromReviewsPage(): Promise<ReviewsPayload> {
  const html = await get(`${REVIEWS_URL}?ranking=by_time`);
  const results = jsonAfter(html, '"reviewResults":') as { reviews?: RawReview[] } | null;
  const list = results?.reviews ?? [];
  if (!list.length) throw new Error("no reviews in page");
  const rd = jsonAfter(html, '"ratingData":') as { ratingCount?: number; ratingValue?: number; reviewCount?: number } | null;
  const reviews = list
    .filter((r) => r.text && r.updatedTime && r.author?.name)
    .map<Review>((r) => ({
      id: r.reviewId ?? `${r.author!.name}-${r.updatedTime}`,
      name: r.author!.name!.trim(),
      avatar: r.author?.avatarUrl?.replace("{size}", "islands-68"),
      date: r.updatedTime!,
      rating: r.rating ?? 5,
      text: r.text!.trim(),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, SHOW);
  return {
    source: "yandex",
    fetchedAt: new Date().toISOString(),
    rating: Math.round((rd?.ratingValue ?? 4.9) * 10) / 10,
    ratings: rd?.ratingCount ?? 0,
    reviewsCount: rd?.reviewCount ?? 0,
    reviews,
  };
}

const MONTHS: Record<string, number> = {
  января: 0, февраля: 1, марта: 2, апреля: 3, мая: 4, июня: 5, июля: 6, августа: 7, сентября: 8, октября: 9, ноября: 10, декабря: 11,
};
const decode = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

/** "22 марта" or "30 сентября 2025" → ISO; a date without a year is this year, or last year if that is in the future */
function ruDate(s: string) {
  const m = s.trim().match(/^(\d{1,2})\s+([а-я]+)(?:\s+(\d{4}))?/i);
  if (!m || MONTHS[m[2]] === undefined) return new Date().toISOString();
  const now = new Date();
  let y = m[3] ? Number(m[3]) : now.getFullYear();
  let d = new Date(Date.UTC(y, MONTHS[m[2]], Number(m[1]), 12));
  if (!m[3] && d > now) d = new Date(Date.UTC(--y, MONTHS[m[2]], Number(m[1]), 12));
  return d.toISOString();
}

async function fromWidget(): Promise<ReviewsPayload> {
  const html = await get(WIDGET_URL);
  const blocks = html.split('<div class="comment">').slice(1);
  const reviews = blocks
    .map<Review | null>((b, i) => {
      const name = b.match(/class="comment__name">([^<]+)</)?.[1];
      const date = b.match(/class="comment__date">([^<]+)</)?.[1];
      const text = b.match(/class="comment__text">([\s\S]*?)<\/p>/)?.[1];
      if (!name || !date || !text) return null;
      const stars = (b.split("comment__stars")[1]?.split("</ul>")[0].match(/stars-list__star"/g) ?? []).length;
      return {
        id: `w${i}`,
        name: decode(name).trim(),
        avatar: b.match(/class="comment__header"><img src="([^"]+)"/)?.[1],
        date: ruDate(date),
        rating: stars || 5,
        text: decode(text).trim(),
      };
    })
    .filter((r): r is Review => !!r)
    .sort((a, b) => b.date.localeCompare(a.date));
  if (!reviews.length) throw new Error("no reviews in widget");
  const value = Number(html.match(/mini-badge__stars-count">([\d,]+)</)?.[1].replace(",", ".") ?? 4.9);
  const counts = html.match(/(\d+)\s+отзыв[а-я]*\s*•\s*(\d+)\s+оцен/);
  return {
    source: "yandex-widget",
    fetchedAt: new Date().toISOString(),
    rating: value,
    ratings: counts ? Number(counts[2]) : 0,
    reviewsCount: counts ? Number(counts[1]) : 0,
    reviews: reviews.slice(0, SHOW),
  };
}

export async function fetchLiveReviews(): Promise<ReviewsPayload | null> {
  for (const source of [fromReviewsPage, fromWidget]) {
    try {
      return await source();
    } catch {
      /* try the next source */
    }
  }
  return null;
}
