import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Dices, Gamepad2, Mic2, PlugZap, Wifi, Wine, Flame } from "lucide-react";
import { Contacts, SiteFooter } from "@/components/footer";
import { PageHead } from "@/components/page-head";
import { Reveal } from "@/components/reveal";
import { club, hh, hours } from "@/lib/data";

export const metadata: Metadata = {
  title: "О заведении",
  description: "PODVAL — кальян-бар в центре Казани на ул. Габдуллы Тукая: история, залы, что есть внутри и часы работы.",
};

const perks = [
  { icon: Flame, title: "Кальяны", text: "Мастера подбирают табак под вкус, от лёгких фруктовых до плотных." },
  { icon: Wine, title: "Бар", text: "Коктейли easy, medium и hard, разливное пиво, настойки сетом." },
  { icon: Gamepad2, title: "PlayStation 5", text: "Большой экран, диваны напротив и свежие игры." },
  { icon: Mic2, title: "DJ и караоке", text: "Сеты по вечерам и микрофон для тех, кто хочет спеть." },
  { icon: Dices, title: "Настольные игры", text: "Полка игр для компании любого размера." },
  { icon: BookOpen, title: "Книги", text: "Стеллаж в лаунже: можно читать под кальян." },
  { icon: Wifi, title: "Wi-Fi", text: "Есть в зале, пароль подскажет официант." },
  { icon: PlugZap, title: "Зарядка", text: "Поможем зарядить телефон, пока вы отдыхаете." },
];

export default function AboutPage() {
  return (
    <>
      <PageHead
        eyebrow="О заведении"
        title={
          <>
            Подвал, где <span className="neon-violet">светло</span>
          </>
        }
        lead={
          <p>
            PODVAL — кальян-бар в самом центре Казани, на {club.address}. Спускайтесь по лестнице и попадайте к нам.
          </p>
        }
        photo={{ src: "/photos/bar-wide.webp", alt: "Барная стойка с подсветкой и оранжевым неоном bar" }}
      >
        <Link href="/booking" className="btn btn-ochre">
          Забронировать стол
        </Link>
        <Link href="/gallery" className="btn btn-ghost">
          Смотреть фото
        </Link>
      </PageHead>

      <main>
        {/* ---------- Story ---------- */}
        <section aria-labelledby="story-title" className="wrap section">
          <div className="grid items-center gap-3 sm:gap-10 lg:grid-cols-12">
            <Reveal from="left" className="lg:col-span-6">
              <p className="eyebrow">Кто мы</p>
              <h2 id="story-title">
                Место, куда хочется вернуться
              </h2>
              <div className="mt-2 flex flex-col gap-2 text-[15px] leading-snug text-soft sm:mt-6 sm:gap-4 sm:text-lead sm:leading-normal">
                <p>
                  Мы сделали подвал, в котором не бывает одинаковых вечеров. Сегодня здесь тихо курят кальян и читают книгу
                  с полки, завтра рубятся в Mortal Kombat на PS5, а в пятницу танцуют под DJ до четырёх утра.
                </p>
                <p>
                  Гости ставят нам {club.rating} из 5 на Яндекс Картах и чаще всего хвалят атмосферу, кальянных мастеров и
                  то, что можно прийти и одному, и большой компанией.
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-2 sm:gap-3 lg:col-span-6">
              <Reveal from="right" className="frame relative aspect-[3/4] sm:row-span-2 sm:aspect-auto">
                <Image src="/photos/hall-lamp.webp" alt="Светильник-шишка над столом из слэба" fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover" />
              </Reveal>
              <Reveal from="right" order={1} className="frame relative aspect-[3/4] sm:aspect-square">
                <Image src="/photos/lounge-chains.webp" alt="Лаунж с книжным стеллажом и занавесом из цепей" fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover" />
              </Reveal>
              <Reveal from="right" order={2} className="frame relative aspect-[3/4] sm:aspect-square">
                <Image src="/photos/retro-wall.webp" alt="Стена из постеров и два дивана" fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover" />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- Numbers ---------- */}
        <section aria-label="PODVAL в цифрах" className="wrap section">
          <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {[
              { v: club.rating, l: "рейтинг на Яндекс Картах", c: "neon-ochre" },
              { v: "100%", l: "гостей хвалят атмосферу", c: "neon-violet" },
              { v: "04:00", l: "закрываемся в пт и сб", c: "neon-blue" },
              { v: "75+", l: "позиций в меню", c: "neon-violet" },
            ].map((n, i) => (
              <Reveal as="li" key={n.l} from={i < 2 ? "left" : "right"} order={i % 2} className="rounded-tile bg-surface p-3.5 shadow-[inset_0_0_0_1px_#1f1830] sm:p-6">
                <p className={`font-sans text-[clamp(32px,4vw,52px)] font-bold ${n.c}`}>{n.v}</p>
                <p className="mt-1 text-[13px] leading-snug text-soft sm:mt-2 sm:text-body">{n.l}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* ---------- Perks ---------- */}
        <section aria-labelledby="perks-title" className="wrap section">
          <Reveal as="p" from="left" className="eyebrow">
            Внутри
          </Reveal>
          <Reveal as="h2" from="left" order={1} id="perks-title">
            Что вас ждёт в подвале
          </Reveal>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:mt-10 sm:gap-3 lg:grid-cols-4">
            {perks.map((p, i) => (
              <Reveal
                as="li"
                key={p.title}
                from={i % 4 < 2 ? "left" : "right"}
                order={i % 4}
                className="group rounded-tile bg-surface p-3.5 sm:p-6 shadow-[inset_0_0_0_1px_#1f1830] transition-[box-shadow] duration-500 hover:shadow-[inset_0_0_0_1px_rgb(180_92_255/0.55),0_0_40px_-10px_rgb(180_92_255/0.5)]"
              >
                <span className="grid size-10 place-items-center rounded-xl sm:size-12 sm:rounded-2xl bg-surface-2 text-violet transition-transform duration-500 group-hover:scale-110">
                  <p.icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-2.5 text-[16px] sm:mt-5 sm:text-h3">{p.title}</h3>
                <p className="mt-1 text-[12.5px] leading-snug text-soft sm:text-small">{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* ---------- Hours ---------- */}
        <section aria-labelledby="hours-title" className="wrap section">
          <div className="grid gap-3 lg:grid-cols-12">
            <Reveal from="left" className="relative overflow-hidden rounded-tile bg-surface p-[clamp(16px,4vw,48px)] shadow-[inset_0_0_0_1px_#2e2540] lg:col-span-7">
              <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full bg-ochre/20 blur-3xl" />
              <p className="eyebrow relative !text-ochre">Часы работы</p>
              <h2 id="hours-title" className="relative">
                Открываемся вечером
              </h2>
              <dl className="relative mt-4 flex flex-col gap-3 sm:mt-8 sm:gap-4">
                {hours.map((h) => (
                  <div key={h.days} className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                    <dt className="text-soft sm:text-lead">{h.days}</dt>
                    <dd className="neon-ochre font-sans text-[clamp(22px,3vw,34px)] font-bold tabular-nums">
                      {hh(h.from)}–{hh(h.to)}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="relative mt-3 text-[13px] text-soft sm:mt-5 sm:text-small">В праздничные дни график может меняться, уточняйте по телефону {club.phone}.</p>
            </Reveal>
            <Reveal from="right" className="frame relative min-h-[170px] sm:min-h-[320px] lg:col-span-5">
              <Image src="/photos/ps5.webp" alt="Зона PlayStation 5 на фоне стены-коллажа" fill sizes="(min-width: 1024px) 500px, 100vw" className="object-cover" />
            </Reveal>
          </div>
        </section>

        <Contacts />
      </main>
      <SiteFooter />
    </>
  );
}
