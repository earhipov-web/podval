import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gamepad2, Martini, Mic2, Sofa, Star, Users, User } from "lucide-react";
import { Contacts, SiteFooter } from "@/components/footer";
import { AddToCart } from "@/components/menu-card";
import { Reveal } from "@/components/reveal";
import { club, deals, itemById, reviews, rub } from "@/lib/data";

const zones = [
  {
    icon: Martini,
    title: "Бар",
    text: "Разливное пиво, медовуха, фирменные настойки и коктейли трёх уровней крепости: от лёгкого easy до hard. Садитесь за светящуюся стойку, бармен подберёт напиток под настроение.",
    photo: { src: "/photos/bar-sign.webp", alt: "Неоновая вывеска bar над полками с табаком", w: 960, h: 1280 },
    tone: "neon-ochre",
  },
  {
    icon: Sofa,
    title: "Гостевой зал",
    text: "Мягкие диваны, столы из цельного дерева, светильники-шишки и неон «Где родился, там и прикурился». Кальянный мастер подойдёт к столу и соберёт кальян под ваш вкус.",
    photo: { src: "/photos/hall-lamp.webp", alt: "Стол из слэба под светильником-шишкой, розовый неон на стене", w: 960, h: 1280 },
    tone: "neon-violet",
  },
  {
    icon: Gamepad2,
    title: "PlayStation 5",
    text: "Большой экран на стене-коллаже, диваны напротив и свежие игры: от файтингов вроде Mortal Kombat 1 до футбола. Можно зарубиться с друзьями или найти соперника за соседним столом.",
    photo: { src: "/photos/ps5.webp", alt: "Телевизор с PlayStation 5 на стене из фотографий", w: 1280, h: 853 },
    tone: "neon-blue",
  },
  {
    icon: Mic2,
    title: "DJ-сеты и караоке",
    text: "Вечерами за пультом диджеи, а когда душа просит, можно взять микрофон и спеть любимое. Места потанцевать хватит, соседи не придут: мы в подвале.",
    photo: { src: "/photos/hall-wide.webp", alt: "Зал в розовом неоновом свете с диванами и неоном 18+", w: 1280, h: 853 },
    tone: "neon-violet",
  },
];

const marquee = ["Кальяны", "Бар", "PlayStation 5", "DJ-сеты", "Караоке", "Настольные игры", "Коктейли", "До 04:00"];

export default function Home() {
  return (
    <>
      <main>
        {/* ---------- Hero ---------- */}
        <section aria-labelledby="hero-title" className="relative -mt-[72px] overflow-hidden pt-[72px]">
          <div className="absolute inset-0 -z-10">
            <Image src="/photos/hall-wide.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-60 lg:opacity-45" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_5_11/0.35)_0%,rgb(7_5_11/0.8)_45%,#07050b_90%)] lg:bg-[linear-gradient(90deg,#07050b_8%,rgb(7_5_11/0.75)_45%,rgb(7_5_11/0.3)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ground to-transparent" />
          </div>
          <div className="wrap grid min-h-[min(92svh,900px)] items-center gap-10 py-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow in-left">Кальян-бар · Казань, центр</p>
              <h1 id="hero-title" className="in-left mt-5 text-h1" style={{ ["--i" as string]: 1 }}>
                Здесь <span className="neon-violet flicker">никогда</span> не&nbsp;бывает скучно
              </h1>
              <p className="lead in-left mt-6 max-w-[48ch] text-soft" style={{ ["--i" as string]: 2 }}>
                Бар с неоновой вывеской, уютный гостевой зал, PlayStation 5, DJ-сеты и караоке. Заходите одни или
                всей компанией: занятие найдётся каждому.
              </p>
              <div className="in-left mt-9 flex flex-wrap gap-3" style={{ ["--i" as string]: 3 }}>
                <Link href="/booking" className="btn btn-ochre">
                  Забронировать стол
                </Link>
                <Link href="/menu" className="btn btn-ghost">
                  Смотреть меню <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
              <ul className="in-up mt-12 grid max-w-[620px] grid-cols-2 gap-2 sm:grid-cols-4" style={{ ["--i" as string]: 4 }}>
                {[
                  { v: club.rating, l: `${club.ratings} оценки`, star: true },
                  { v: "до 04:00", l: "в пт и сб" },
                  { v: "PS5", l: "и настолки" },
                  { v: "18+", l: "только взрослые" },
                ].map((f) => (
                  <li key={f.l} className="rounded-2xl bg-surface/70 px-4 py-3 backdrop-blur-md shadow-[inset_0_0_0_1px_#2e2540]">
                    <p className="flex items-center gap-1.5 whitespace-nowrap font-display text-[18px] font-bold">
                      {f.star && <Star className="size-4 fill-ochre text-ochre" aria-hidden="true" />}
                      {f.v}
                    </p>
                    <p className="text-small text-soft">{f.l}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative hidden h-[560px] lg:col-span-5 lg:block">
              <div className="frame in-right absolute right-0 top-0 h-[400px] w-[78%]" style={{ ["--i" as string]: 1 }}>
                <Image src="/photos/bar-sign.webp" alt="Неоновая вывеска bar над барной стойкой" fill priority sizes="380px" className="object-cover" />
              </div>
              <div className="frame in-right absolute bottom-0 left-0 h-[250px] w-[62%] shadow-[0_30px_60px_rgb(0_0_0/0.6)]" style={{ ["--i" as string]: 3 }}>
                <Image src="/photos/drinks.webp" alt="Три ярких коктейля на барной стойке" fill sizes="300px" className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Marquee ---------- */}
        <div className="overflow-hidden border-y border-line bg-surface/60 py-5" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {marquee.map((w, i) => (
                  <span key={w} className="flex items-center font-display text-[clamp(20px,3vw,32px)] font-bold uppercase">
                    <span className={i % 3 === 0 ? "neon-violet" : i % 3 === 1 ? "text-ink" : "neon-ochre"}>{w}</span>
                    <span className="mx-8 text-violet">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Deals ---------- */}
        <section aria-labelledby="deals-title" className="wrap section">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal as="p" from="left" className="eyebrow">
                Выгодно
              </Reveal>
              <Reveal as="h2" from="left" order={1} id="deals-title" className="mt-3 max-w-[20ch]">
                Самые выгодные позиции меню
              </Reveal>
            </div>
            <Reveal from="right">
              <Link href="/menu" className="btn btn-ghost">
                Всё меню <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((d, i) => {
              const item = itemById(d.id)!;
              return (
                <Reveal as="li" key={d.id} from={i < 2 ? "left" : "right"} order={i % 2}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-tile bg-surface shadow-[inset_0_0_0_1px_#2e2540] transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgb(255_176_59/0.6),0_24px_60px_-24px_rgb(255_160_40/0.5)]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-grey">
                      {item.img ? (
                        <Image src={item.img} alt={item.name} fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_40%,#3b1468,#110c19_70%)]">
                          <span className="neon-violet font-display text-[44px] font-bold">{item.tag ?? item.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <h3 className="text-[19px]">{d.title}</h3>
                      <p className="text-small text-soft">{d.why}</p>
                      <div className="mt-auto flex flex-col gap-3 pt-4">
                        <p className="flex items-baseline gap-3 whitespace-nowrap">
                          <span className="font-display text-[26px] font-bold tabular-nums">{rub(item.price)}</span>
                          <s className="text-soft tabular-nums">{rub(d.was)}</s>
                        </p>
                        <div className="[&>*]:w-full [&>div]:justify-between">
                          <AddToCart item={item} wide />
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </section>

        {/* ---------- Zones ---------- */}
        <section aria-labelledby="zones-title" className="wrap section">
          <div className="max-w-[760px]">
            <Reveal as="p" from="left" className="eyebrow">
              Что у нас есть
            </Reveal>
            <Reveal as="h2" from="left" order={1} id="zones-title" className="mt-3">
              Четыре причины спуститься в подвал
            </Reveal>
          </div>
          <div className="mt-14 flex flex-col gap-[clamp(56px,8vw,112px)]">
            {zones.map((z, i) => {
              const flip = i % 2 === 1;
              return (
                <article key={z.title} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                  <Reveal
                    from={flip ? "right" : "left"}
                    className={`frame relative aspect-[4/3] lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
                  >
                    <Image src={z.photo.src} alt={z.photo.alt} fill sizes="(min-width: 1024px) 680px, 100vw" className="object-cover" />
                  </Reveal>
                  <Reveal from={flip ? "left" : "right"} order={1} className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                    <span className="grid size-14 place-items-center rounded-2xl bg-surface-2 text-violet shadow-[inset_0_0_0_1px_#2e2540]">
                      <z.icon className="size-6" aria-hidden="true" />
                    </span>
                    <p className="mt-6 font-display text-[14px] font-bold text-soft">0{i + 1}</p>
                    <h3 className={`mt-2 font-display text-[clamp(28px,3vw,40px)] ${z.tone}`}>{z.title}</h3>
                    <p className="lead mt-4 text-soft">{z.text}</p>
                  </Reveal>
                </article>
              );
            })}
          </div>
        </section>

        {/* ---------- Alone or together ---------- */}
        <section aria-labelledby="company-title" className="wrap section">
          <Reveal as="h2" from="left" id="company-title" className="max-w-[18ch]">
            Один или с друзьями — скучно не будет
          </Reveal>
          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {[
              {
                icon: User,
                title: "Пришёл один",
                items: ["Падай за бар и болтай с барменом", "Бери кальян и книжку с полки в лаунже", "Зарубись на PS5 с ребятами из зала", "Спой в караоке или просто кайфуй под DJ"],
                from: "left" as const,
                glow: "rgb(79 139 255 / 0.25)",
              },
              {
                icon: Users,
                title: "Пришёл с компанией",
                items: ["Занимай большой стол или лаунж за цепями", "Бери сет из 10 настоек и пару кальянов на всех", "Устрой турнир на PlayStation 5", "Пой и танцуй до утра по выходным"],
                from: "right" as const,
                glow: "rgb(180 92 255 / 0.3)",
              },
            ].map((c) => (
              <Reveal
                key={c.title}
                from={c.from}
                className="relative overflow-hidden rounded-tile bg-surface p-6 shadow-[inset_0_0_0_1px_#2e2540] md:p-8"
              >
                <div aria-hidden="true" className="absolute -right-20 -top-20 size-64 rounded-full blur-3xl" style={{ background: c.glow }} />
                <c.icon className="relative size-7 text-violet" aria-hidden="true" />
                <h3 className="relative mt-5 font-display text-[26px]">{c.title}</h3>
                <ul className="relative mt-5 flex flex-col gap-3">
                  {c.items.map((t) => (
                    <li key={t} className="flex gap-3 text-soft">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ochre shadow-[0_0_8px_#ffb03b]" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- Reviews ---------- */}
        <section aria-labelledby="reviews-title" className="section">
          <div className="wrap grid gap-8 lg:grid-cols-12">
            <Reveal from="left" className="lg:col-span-4">
              <p className="eyebrow">Отзывы</p>
              <h2 id="reviews-title" className="mt-3">
                Что говорят гости
              </h2>
              <div className="mt-8 rounded-tile bg-surface p-6 shadow-[inset_0_0_0_1px_#2e2540]">
                <p className="flex items-center gap-3">
                  <span className="neon-ochre font-display text-[56px] font-bold leading-none">{club.rating}</span>
                  <span className="flex gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-5 fill-ochre text-ochre" />
                    ))}
                  </span>
                </p>
                <p className="mt-3 text-soft">
                  {club.ratings} оценки и {club.reviews} отзывов на Яндекс Картах. Атмосферу хвалят 100% гостей.
                </p>
                <a href={club.yandexReviews} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 w-full">
                  Все отзывы на Яндекс Картах
                </a>
              </div>
            </Reveal>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
              {reviews.slice(0, 6).map((r, i) => (
                <Reveal
                  as="li"
                  key={r.name}
                  from={i % 2 ? "right" : "up"}
                  order={i % 2}
                  className="flex flex-col gap-4 rounded-tile bg-surface p-5 shadow-[inset_0_0_0_1px_#1f1830]"
                >
                  <span className="flex gap-0.5" role="img" aria-label="5 из 5">
                    {Array.from({ length: 5 }, (_, k) => (
                      <Star key={k} className="size-4 fill-violet text-violet" aria-hidden="true" />
                    ))}
                  </span>
                  <blockquote className="flex-1 text-[15px] leading-relaxed">«{r.text}»</blockquote>
                  <p className="flex items-center gap-3 text-small">
                    <span className="grid size-9 place-items-center rounded-full bg-violet-deep font-semibold text-ink">{r.name[0]}</span>
                    <span>
                      <span className="block font-semibold">{r.name}</span>
                      <span className="text-soft">{r.date}</span>
                    </span>
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <Contacts />
      </main>
      <SiteFooter />
    </>
  );
}
