"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { itemById, rub, type MenuItem } from "@/lib/data";

type Line = { id: string; qty: number };
export type CartLine = { item: MenuItem; qty: number };

type Cart = {
  lines: CartLine[];
  count: number;
  total: number;
  ready: boolean;
  qtyOf: (id: string) => number;
  add: (id: string) => void;
  remove: (id: string) => void;
  drop: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<Cart | null>(null);
const STORE = "podval:cart";

function read(): Line[] {
  try {
    const raw = window.localStorage.getItem(STORE);
    const list: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return [];
    return list.filter(
      (l): l is Line =>
        typeof l === "object" && l !== null && typeof l.id === "string" && Number.isInteger(l.qty) && l.qty > 0 && !!itemById(l.id),
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ name: string; n: number } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the saved cart is only known in the browser
    setRaw(read());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORE, JSON.stringify(raw));
    } catch {
      /* storage blocked: the cart still works for this visit */
    }
  }, [raw, ready]);

  const add = useCallback((id: string) => {
    setRaw((list) => {
      const has = list.find((l) => l.id === id);
      return has ? list.map((l) => (l.id === id ? { ...l, qty: Math.min(99, l.qty + 1) } : l)) : [...list, { id, qty: 1 }];
    });
    const item = itemById(id);
    if (item) {
      clearTimeout(toastTimer.current);
      setToast((t) => ({ name: item.name, n: (t?.n ?? 0) + 1 }));
      toastTimer.current = setTimeout(() => setToast(null), 2200);
    }
  }, []);
  const remove = useCallback(
    (id: string) => setRaw((list) => list.flatMap((l) => (l.id !== id ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []))),
    [],
  );
  const drop = useCallback((id: string) => setRaw((list) => list.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<Cart>(() => {
    const lines = raw.flatMap((l) => {
      const item = itemById(l.id);
      return item ? [{ item, qty: l.qty }] : [];
    });
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total: lines.reduce((s, l) => s + l.qty * l.item.price, 0),
      ready,
      qtyOf: (id) => raw.find((l) => l.id === id)?.qty ?? 0,
      add,
      remove,
      drop,
      clear,
      open,
      setOpen,
    };
  }, [raw, ready, add, remove, drop, clear, open]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
      <div className="toast" data-show={!!toast} role="status" aria-live="polite">
        {toast && (
          <div className="flex items-center gap-3 rounded-full bg-surface-2 py-2 pl-2 pr-5 shadow-[0_0_0_1px_#2e2540,0_20px_50px_rgb(0_0_0/0.6)]">
            <span className="grid size-9 place-items-center rounded-full bg-violet text-black">
              <Check className="size-5" aria-hidden="true" />
            </span>
            <span className="text-small">
              <span className="font-semibold">{toast.name}</span> в корзине
            </span>
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}

/** − 2 + stepper used in the drawer, the cart page and on menu cards. */
export function Qty({ id, compact }: { id: string; compact?: boolean }) {
  const { qtyOf, add, remove } = useCart();
  const q = qtyOf(id);
  const size = compact ? "size-9" : "size-10";
  return (
    <div className="flex items-center gap-1 rounded-full bg-black/40 p-1" role="group" aria-label="Количество">
      <button type="button" aria-label="Убрать одну" onClick={() => remove(id)} className={`icon-btn ${size}`}>
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <output key={q} aria-live="polite" className="pop w-7 text-center font-semibold tabular-nums">
        {q}
      </output>
      <button type="button" aria-label="Добавить ещё одну" onClick={() => add(id)} className={`icon-btn ${size}`}>
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function CartLineRow({ line }: { line: CartLine }) {
  const { drop } = useCart();
  const { item, qty } = line;
  return (
    <li className="flex gap-3 rounded-2xl bg-surface-2 p-3">
      <div className="relative size-[72px] shrink-0 overflow-hidden rounded-xl bg-grey">
        {item.img ? (
          <Image src={item.img} alt="" fill sizes="72px" className="object-cover" />
        ) : (
          <span className="grid h-full place-items-center font-display text-[22px] text-violet">{item.name[0]}</span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold">{item.name}</p>
            <p className="text-small text-soft">
              {item.tag ? `${item.tag} · ` : ""}
              {rub(item.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => drop(item.id)}
            aria-label={`Убрать «${item.name}» из корзины`}
            className="grid size-9 shrink-0 place-items-center rounded-full text-soft transition-colors hover:bg-grey hover:text-ink"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Qty id={item.id} compact />
          <span className="font-semibold tabular-nums">{rub(item.price * qty)}</span>
        </div>
      </div>
    </li>
  );
}

function CartDrawer() {
  const { lines, total, count, open, setOpen } = useCart();
  // stays mounted for the slide out, then unmounts
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mount first, then slide in on the next frame
      setMounted(true);
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(r);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 560);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 80);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      clearTimeout(t);
    };
  }, [open, setOpen]);

  if (!mounted) return null;
  return (
    <>
      <div className="overlay" data-open={shown} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside className="drawer" data-open={shown} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className="flex items-center justify-between gap-4 px-5 pb-4 pt-5">
          <h2 id="drawer-title" className="font-display text-[24px]">
            Корзина {count > 0 && <span className="text-violet">· {count}</span>}
          </h2>
          <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="icon-btn" aria-label="Закрыть корзину">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-surface-2 text-violet">
              <ShoppingBag className="size-7" aria-hidden="true" />
            </span>
            <p className="text-lead font-semibold">Пока пусто</p>
            <p className="text-small text-soft">Добавьте кальян, чай или коктейль из меню, и они появятся здесь.</p>
            <Link href="/menu" onClick={() => setOpen(false)} className="btn btn-neon mt-2">
              Открыть меню
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 pb-4">
              {lines.map((l) => (
                <CartLineRow key={l.item.id} line={l} />
              ))}
            </ul>
            <div className="border-t border-line px-5 pb-6 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-soft">Итого</span>
                <span className="font-display text-[26px] tabular-nums">{rub(total)}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href="/cart" onClick={() => setOpen(false)} className="btn btn-ghost">
                  В корзину
                </Link>
                <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-neon">
                  Оплатить
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
