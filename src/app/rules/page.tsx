import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { SiteFooter } from "@/components/footer";
import { PageHead } from "@/components/page-head";
import { Reveal } from "@/components/reveal";
import { fees, rub } from "@/lib/data";

export const metadata: Metadata = {
  title: "Правила",
  description: "Правила кальян-бара PODVAL: возраст 18+, пробковый сбор, компенсации за посуду и мебель.",
};

const rules: { name: string; note: string; tag: string }[] = [
  { name: "Только 18+", note: "Вход и обслуживание только для совершеннолетних. Возьмите паспорт: администратор может попросить его показать.", tag: "вход" },
  { name: "Своя еда и напитки", note: "Можно приносить. За алкоголь со своим берётся пробковый сбор, он указан ниже.", tag: "со своим" },
  { name: "Бронь держим 15 минут", note: "Если задерживаетесь, позвоните, и мы придержим стол.", tag: "бронь" },
  { name: "Оплата", note: "Наличными, переводом или онлайн на сайте через корзину.", tag: "расчёт" },
  { name: "Уважение к гостям и персоналу", note: "Громкие конфликты и грубость к официантам и кальянщикам — повод попрощаться.", tag: "атмосфера" },
  { name: "PlayStation 5 и караоке", note: "Пульт и микрофон по очереди, если желающих много. Просто попросите администратора.", tag: "развлечения" },
];

export default function RulesPage() {
  return (
    <>
      <PageHead
        eyebrow="Правила"
        title={
          <>
            Правила <span className="neon-ochre">подвала</span>
          </>
        }
        lead={<p>Коротко о том, как у нас всё устроено, чтобы вечер прошёл легко для всех. Сборы и компенсации описаны так же, как в меню.</p>}
        photo={{ src: "/photos/hall-lamp.webp", alt: "Розовый неон «Где родился, там и прикурился» и неон 18+", position: "50% 35%" }}
      />
      <main>
        <section className="wrap section" aria-labelledby="refuse-title">
          <Reveal
            from="zoom"
            className="relative overflow-hidden rounded-tile bg-[linear-gradient(120deg,#2a0d1d,#1b1028_60%)] p-[clamp(24px,4vw,48px)] shadow-[inset_0_0_0_2px_#ff5c8a,0_0_60px_rgb(255_92_138/0.25)]"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
              <ShieldAlert className="size-12 shrink-0 text-[#ff8aa5] drop-shadow-[0_0_12px_#ff5c8a]" aria-hidden="true" />
              <div>
                <p className="eyebrow !text-[#ff8aa5]">Важно</p>
                <h2 id="refuse-title" className="mt-2 text-[clamp(22px,2.4vw,32px)]">
                  Администрация оставляет за собой право отказать в обслуживании лицам в состоянии алкогольного или
                  наркотического опьянения.
                </h2>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="wrap section" aria-labelledby="rules-title">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <Reveal as="h2" from="left" id="rules-title">
              Как у нас принято
            </Reveal>
            <Reveal as="p" from="right" className="text-soft">
              Шесть простых пунктов
            </Reveal>
          </div>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {rules.map((r, i) => (
              <Reveal as="li" key={r.name} from={i % 2 ? "right" : "left"} order={Math.floor(i / 2) % 2} className="flex h-full flex-col gap-2 rounded-tile bg-surface p-5 shadow-[inset_0_0_0_1px_#1f1830]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-violet">{r.tag}</p>
                <h3 className="text-[19px]">{r.name}</h3>
                <p className="text-small text-soft">{r.note}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="wrap section" aria-labelledby="fees-title">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <Reveal as="h2" from="left" id="fees-title">
              Сборы и компенсации
            </Reveal>
            <Reveal as="p" from="right" className="max-w-[46ch] text-soft">
              Раньше эти строки были в разделе меню «Прочее». Надеемся, они вам не пригодятся.
            </Reveal>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fees.map((f, i) => (
              <Reveal as="li" key={f.name} from={i % 3 === 0 ? "left" : i % 3 === 2 ? "right" : "up"} order={i % 3}>
                <article className="flex h-full flex-col gap-2 rounded-tile bg-surface p-5 shadow-[inset_0_0_0_1px_#1f1830] transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgb(255_176_59/0.5)]">
                  <h3 className="text-[18px] leading-snug">{f.name}</h3>
                  {f.note && <p className="text-small text-soft">{f.note}</p>}
                  <p className="mt-auto pt-3 font-display text-[22px] font-bold tabular-nums">
                    <span className="neon-ochre">{rub(f.price)}</span>
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
