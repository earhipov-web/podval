"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export const PAGES: Record<string, string> = {
  "/": "Главная",
  "/about": "О заведении",
  "/menu": "Меню",
  "/booking": "Бронь",
  "/gallery": "Галерея",
  "/rules": "Правила",
  "/cart": "Корзина",
  "/checkout": "Оплата",
};

const HOLD = 750;
const HOLD_REDUCED = 200;
const GIVE_UP = 8000;
const FADE = 380;

type Veil = { name: string; state: "in" | "out" };

/**
 * Between pages: a click on a link to another page covers the screen with the glowing logo and the
 * page name, then lifts once the new page has rendered, and the new page plays its entrance.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [veil, setVeil] = useState<Veil | null>(null);
  const started = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  const lift = useCallback(
    (after: number) => {
      clear();
      timers.current.push(
        setTimeout(() => {
          delete document.documentElement.dataset.veil;
          setVeil((v) => (v ? { ...v, state: "out" } : v));
        }, after),
        setTimeout(() => setVeil(null), after + FADE),
      );
    },
    [clear],
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      e.preventDefault();
      started.current = performance.now();
      document.documentElement.dataset.veil = "";
      setVeil({ name: PAGES[url.pathname] ?? "PODVAL", state: "in" });
      clear();
      timers.current.push(setTimeout(() => lift(0), GIVE_UP));
      router.push(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clear();
    };
  }, [router, clear, lift]);

  useEffect(() => {
    const t = setTimeout(() => Object.keys(PAGES).forEach((p) => router.prefetch(p)), 2500);
    return () => clearTimeout(t);
  }, [router]);

  useEffect(() => {
    if (!started.current) return;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const hold = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? HOLD_REDUCED : HOLD;
    lift(Math.max(0, hold - (performance.now() - started.current)));
    started.current = 0;
  }, [pathname, lift]);

  if (!veil) return null;
  return (
    <div className="page-veil" data-state={veil.state} role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" width={220} height={88} className="veil-logo h-auto w-[180px] sm:w-[220px]" />
        <p className="text-small font-medium uppercase tracking-[0.24em] text-soft">
          <span className="sr-only">Загрузка: </span>
          {veil.name}
        </p>
      </div>
    </div>
  );
}
