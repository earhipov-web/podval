"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { rub, type MenuItem } from "@/lib/data";
import { Qty, useCart } from "./cart";

/** Add-to-cart control: a button, then a − n + stepper once the item is in the cart. */
export function AddToCart({ item, wide }: { item: MenuItem; wide?: boolean }) {
  const { qtyOf, add, ready } = useCart();
  const q = ready ? qtyOf(item.id) : 0;
  if (q > 0) return <Qty id={item.id} compact />;
  return (
    <button
      type="button"
      onClick={() => add(item.id)}
      aria-label={`Добавить «${item.name}» в корзину`}
      className={`btn btn-neon !min-h-11 ${wide ? "" : "!px-4"}`}
    >
      <Plus className="size-4" aria-hidden="true" />
      {wide ? "В корзину" : <span className="hidden sm:inline">Добавить</span>}
    </button>
  );
}

const TAG_TONE: Record<string, string> = {
  easy: "text-blue",
  medium: "text-ochre",
  hard: "text-pink",
};

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-tile bg-surface shadow-[inset_0_0_0_1px_#1f1830] transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgb(180_92_255/0.5),0_20px_50px_-20px_rgb(180_92_255/0.45)]">
      {item.img ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-grey">
          <Image
            src={item.img}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-1 p-3 sm:gap-2 sm:p-4">
        {item.tag && (
          <p className={`text-[12px] font-semibold sm:text-[13px] ${TAG_TONE[item.tag] ?? "text-violet"}`}>{item.tag}</p>
        )}
        <h3 className="text-[15px] leading-snug sm:text-[18px]">{item.name}</h3>
        {item.note && <p className="line-clamp-2 text-[12.5px] leading-snug text-soft sm:line-clamp-none sm:text-small">{item.note}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 sm:gap-3 sm:pt-3">
          <span className="whitespace-nowrap font-sans text-[17px] font-bold tabular-nums sm:text-[20px]">{rub(item.price)}</span>
          <AddToCart item={item} />
        </div>
      </div>
    </article>
  );
}
