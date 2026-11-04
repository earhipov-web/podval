"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { CartLineRow, useCart } from "@/components/cart";
import { SiteFooter } from "@/components/footer";
import { rub } from "@/lib/data";

export default function CartPage() {
  const { lines, total, count, clear, ready } = useCart();

  return (
    <>
      <main className="wrap min-h-[70svh] pt-6 lg:pt-10">
        <p className="eyebrow in-left">Корзина</p>
        <h1 className="in-left mt-4 text-h1" style={{ ["--i" as string]: 1 }}>
          Ваш заказ
        </h1>

        {!ready ? null : lines.length === 0 ? (
          <div className="in-up mt-12 flex flex-col items-center gap-4 rounded-tile bg-surface px-6 py-16 text-center shadow-[inset_0_0_0_1px_#2e2540]">
            <span className="grid size-16 place-items-center rounded-full bg-surface-2 text-violet">
              <ShoppingBag className="size-7" aria-hidden="true" />
            </span>
            <p className="text-lead font-semibold">В корзине пока ничего нет</p>
            <p className="max-w-[40ch] text-soft">Загляните в меню: кальян + чай до 19:00 за 799 ₽ ждёт вас.</p>
            <Link href="/menu" className="btn btn-neon mt-2">
              Открыть меню
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-[var(--gutter)] lg:grid-cols-12">
            <section aria-label="Позиции" className="in-left lg:col-span-7" style={{ ["--i" as string]: 2 }}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-soft">
                  {count} {count % 10 === 1 && count % 100 !== 11 ? "позиция" : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? "позиции" : "позиций"}
                </p>
                <button type="button" onClick={clear} className="text-small text-soft underline decoration-line underline-offset-4 hover:text-ink">
                  Очистить корзину
                </button>
              </div>
              <ul className="flex flex-col gap-2">
                {lines.map((l) => (
                  <CartLineRow key={l.item.id} line={l} />
                ))}
              </ul>
              <Link href="/menu" className="btn btn-ghost mt-4">
                Добавить ещё из меню
              </Link>
            </section>

            <aside className="in-right lg:col-span-5" style={{ ["--i" as string]: 3 }}>
              <div className="sticky top-[96px] rounded-tile bg-surface p-6 shadow-[inset_0_0_0_1px_#2e2540]">
                <h2 className="font-display text-[24px]">Итого</h2>
                <dl className="mt-5 flex flex-col gap-2 text-soft">
                  {lines.map((l) => (
                    <div key={l.item.id} className="flex justify-between gap-4">
                      <dt className="truncate">
                        {l.item.name} × {l.qty}
                      </dt>
                      <dd className="shrink-0 tabular-nums">{rub(l.item.price * l.qty)}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
                  <span className="font-semibold">К оплате</span>
                  <span className="neon-violet font-display text-[32px] font-bold tabular-nums">{rub(total)}</span>
                </div>
                <Link href="/checkout" className="btn btn-neon mt-6 w-full">
                  Оплатить <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <p className="mt-3 text-center text-small text-soft">Заказ принесут к вашему столу.</p>
              </div>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
