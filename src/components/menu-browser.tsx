"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { menu, rub } from "@/lib/data";
import { useCart } from "./cart";
import { MenuCard } from "./menu-card";

/**
 * The whole menu on one page: a sticky row of category tabs with a pill that glides to the active
 * one, the category's cards below, and a floating cart bar once something is in the cart.
 */
export function MenuBrowser() {
  const [active, setActive] = useState(menu[0].id);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const { count, total, setOpen, ready } = useCart();

  // a link like /menu#cocktails opens that category
  useEffect(() => {
    const h = window.location.hash.slice(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the hash is only known in the browser
    if (menu.some((c) => c.id === h)) setActive(h);
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const box = tabsRef.current;
      const el = box?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
      if (!box || !el) return;
      setPill({ x: el.offsetLeft, w: el.offsetWidth });
      const left = el.offsetLeft - box.clientWidth / 2 + el.offsetWidth / 2;
      box.scrollTo({ left, behavior: "smooth" });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  const cat = menu.find((c) => c.id === active)!;

  const pick = (id: string) => {
    setActive(id);
    history.replaceState(null, "", `#${id}`);
    const top = document.getElementById("menu-list");
    if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="menu-list" className="scroll-mt-[72px]">
      <div className="sticky top-[72px] z-30 -mx-[var(--gutter)] bg-ground/85 px-[var(--gutter)] py-3 backdrop-blur-xl">
        <div ref={tabsRef} role="tablist" aria-label="Разделы меню" className="relative flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {pill && (
            <span
              aria-hidden="true"
              className="tab-pill absolute left-0 top-0 h-full rounded-full bg-violet shadow-[0_0_24px_rgb(180_92_255/0.55)]"
              style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
            />
          )}
          {menu.map((c) => {
            const on = c.id === active;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                data-tab={c.id}
                aria-selected={on}
                aria-controls="menu-panel"
                onClick={() => pick(c.id)}
                className={`relative z-10 shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors duration-300 ${
                  on ? "text-black" : "bg-surface-2/60 text-soft hover:text-ink"
                }`}
              >
                {c.name}
                <span className={`ml-1.5 text-[12px] ${on ? "text-black/60" : "text-soft/60"}`}>{c.items.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      <section id="menu-panel" role="tabpanel" aria-labelledby="cat-title" key={cat.id} className="cat-panel pt-4 sm:pt-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h2 id="cat-title">{cat.name}</h2>
          <p className="max-w-[46ch] text-soft">{cat.lead}</p>
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {cat.items.map((item, i) => (
            <li
              key={item.id}
              className={i % 2 ? "in-right" : "in-left"}
              style={{ ["--i" as string]: Math.min(i, 8) * 0.6 }}
            >
              <MenuCard item={item} />
            </li>
          ))}
        </ul>
      </section>

      {/* floating cart bar */}
      <div
        className={`fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 transition-[transform,opacity] duration-500 [transition-timing-function:var(--ease-soft)] ${
          ready && count > 0 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[150%] opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full max-w-[460px] items-center justify-between gap-4 rounded-full bg-violet py-2 pl-2 pr-6 text-black shadow-[0_0_40px_rgb(180_92_255/0.55),0_20px_50px_rgb(0_0_0/0.6)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center gap-3 font-semibold">
            <span className="grid size-11 place-items-center rounded-full bg-black/85 text-violet">
              <ShoppingBag className="size-5" aria-hidden="true" />
            </span>
            Корзина · {count}
          </span>
          <span className="font-sans text-[18px] font-bold tabular-nums">{rub(total)}</span>
        </button>
      </div>
    </div>
  );
}
