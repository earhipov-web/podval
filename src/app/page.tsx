import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gamepad2, Martini, Mic2, Sofa, Star, Users, User } from "lucide-react";
import { Contacts, SiteFooter } from "@/components/footer";
import { LiveReviews } from "@/components/live-reviews";
import { AddToCart } from "@/components/menu-card";
import { Reveal } from "@/components/reveal";
import { club, deals, itemById, rub } from "@/lib/data";

const zones = [
  {
    icon: Martini,
    title: "Бар",
    text: "Разливное пиво, медовуха, фирменные настойки и коктейли трёх уровней крепости: от лёгкого easy до hard. Садитесь за светящуюся стойку, бармен подберёт напиток под настроение.",
    photo: { src: "/photos/bar-sign.webp", alt: "Неоновая вывеска bar над полками с табаком", w: 960, h: 1280 },
    tone: "neon-ochre",
    short: "Коктейли, разливное, настойки сетом",
  },
  {
    icon: Sofa,
    title: "Гостевой зал",
    text: "Мягкие диваны, столы из цельного дерева, светильники-шишки и неон «Где родился, там и прикурился». Кальянный мастер подойдёт к столу и соберёт кальян под ваш вкус.",
    photo: { src: "/photos/hall-lamp.webp", alt: "Стол из слэба под светильником-шишкой, розовый неон на стене", w: 960, h: 1280 },
    tone: "neon-violet",
    short: "Диваны, столы из слэбов, кальянный мастер",
  },
  {
    icon: Gamepad2,
    title: "PlayStation 5",
    text: "Большой экран на стене-коллаже, диваны напротив и свежие игры: от файтингов вроде Mortal Kombat 1 до футбола. Можно зарубиться с друзьями или найти соперника за соседним столом.",
    photo: { src: "/photos/ps5.webp", alt: "Телевизор с PlayStation 5 на стене из фотографий", w: 1280, h: 853 },
    tone: "neon-blue",
    short: "Большой экран, диваны, свежие игры",
  },
  {
    icon: Mic2,
    title: "DJ-сеты и караоке",
    text: "Вечерами за пультом диджеи, а когда душа просит, можно взять микрофон и спеть любимое. Места потанцевать хватит, соседи не придут: мы в подвале.",
    photo: { src: "/photos/hall-wide.webp", alt: "Зал в розовом неоновом свете с диванами и неоном 18+", w: 1280, h: 853 },
    tone: "neon-violet",
    short: "Диджеи по вечерам и микрофон для всех",
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
          <div className="wrap grid items-center gap-5 pb-5 pt-3 lg:min-h-[min(92svh,900px)] lg:grid-cols-12 lg:gap-10 lg:py-12">
            <div className="lg:col-span-7">
              <p className="eyebrow in-left">Кальян-бар · Казань, центр</p>
              <h1 id="hero-title" className="in-left mt-2 text-h1 lg:mt-4" style={{ ["--i" as string]: 1 }}>
                Здесь <span className="neon-violet flicker">никогда</span> не&nbsp;бывает скучно
              </h1>
              <p className="in-left mt-3 max-w-[48ch] text-[15px] leading-snug text-soft lg:mt-6 lg:text-lead lg:leading-normal" style={{ ["--i" as string]: 2 }}>
                Бар, уютный зал, PlayStation 5, DJ-сеты и караоке. Заходите одни или всей компанией.
              </p>
              <div className="in-left mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 lg:mt-9" style={{ ["--i" as string]: 3 }}>
                <Link href="/booking" className="btn btn-ochre !px-3 sm:!px-[1.4em]">
                  <span className="sm:hidden">Бронь стола</span>
                  <span className="hidden sm:inline">Забронировать стол</span>
                </Link>
                <Link href="/menu" className="btn btn-ghost !px-3 sm:!px-[1.4em]">
                  Меню <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              {/* phones: three photos in one strip instead of the large collage */}
              <ul className="in-up mt-4 grid grid-cols-3 gap-1.5 lg:hidden" style={{ ["--i" as string]: 4 }}>
                {[
                  { src: "/photos/bar-sign.webp", alt: "Неоновая вывеска bar над барной стойкой" },
                  { src: "/photos/drinks.webp", alt: "Три ярких коктейля на барной стойке" },
                  { src: "/photos/ps5.webp", alt: "Зона PlayStation 5 на фоне стены-коллажа" },
                ].map((p) => (
                  <li key={p.src}>
                    <Link href="/gallery" className="relative block aspect-[3/4] overflow-hidden rounded-xl bg-surface shadow-[inset_0_0_0_1px_#2e2540]">
                      <Image src={p.src} alt={p.alt} fill priority sizes="34vw" className="object-cover" />
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="in-up mt-3 grid max-w-[620px] grid-cols-4 gap-1.5 sm:gap-2 lg:mt-12" style={{ ["--i" as string]: 5 }}>
                {[
                  { v: club.rating, l: `${club.ratings} оценки`, star: true },
                  { v: "04:00", l: "до утра в пт–сб" },
                  { v: "PS5", l: "и настолки" },
                  { v: "18+", l: "только взрослые" },
                ].map((f) => (
                  <li key={f.l} className="rounded-xl bg-surface/70 px-2 py-2 backdrop-blur-md shadow-[inset_0_0_0_1px_#2e2540] sm:rounded-2xl sm:px-4 sm:py-3">
                    <p className="flex items-center gap-1 whitespace-nowrap font-sans text-[15px] font-bold sm:text-[18px]">
                      {f.star && <Star className="size-3.5 fill-ochre text-ochre sm:size-4" aria-hidden="true" />}
                      {f.v}
                    </p>
                    <p className="text-[11px] leading-tight text-soft sm:text-small">{f.l}</p>
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
        <div className="overflow-hidden border-y border-line bg-surface/60 py-2.5 sm:py-5" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {marquee.map((w, i) => (
                  <span key={w} className="flex items-center font-display text-[clamp(16px,3vw,32px)] font-bold uppercase">
                    <span className={i % 3 === 0 ? "neon-violet" : i % 3 === 1 ? "text-ink" : "neon-ochre"}>{w}</span>
                    <span className="mx-5 text-violet sm:mx-8">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Deals ---------- */}
        <section aria-labelledby="deals-title" className="wrap section">
          <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
            <Reveal from="left">
              <p className="eyebrow">Выгодно</p>
              <h2 id="deals-title">Самые выгодные позиции</h2>
            </Reveal>
            <Reveal from="right" className="ml-auto shrink-0">
              <Link href="/menu" className="btn btn-ghost !min-h-10 !px-3 text-small sm:!min-h-12 sm:!px-[1.4em] sm:text-body">
                Всё меню <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:mt-10 sm:gap-3 lg:grid-cols-4">
            {deals.map((d, i) => {
              const item = itemById(d.id)!;
              return (
                <Reveal as="li" key={d.id} from={i < 2 ? "left" : "right"} order={i % 2}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-tile bg-surface shadow-[inset_0_0_0_1px_#2e2540] transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[inset_0_0_0_1px_rgb(255_176_59/0.6),0_24px_60px_-24px_rgb(255_160_40/0.5)]">
                    <div className="relative aspect-[16/11] overflow-hidden bg-grey sm:aspect-[4/3]">
                      {item.img ? (
                        <Image src={item.img} alt={item.name} fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_40%,#3b1468,#110c19_70%)]">
                          <span className="neon-violet font-display text-[clamp(30px,9vw,44px)]">{item.tag ?? item.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-3 sm:gap-2 sm:p-5">
                      <h3 className="text-[15px] leading-snug sm:text-[19px]">{d.title}</h3>
                      <p className="hidden text-small text-soft sm:block">{d.why}</p>
                      <div className="mt-auto flex flex-col gap-2 pt-1 sm:gap-3 sm:pt-4">
                        <p className="flex flex-wrap items-baseline gap-x-2 whitespace-nowrap">
                          <span className="font-sans text-[20px] font-bold tabular-nums sm:text-[26px]">{rub(item.price)}</span>
                          <s className="text-[13px] text-soft tabular-nums sm:text-body">{rub(d.was)}</s>
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
          <Reveal as="h2" from="left" id="zones-title" className="max-w-[760px]">
            Четыре причины спуститься в подвал
          </Reveal>

          {/* phones: the four zones as a 2 × 2 grid of photo tiles */}
          <ul className="mt-4 grid grid-cols-2 gap-2 lg:hidden">
            {zones.map((z, i) => (
              <Reveal as="li" key={z.title} from={i % 2 ? "right" : "left"} order={i % 2}>
                <article className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface shadow-[inset_0_0_0_1px_#2e2540]">
                  <Image src={z.photo.src} alt={z.photo.alt} fill sizes="50vw" className="object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgb(7_5_11/0.92)_88%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <h3 className={`flex items-center gap-1.5 font-display text-[clamp(13px,3.8vw,18px)] font-bold leading-tight tracking-[-0.02em] ${z.tone}`}>
                      <z.icon className="size-4 shrink-0 text-ink" aria-hidden="true" />
                      {z.title}
                    </h3>
                    <p className="mt-1 text-[12.5px] leading-snug text-[#e4dcef]">{z.short}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>

          {/* wide screens: photo and text side by side, alternating */}
          <div className="mt-14 hidden flex-col gap-[clamp(56px,8vw,112px)] lg:flex">
            {zones.map((z, i) => {
              const flip = i % 2 === 1;
              return (
                <article key={z.title} className="grid grid-cols-12 items-center gap-14">
                  <Reveal from={flip ? "right" : "left"} className={`frame relative col-span-7 aspect-[4/3] ${flip ? "order-2" : ""}`}>
                    <Image src={z.photo.src} alt={z.photo.alt} fill sizes="680px" className="object-cover" />
                  </Reveal>
                  <Reveal from={flip ? "left" : "right"} order={1} className={`col-span-5 ${flip ? "order-1" : ""}`}>
                    <span className="grid size-14 place-items-center rounded-2xl bg-surface-2 text-violet shadow-[inset_0_0_0_1px_#2e2540]">
                      <z.icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className={`mt-5 font-display text-[clamp(28px,3vw,40px)] ${z.tone}`}>{z.title}</h3>
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
          <div className="mt-4 grid gap-2 sm:mt-10 sm:gap-3 md:grid-cols-2">
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
                className="relative overflow-hidden rounded-tile bg-surface p-4 shadow-[inset_0_0_0_1px_#2e2540] sm:p-6 md:p-8"
              >
                <div aria-hidden="true" className="absolute -right-20 -top-20 size-64 rounded-full blur-3xl" style={{ background: c.glow }} />
                <h3 className="relative flex items-center gap-2 font-display text-[17px] sm:text-[26px]">
                  <c.icon className="size-5 text-violet sm:size-7" aria-hidden="true" />
                  {c.title}
                </h3>
                <ul className="relative mt-2.5 flex flex-col gap-1.5 text-[14px] sm:mt-5 sm:gap-3 sm:text-body">
                  {c.items.map((t) => (
                    <li key={t} className="flex gap-2.5 text-soft sm:gap-3">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-ochre shadow-[0_0_8px_#ffb03b] sm:mt-2.5" />
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
          <LiveReviews />
        </section>

        <Contacts />
      </main>
      <SiteFooter />
    </>
  );
}
