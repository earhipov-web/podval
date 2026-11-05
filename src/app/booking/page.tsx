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
          <div className="mb-3 flex flex-col gap-2 sm:mb-8 sm:gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <Reveal as="h2" from="left" id="booking-title">
              Бронь стола
            </Reveal>
            <ol className="grid grid-cols-3 gap-2 sm:gap-3 lg:max-w-[740px]">
              {steps.map((s, i) => (
                <Reveal as="li" key={s.title} from="right" order={i} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                  <span className="grid size-6 text-[12px] sm:size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-small font-bold text-violet shadow-[inset_0_0_0_1px_#2e2540]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[12.5px] font-semibold leading-snug sm:text-body">{s.title}</p>
                    <p className="hidden text-small text-soft sm:block">{s.text}</p>
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
          <ul className="mt-3 grid gap-2 sm:mt-8 sm:gap-3 md:grid-cols-3">
            {notes.map((r, i) => (
              <Reveal as="li" key={r.title} from={i === 0 ? "left" : i === 2 ? "right" : "up"} className="flex gap-3 rounded-tile bg-surface p-3.5 shadow-[inset_0_0_0_1px_#1f1830] sm:block sm:p-6">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-violet sm:size-11">
                  <r.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[16px] sm:mt-4 sm:text-h3">{r.title}</h3>
                  <p className="mt-0.5 text-[13px] leading-snug text-soft sm:mt-1 sm:text-small">{r.text}</p>
                </div>
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
