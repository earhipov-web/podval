"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { gallery, type Photo } from "@/lib/data";
import { Reveal } from "./reveal";

const all = gallery.flatMap((g) => g.photos.map((p) => ({ ...p, group: g.name })));

/** Photos grouped by room, each opening in a lightbox that fades and scales in. */
export function GalleryGrid() {
  const [filter, setFilter] = useState<string>("all");
  const [index, setIndex] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = (p: Photo) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setIndex(all.findIndex((x) => x.src === p.src));
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  };
  const close = useCallback(() => {
    setShown(false);
    setTimeout(() => {
      setIndex(null);
      lastFocus.current?.focus();
    }, 420);
  }, []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + all.length) % all.length)), []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [index, close, step]);

  const groups = filter === "all" ? gallery : gallery.filter((g) => g.id === filter);
  const cur = index !== null ? all[index] : null;

  return (
    <>
      <div className="sticky top-[72px] z-30 -mx-[var(--gutter)] bg-ground/85 px-[var(--gutter)] py-3 backdrop-blur-xl">
        <div className="flex gap-1 overflow-x-auto [scrollbar-width:none]" role="group" aria-label="Фильтр по залам">
          {[{ id: "all", name: "Все фото" }, ...gallery].map((g) => {
            const on = filter === g.id;
            return (
              <button
                key={g.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(g.id)}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-[15px] font-semibold transition-[background-color,color,box-shadow] duration-300 ${
                  on ? "bg-violet text-black shadow-[0_0_24px_rgb(180_92_255/0.5)]" : "bg-surface-2/60 text-soft hover:text-ink"
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      <div key={filter} className="mt-6 flex flex-col gap-[clamp(48px,7vw,96px)]">
        {groups.map((g, gi) => (
          <section key={g.id} aria-labelledby={`g-${g.id}`}>
            <div className={`flex flex-col gap-2 md:flex-row md:items-end md:justify-between ${filter !== "all" ? "in-left" : ""}`}>
              <Reveal as="h2" from="left" id={`g-${g.id}`}>
                <span className="font-display text-[14px] text-soft">0{gallery.indexOf(g) + 1} </span>
                {g.name}
              </Reveal>
              <Reveal as="p" from="right" className="max-w-[46ch] text-soft">
                {g.text}
              </Reveal>
            </div>
            <ul className={`mt-6 grid gap-3 ${g.photos.length === 1 ? "" : g.photos.length === 2 ? "md:grid-cols-[1.5fr_1fr]" : "md:grid-cols-[1fr_1fr_1.5fr]"}`}>
              {g.photos.map((p, i) => (
                <Reveal as="li" key={p.src} from={(i + gi) % 2 ? "right" : "left"} order={i}>
                  <button
                    type="button"
                    onClick={() => open(p)}
                    aria-label={`Открыть фото: ${p.alt}`}
                    className={`frame group relative block w-full ${p.h > p.w ? "aspect-[3/4]" : g.photos.length === 1 ? "aspect-[16/9]" : "aspect-[3/2] md:h-full md:aspect-auto"}`}
                  >
                    <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
                    <span className="absolute inset-x-0 bottom-0 z-[2] translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 text-left text-small opacity-0 transition-[transform,opacity] duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {p.alt}
                    </span>
                  </button>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {cur && (
        <>
          <div className="overlay !bg-black/90" data-open={shown} onClick={close} aria-hidden="true" />
          <div className="lightbox" data-open={shown} role="dialog" aria-modal="true" aria-label={cur.alt} onClick={close}>
            <figure className="lightbox-img flex max-h-full w-full max-w-[1200px] flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
              <div key={cur.src} className="cat-panel relative w-full" style={{ aspectRatio: `${cur.w} / ${cur.h}`, maxHeight: "78svh", maxWidth: `calc(78svh * ${cur.w / cur.h})` }}>
                <Image src={cur.src} alt={cur.alt} fill sizes="100vw" className="rounded-2xl object-contain" />
              </div>
              <figcaption className="flex w-full max-w-[720px] items-center justify-between gap-4 text-small">
                <span>
                  <span className="text-violet">{cur.group}</span> · <span className="text-soft">{cur.alt}</span>
                </span>
                <span className="shrink-0 tabular-nums text-soft">
                  {index! + 1} / {all.length}
                </span>
              </figcaption>
            </figure>
            <button ref={closeRef} type="button" onClick={close} aria-label="Закрыть" className="icon-btn absolute right-4 top-4">
              <X className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={(e) => (e.stopPropagation(), step(-1))} aria-label="Предыдущее фото" className="icon-btn absolute left-3 top-1/2 -translate-y-1/2">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={(e) => (e.stopPropagation(), step(1))} aria-label="Следующее фото" className="icon-btn absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </>
  );
}
