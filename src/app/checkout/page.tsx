"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CheckCircle2, CreditCard, Info, Loader2, Lock, QrCode } from "lucide-react";
import { useCart } from "@/components/cart";
import { SiteFooter } from "@/components/footer";
import { rub } from "@/lib/data";

type Method = "card" | "sbp";

const digits = (s: string) => s.replace(/\D/g, "");
const groupCard = (s: string) => digits(s).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const groupExp = (s: string) => {
  const d = digits(s).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

/** A deterministic pattern that looks like a QR code: a demo of the SBP step. */
function FakeQr() {
  const n = 25;
  const cells: [number, number][] = [];
  let h = 2166136261;
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      h = Math.imul(h ^ (x * 31 + y * 17), 16777619) >>> 0;
      const finder = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7;
      if (finder(0, 0) || finder(n - 7, 0) || finder(0, n - 7)) continue;
      if (h % 100 < 46) cells.push([x, y]);
    }
  const Finder = ({ x, y }: { x: number; y: number }) => (
    <g>
      <rect x={x} y={y} width={7} height={7} fill="#0b0612" />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="#0b0612" />
    </g>
  );
  return (
    <svg viewBox={`-2 -2 ${n + 4} ${n + 4}`} className="size-48 rounded-2xl bg-white" role="img" aria-label="QR-код для оплаты через СБП (пример)">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#0b0612" />
      ))}
      <Finder x={0} y={0} />
      <Finder x={n - 7} y={0} />
      <Finder x={0} y={n - 7} />
    </svg>
  );
}

export default function CheckoutPage() {
  const { lines, total, clear, ready } = useCart();
  const [method, setMethod] = useState<Method>("card");
  const [table, setTable] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "paying" | "done">("idle");
  const [paid, setPaid] = useState<{ total: number; code: string; table: string } | null>(null);

  const pay = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!table.trim()) next.table = "Укажите номер стола или имя, на которое бронировали.";
    if (method === "card") {
      if (digits(card).length !== 16) next.card = "Номер карты — 16 цифр.";
      const [mm, yy] = exp.split("/");
      if (!mm || !yy || Number(mm) < 1 || Number(mm) > 12 || yy.length !== 2) next.exp = "Срок в формате ММ/ГГ.";
      if (digits(cvc).length !== 3) next.cvc = "Три цифры с обратной стороны.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    setState("paying");
    setTimeout(() => {
      setPaid({ total, code: `PV-${Math.floor(1000 + Math.random() * 9000)}`, table: table.trim() });
      setState("done");
      clear();
      setCard("");
      setExp("");
      setCvc("");
    }, 1800);
  };

  return (
    <>
      <main className="wrap min-h-[70svh] pt-6 lg:pt-10">
        <p className="eyebrow in-left">Оплата</p>
        <h1 className="in-left mt-4 text-h1" style={{ ["--i" as string]: 1 }}>
          {state === "done" ? "Оплачено" : "Оплата заказа"}
        </h1>

        <p className="in-left mt-6 flex max-w-[70ch] items-start gap-3 rounded-2xl bg-blue/10 p-4 text-small text-[#cfe0ff] shadow-[inset_0_0_0_1px_rgb(79_139_255/0.35)]" style={{ ["--i" as string]: 2 }}>
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Это пример страницы оплаты: деньги не списываются, данные карты никуда не отправляются. Перед запуском её
          подключают к платёжному сервису (ЮKassa, CloudPayments, Т-Касса).
        </p>

        {state === "done" && paid ? (
          <div className="in-up mt-10 grid gap-6 rounded-tile bg-surface p-[clamp(24px,4vw,48px)] shadow-[inset_0_0_0_1px_#2e2540] lg:grid-cols-12" role="status">
            <div className="lg:col-span-8">
              <CheckCircle2 className="size-12 text-violet drop-shadow-[0_0_14px_#b45cff]" aria-hidden="true" />
              <h2 className="mt-5">Заказ {paid.code} принят</h2>
              <p className="lead mt-3 text-soft">
                {rub(paid.total)} оплачено. Принесём к столу «{paid.table}». Если что-то нужно добавить, просто скажите
                официанту.
              </p>
            </div>
            <div className="flex items-end lg:col-span-4 lg:justify-end">
              <Link href="/menu" className="btn btn-neon">
                Вернуться в меню
              </Link>
            </div>
          </div>
        ) : !ready ? null : lines.length === 0 ? (
          <div className="in-up mt-10 rounded-tile bg-surface p-8 text-center shadow-[inset_0_0_0_1px_#2e2540]">
            <p className="text-lead font-semibold">Корзина пуста, оплачивать нечего</p>
            <Link href="/menu" className="btn btn-neon mt-5">
              Открыть меню
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-[var(--gutter)] lg:grid-cols-12">
            <form onSubmit={pay} noValidate className="in-left flex flex-col gap-3 lg:col-span-7" style={{ ["--i" as string]: 3 }}>
              <fieldset className="rounded-tile bg-surface p-5 shadow-[inset_0_0_0_1px_#2e2540] md:p-6">
                <legend className="sr-only">Куда принести заказ</legend>
                <label className="flex flex-col gap-2">
                  <span className="font-semibold">Номер стола или имя брони</span>
                  <input
                    className="field"
                    value={table}
                    onChange={(e) => setTable(e.target.value.slice(0, 40))}
                    placeholder="Например, стол 4 или Айдар"
                    aria-invalid={!!errors.table}
                    aria-describedby={errors.table ? "err-table" : undefined}
                  />
                  {errors.table && (
                    <span id="err-table" className="text-small text-[#ff8aa5]">
                      {errors.table}
                    </span>
                  )}
                </label>
              </fieldset>

              <fieldset className="rounded-tile bg-surface p-5 shadow-[inset_0_0_0_1px_#2e2540] md:p-6">
                <legend className="float-left mb-4 font-semibold">Способ оплаты</legend>
                <div className="clear-both grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: "card", label: "Банковская карта", icon: CreditCard },
                      { id: "sbp", label: "СБП по QR-коду", icon: QrCode },
                    ] as const
                  ).map((m) => {
                    const on = method === m.id;
                    return (
                      <label
                        key={m.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl p-4 transition-[background-color,box-shadow] duration-300 ${
                          on ? "bg-violet-deep shadow-[inset_0_0_0_2px_#b45cff,0_0_24px_rgb(180_92_255/0.3)]" : "bg-surface-2 shadow-[inset_0_0_0_1px_#2e2540] hover:bg-grey"
                        }`}
                      >
                        <input type="radio" name="method" value={m.id} checked={on} onChange={() => setMethod(m.id)} className="sr-only" />
                        <m.icon className={`size-5 shrink-0 ${on ? "text-violet" : "text-soft"}`} aria-hidden="true" />
                        <span className="text-[15px] font-semibold">{m.label}</span>
                      </label>
                    );
                  })}
                </div>

                <div key={method} className="cat-panel mt-5">
                  {method === "card" ? (
                    <div className="grid grid-cols-2 gap-3">
                      {/* a demo form: autofill is off so no real card lands here */}
                      <label className="col-span-2 flex flex-col gap-2">
                        <span className="text-small text-soft">Номер карты</span>
                        <input
                          className="field tabular-nums"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="0000 0000 0000 0000"
                          value={card}
                          onChange={(e) => setCard(groupCard(e.target.value))}
                          aria-invalid={!!errors.card}
                          aria-describedby={errors.card ? "err-card" : undefined}
                        />
                        {errors.card && (
                          <span id="err-card" className="text-small text-[#ff8aa5]">
                            {errors.card}
                          </span>
                        )}
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-small text-soft">Срок</span>
                        <input
                          className="field tabular-nums"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="ММ/ГГ"
                          value={exp}
                          onChange={(e) => setExp(groupExp(e.target.value))}
                          aria-invalid={!!errors.exp}
                          aria-describedby={errors.exp ? "err-exp" : undefined}
                        />
                        {errors.exp && (
                          <span id="err-exp" className="text-small text-[#ff8aa5]">
                            {errors.exp}
                          </span>
                        )}
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-small text-soft">CVC</span>
                        <input
                          className="field tabular-nums"
                          inputMode="numeric"
                          autoComplete="off"
                          type="password"
                          placeholder="•••"
                          value={cvc}
                          onChange={(e) => setCvc(digits(e.target.value).slice(0, 3))}
                          aria-invalid={!!errors.cvc}
                          aria-describedby={errors.cvc ? "err-cvc" : undefined}
                        />
                        {errors.cvc && (
                          <span id="err-cvc" className="text-small text-[#ff8aa5]">
                            {errors.cvc}
                          </span>
                        )}
                      </label>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                      <FakeQr />
                      <p className="text-soft">
                        Отсканируйте код камерой телефона или в приложении банка и подтвердите платёж. После оплаты
                        нажмите кнопку ниже.
                      </p>
                    </div>
                  )}
                </div>
              </fieldset>

              <button type="submit" className="btn btn-neon w-full !min-h-14 text-lead" disabled={state === "paying"}>
                {state === "paying" ? (
                  <>
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Проводим платёж…
                  </>
                ) : (
                  <>
                    <Lock className="size-4" aria-hidden="true" /> {method === "card" ? `Оплатить ${rub(total)}` : "Я оплатил"}
                  </>
                )}
              </button>
            </form>

            <aside className="in-right lg:col-span-5" style={{ ["--i" as string]: 4 }}>
              <div className="sticky top-[96px] rounded-tile bg-surface p-6 shadow-[inset_0_0_0_1px_#2e2540]">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-[22px]">Заказ</h2>
                  <Link href="/cart" className="text-small text-soft underline decoration-violet underline-offset-4 hover:text-ink">
                    Изменить
                  </Link>
                </div>
                <ul className="mt-5 flex flex-col gap-2 text-soft">
                  {lines.map((l) => (
                    <li key={l.item.id} className="flex justify-between gap-4">
                      <span className="truncate">
                        {l.item.name} × {l.qty}
                      </span>
                      <span className="shrink-0 tabular-nums">{rub(l.item.price * l.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
                  <span className="font-semibold">К оплате</span>
                  <span className="neon-violet font-sans text-[30px] font-bold tabular-nums">{rub(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
