"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import saved from "@/lib/saved-reviews.json";
import { REVIEWS_URL, type Review, type ReviewsPayload } from "@/lib/reviews";
import { Reveal } from "./reveal";

const POLL = 10 * 60 * 1000; // re-ask the site's API every 10 minutes while the page is open

const dateFmt = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Moscow" });
const timeFmt = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Moscow" });
const ratingFmt = (n: number) => n.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const plural = (n: number, one: string, few: string, many: string) =>
  n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? few : many;

function Stars({ n, className }: { n: number; className: string }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${n} из 5`}>
      {Array.from({ length: 5 }, (_, k) => (
        <Star key={k} className={`${className} ${k < n ? "" : "opacity-25"}`} aria-hidden="true" />
      ))}
    </span>
  );
}

function ReviewCard({ r }: { r: Review }) {
  const [open, setOpen] = useState(false);
  const long = r.text.length > 240;
  return (
    <article className="flex h-full flex-col gap-4 rounded-tile bg-surface p-5 shadow-[inset_0_0_0_1px_#1f1830]">
      <Stars n={r.rating} className="size-4 fill-violet text-violet" />
      <blockquote className={`flex-1 whitespace-pre-line text-[15px] leading-relaxed [overflow-wrap:anywhere] ${long && !open ? "line-clamp-6" : ""}`}>{r.text}</blockquote>
      {long && (
        <button type="button" onClick={() => setOpen((v) => !v)} className="self-start text-small text-violet underline decoration-violet/50 underline-offset-4 hover:text-ink">
          {open ? "Свернуть" : "Читать полностью"}
        </button>
      )}
      <p className="flex items-center gap-3 text-small">
        {r.avatar ? (
          // avatars come from Yandex; no referrer is sent with them
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.avatar} alt="" width={36} height={36} referrerPolicy="no-referrer" loading="lazy" className="size-9 rounded-full bg-violet-deep object-cover" />
        ) : (
          <span className="grid size-9 place-items-center rounded-full bg-violet-deep font-semibold text-ink">{r.name[0]}</span>
        )}
        <span>
          <span className="block font-semibold">{r.name}</span>
          <time dateTime={r.date} className="text-soft">
            {dateFmt.format(new Date(r.date)).replace(/\s?г\.$/, "")}
          </time>
        </span>
      </p>
    </article>
  );
}

/**
 * Reviews block of the home page. Renders the saved newest reviews straight away, then swaps in the
 * live ones from /api/reviews (Yandex Maps, cached for 30 minutes) and re-checks every 10 minutes.
 */
export function LiveReviews() {
  const [data, setData] = useState<ReviewsPayload>(saved as ReviewsPayload);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const live = data.source !== "saved";

  useEffect(() => {
    let stop = false;
    const load = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const res = await fetch("/api/reviews", { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as ReviewsPayload;
        if (!stop && next.reviews?.length) {
          setData(next);
          setCheckedAt(new Date());
        }
      } catch {
        /* keep what is shown */
      }
    };
    load();
    const t = setInterval(load, POLL);
    document.addEventListener("visibilitychange", load);
    return () => {
      stop = true;
      clearInterval(t);
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  return (
    <div className="wrap grid gap-8 lg:grid-cols-12">
      <Reveal from="left" className="lg:col-span-4">
        <p className="eyebrow">Отзывы</p>
        <h2 id="reviews-title" className="mt-3">
          Что говорят гости
        </h2>
        <div className="mt-8 rounded-tile bg-surface p-6 shadow-[inset_0_0_0_1px_#2e2540]">
          <p className="flex items-center gap-3">
            <span className="neon-ochre font-display text-[56px] font-bold leading-none">{ratingFmt(data.rating)}</span>
            <Stars n={Math.round(data.rating)} className="size-5 fill-ochre text-ochre" />
          </p>
          <p className="mt-3 text-soft">
            {data.ratings} {plural(data.ratings, "оценка", "оценки", "оценок")} и {data.reviewsCount}{" "}
            {plural(data.reviewsCount, "отзыв", "отзыва", "отзывов")} на Яндекс Картах.
          </p>
          <p className="mt-4 flex items-center gap-2 text-small text-soft" aria-live="polite">
            <span className="relative flex size-2.5">
              {live && <span className="absolute inset-0 animate-ping rounded-full bg-[#3dff8a] opacity-70" />}
              <span className={`relative size-2.5 rounded-full ${live ? "bg-[#3dff8a]" : "bg-soft/50"}`} />
            </span>
            {live && checkedAt ? `Живые отзывы с Яндекс Карт · обновлено в ${timeFmt.format(checkedAt)}` : "Свежие отзывы с Яндекс Карт"}
          </p>
          <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 w-full">
            Все отзывы на Яндекс Картах
          </a>
        </div>
      </Reveal>
      <ul key={data.reviews.map((r) => r.id).join()} className="cat-panel grid gap-3 sm:grid-cols-2 lg:col-span-8">
        {data.reviews.map((r, i) => (
          <Reveal as="li" key={r.id} from={i % 2 ? "right" : "up"} order={i % 2}>
            <ReviewCard r={r} />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
