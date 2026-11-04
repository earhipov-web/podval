import type { Metadata } from "next";
import { Clock3, PhoneCall, Users } from "lucide-react";
import { Booking } from "@/components/booking";
import { Contacts, SiteFooter } from "@/components/footer";
import { PageHead } from "@/components/page-head";
import { Reveal } from "@/components/reveal";
import { club } from "@/lib/data";

export const metadata: Metadata = {
  title: "Бронь стола",
  description: "Онлайн-бронь стола в кальян-баре PODVAL: место у бара, столы, лаунж за цепями и зона PlayStation 5.",
};

const steps = [
  { title: "Выберите день и время", text: "Час начала, сколько часов и сколько вас." },
  { title: "Нажмите на стол", text: "Схема показывает, что свободно в эти часы." },
  { title: "Оставьте имя и телефон", text: "Получите код брони для администратора." },
];

const notes = [
  { icon: Clock3, title: "Держим 15 минут", text: "После начала брони стол ждёт вас четверть часа, потом уходит в свободные." },
  { icon: Users, title: "Большой компанией", text: "Лаунж за цепями вмещает до 10 человек. Для закрытой вечеринки позвоните нам." },
  { icon: PhoneCall, title: "Отмена звонком", text: `Позвоните ${club.phone} или напишите в WhatsApp, отменим бронь.` },
];

export default function BookingPage() {
  return (
    <>
      <PageHead
        eyebrow="Бронь"
        title={
          <>
            Стол за вами <span className="neon-violet">за минуту</span>
          </>
        }
        lead={<p>Выберите день, время и конкретный стол на схеме зала: у бара, в гостевом зале, в лаунже или у PlayStation 5. Бронь открыта на 30 дней вперёд.</p>}
        photo={{ src: "/photos/hall-bar.webp", alt: "Стол из слэба и диваны, вдали бар с неоновой вывеской", position: "50% 65%" }}
      />
      <main>
        <section id="booking" aria-labelledby="booking-title" className="wrap section scroll-mt-20">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <Reveal as="h2" from="left" id="booking-title">
              Бронь стола
            </Reveal>
            <ol className="grid gap-3 sm:grid-cols-3 lg:max-w-[740px]">
              {steps.map((s, i) => (
                <Reveal as="li" key={s.title} from="right" order={i} className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-small font-bold text-violet shadow-[inset_0_0_0_1px_#2e2540]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-small text-soft">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
          <Booking />
        </section>

        <section aria-labelledby="notes-title" className="wrap section">
          <Reveal as="h2" from="left" id="notes-title">
            Что важно знать
          </Reveal>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {notes.map((r, i) => (
              <Reveal as="li" key={r.title} from={i === 0 ? "left" : i === 2 ? "right" : "up"} className="rounded-tile bg-surface p-6 shadow-[inset_0_0_0_1px_#1f1830]">
                <span className="grid size-11 place-items-center rounded-full bg-surface-2 text-violet">
                  <r.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4">{r.title}</h3>
                <p className="mt-1 text-small text-soft">{r.text}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        <Contacts withMap={false} />
      </main>
      <SiteFooter />
    </>
  );
}
