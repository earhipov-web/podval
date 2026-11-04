"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { navLinks as links } from "@/lib/data";
import { useCart } from "./cart";


export function SiteNav() {
  const path = usePathname();
  const { count, setOpen, ready } = useCart();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // the badge pops whenever the count changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- keyed animation restart
    setBump((b) => b + 1);
  }, [count]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu after navigating
    setMenu(false);
  }, [path]);

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          scrolled || menu ? "bg-ground/80 shadow-[0_1px_0_#2e2540] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <nav aria-label="Основное меню" className="wrap flex h-[72px] items-center justify-between gap-6">
          <Link href="/" aria-label="PODVAL, на главную" className="shrink-0 transition-[filter] duration-300 hover:drop-shadow-[0_0_14px_rgb(227_93_255/0.7)]">
            <Image src="/logo.png" alt="PODVAL" width={441} height={176} priority className="h-10 w-auto" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => {
              const on = l.href === path;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={on ? "page" : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors duration-300 ${
                      on ? "text-ink" : "text-soft hover:text-ink"
                    }`}
                  >
                    {l.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-violet shadow-[0_0_10px_#b45cff] transition-transform duration-500 ${
                        on ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link href="/booking" className="btn btn-ochre hidden !min-h-[42px] sm:inline-flex">
              Забронировать
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Корзина${ready && count ? `, позиций: ${count}` : ""}`}
              className="icon-btn relative"
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              {ready && count > 0 && (
                <span
                  key={bump}
                  className="pop absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-violet px-1 text-[12px] font-bold text-black shadow-[0_0_12px_#b45cff]"
                >
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              className="icon-btn lg:hidden"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label={menu ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setMenu((v) => !v)}
            >
              {menu ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        className="mobile-menu fixed inset-x-0 bottom-0 top-[72px] z-40 bg-ground/95 backdrop-blur-xl lg:hidden"
        data-open={menu}
        aria-hidden={!menu}
        inert={!menu}
      >
        <ul className="wrap flex flex-col gap-1 pt-6">
          {links.map((l, i) => (
            <li key={l.href}>
              <Link
                href={l.href}
                style={{ ["--i" as string]: i }}
                aria-current={l.href === path ? "page" : undefined}
                className={`block py-3 font-display text-[30px] ${l.href === path ? "neon-violet" : "text-ink"}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-4">
            <Link href="/booking" style={{ ["--i" as string]: links.length }} className="btn btn-ochre w-full">
              Забронировать стол
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
