import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { club, hh, hours, navLinks as links } from "@/lib/data";
import { Reveal } from "./reveal";

/** Address, phone, hours and the map: on the home page and at the foot of every page. */
export function Contacts({ withMap = true }: { withMap?: boolean }) {
  return (
    <section id="contacts" aria-labelledby="contacts-title" className="wrap section scroll-mt-20">
      <div className="grid gap-[var(--gutter)] lg:grid-cols-12">
        <div className={`flex flex-col gap-6 ${withMap ? "lg:col-span-5" : "lg:col-span-12"}`}>
          <Reveal from="left">
            <p className="eyebrow">Контакты</p>
            <h2 id="contacts-title" className="mt-3">
              Спускайтесь в <span className="neon-violet">подвал</span>
            </h2>
          </Reveal>
          <Reveal as="ul" from="left" order={1} className={withMap ? "flex flex-col gap-2" : "grid gap-2 md:grid-cols-3"}>
            <li className="flex gap-4 rounded-tile bg-surface p-5">
              <MapPin className="mt-0.5 size-5 shrink-0 text-violet" aria-hidden="true" />
              <div>
                <p className="font-semibold">{club.addressFull}</p>
                <a href={club.googleRoute} target="_blank" rel="noopener noreferrer" className="text-small text-soft underline decoration-violet underline-offset-4 hover:text-ink">
                  Построить маршрут в Google Картах
                </a>
              </div>
            </li>
            <li className="flex gap-4 rounded-tile bg-surface p-5">
              <Clock className="mt-0.5 size-5 shrink-0 text-ochre" aria-hidden="true" />
              <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
                {hours.map((h) => (
                  <div key={h.days} className="contents">
                    <dt className="text-soft">{h.days}</dt>
                    <dd className="font-semibold tabular-nums">
                      {hh(h.from)}–{hh(h.to)}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
            <li className="flex gap-4 rounded-tile bg-surface p-5">
              <Phone className="mt-0.5 size-5 shrink-0 text-blue" aria-hidden="true" />
              <div className="flex flex-col gap-3">
                <a href={club.phoneHref} className="text-lead font-semibold tabular-nums hover:text-violet">
                  {club.phone}
                </a>
                <div className="flex flex-wrap gap-2">
                  <a href={club.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-10 text-small">
                    <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
                  </a>
                  <a href={club.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-10 text-small">
                    <Send className="size-4" aria-hidden="true" /> {club.telegramName}
                  </a>
                </div>
              </div>
            </li>
          </Reveal>
        </div>
        {withMap && (
          <Reveal from="right" order={1} className="frame min-h-[360px] lg:col-span-7">
            {/* shows while the map loads, or if a browser blocks the map frame */}
            <a
              href={club.googleMap}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_45%,#2a1150,#110c19_70%)] p-6 text-center"
            >
              <MapPin className="size-10 text-violet drop-shadow-[0_0_12px_#b45cff]" aria-hidden="true" />
              <span className="font-semibold">{club.addressFull}</span>
              <span className="text-small text-soft underline decoration-violet underline-offset-4">Открыть в Google Картах</span>
            </a>
            <iframe
              src={club.mapWidget}
              title={`PODVAL на карте: ${club.addressFull}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0 [filter:invert(0.92)_hue-rotate(200deg)_saturate(0.7)_brightness(0.9)]"
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-[var(--section)] border-t border-line bg-surface/40">
      <div className="wrap grid gap-8 py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Image src="/logo.png" alt="PODVAL" width={441} height={176} className="h-12 w-auto" />
          <p className="mt-4 max-w-[38ch] text-small text-soft">
            {club.kind} в центре Казани: кальяны, бар, PlayStation 5, DJ-сеты и караоке. Только для гостей старше 18 лет.
          </p>
        </div>
        <nav aria-label="Разделы сайта" className="md:col-span-3">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-small md:grid-cols-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-soft transition-colors hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-2 text-small md:col-span-4">
          <a href={club.phoneHref} className="font-semibold hover:text-violet">
            {club.phone}
          </a>
          <p className="text-soft">{club.addressFull}</p>
          <p className="mt-4 text-[13px] text-soft/70">
            Чрезмерное употребление алкоголя и курение вредят вашему здоровью. © {new Date().getFullYear()} PODVAL
          </p>
        </div>
      </div>
    </footer>
  );
}
