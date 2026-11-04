"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { club, hh, openHours } from "@/lib/data";
import { Keycap, KeyLegend } from "./keycap";
import { Reveal } from "./reveal";

// ---------- the hall plan ----------
// Coordinates are percent of the plan box, which is 100 × 68 units (see .plan in globals.css).

type Spot = {
  id: string;
  name: string;
  short: string;
  seats: number;
  kind: "bar" | "table" | "lounge" | "ps5";
  x: number;
  y: number;
  w: number;
  h: number;
};

const H = 68;
const spots: Spot[] = [
  { id: "b1", name: "Бар, места 1–2", short: "Б1", seats: 2, kind: "bar", x: 4, y: 13.5, w: 11.5, h: 7 },
  { id: "b2", name: "Бар, места 3–4", short: "Б2", seats: 2, kind: "bar", x: 17.5, y: 13.5, w: 11.5, h: 7 },
  { id: "b3", name: "Бар, места 5–6", short: "Б3", seats: 2, kind: "bar", x: 31, y: 13.5, w: 11.5, h: 7 },
  { id: "t1", name: "Стол 1", short: "1", seats: 4, kind: "table", x: 6, y: 27, w: 12, h: 10 },
  { id: "t2", name: "Стол 2", short: "2", seats: 4, kind: "table", x: 21, y: 27, w: 12, h: 10 },
  { id: "t3", name: "Стол 3", short: "3", seats: 6, kind: "table", x: 36, y: 27, w: 12, h: 10 },
  { id: "t4", name: "Стол 4", short: "4", seats: 4, kind: "table", x: 51, y: 27, w: 12, h: 10 },
  { id: "t5", name: "Стол 5", short: "5", seats: 2, kind: "table", x: 36, y: 43, w: 12, h: 10 },
  { id: "t6", name: "Стол 6", short: "6", seats: 6, kind: "table", x: 51, y: 43, w: 12, h: 10 },
  { id: "t7", name: "Стол 7 у ретро-стены", short: "7", seats: 4, kind: "table", x: 74, y: 45, w: 22, h: 10 },
  { id: "lounge", name: "Лаунж за цепями", short: "Лаунж", seats: 10, kind: "lounge", x: 4, y: 45, w: 25, h: 17 },
  { id: "ps5", name: "Зона PlayStation 5", short: "PS5", seats: 6, kind: "ps5", x: 74, y: 20, w: 22, h: 17 },
];

const pos = (s: { x: number; y: number; w: number; h: number }) => ({
  left: `${s.x}%`,
  top: `${(s.y / H) * 100}%`,
  width: `${s.w}%`,
  height: `${(s.h / H) * 100}%`,
});

function Deco({ x, y, w, h, className, children }: { x: number; y: number; w: number; h: number; className: string; children?: ReactNode }) {
  return (
    <div aria-hidden="true" className={`plan-deco ${className}`} style={pos({ x, y, w, h })}>
      {children}
    </div>
  );
}

// ---------- dates ----------

const DAYS_AHEAD = 30;
const WEEKDAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const keyOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const sameDay = (a: Date, b: Date) => keyOf(a) === keyOf(b);
const monthFmt = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });
const dayFmt = new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" });
const shortDayFmt = new Intl.DateTimeFormat("ru-RU", { weekday: "short", day: "numeric", month: "long" });

function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

/** start hours a guest can pick on a date: from opening to an hour before closing */
const startHours = (d: Date) => {
  const { from, to } = openHours(d);
  return Array.from({ length: to - from }, (_, i) => from + i);
};

// ---------- occupancy (a demo until the bar's booking system is connected) ----------

type Saved = { spot: string; date: string; hour: number; duration: number };
const STORE = "podval:bookings";

function readSaved(): Saved[] {
  try {
    const raw = window.localStorage.getItem(STORE);
    const list: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return [];
    return list.filter(
      (b): b is Saved =>
        typeof b === "object" && b !== null && typeof b.spot === "string" && typeof b.date === "string" && Number.isInteger(b.hour) && Number.isInteger(b.duration),
    );
  } catch {
    return [];
  }
}
function writeSaved(list: Saved[]) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(list.slice(-20)));
  } catch {
    /* storage blocked: the booking still shows as confirmed */
  }
}
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function isBusy(spot: string, date: Date, hour: number, duration: number, saved: Saved[]) {
  const key = keyOf(date);
  for (let i = 0; i < duration; i++) {
    const h = hour + i;
    const weekend = date.getDay() === 5 || date.getDay() === 6;
    const late = h >= 20;
    const load = 14 + (late ? 18 : 0) + (weekend ? 14 : 0);
    if (hash(`${spot}|${key}|${h}`) % 100 < load) return true;
    if (saved.some((b) => b.spot === spot && b.date === key && h >= b.hour && h < b.hour + b.duration)) return true;
  }
  return false;
}

// ---------- form helpers ----------

const cleanName = (s: string) => s.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 40);
const phoneDigits = (s: string) => {
  const d = s.replace(/\D/g, "");
  if (d.length === 11 && (d[0] === "7" || d[0] === "8")) return "7" + d.slice(1);
  if (d.length === 10 && d[0] === "9") return "7" + d;
  return null;
};
const formatPhone = (d: string) => `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
const guestsWord = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? "гость" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "гостя" : "гостей");

function Stepper({ label, id, value, min, max, onChange, unit }: { label: string; id: string; value: number; min: number; max: number; onChange: (n: number) => void; unit: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h3 id={id} className="font-sans text-[18px] font-semibold tracking-normal">
        {label}
      </h3>
      <div className="flex items-center gap-1" role="group" aria-labelledby={id}>
        <button type="button" aria-label="Меньше" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className="icon-btn">
          <Minus className="size-5" aria-hidden="true" />
        </button>
        <output aria-live="polite" className="w-20 text-center text-[20px] font-semibold tabular-nums">
          {value} {unit}
        </output>
        <button type="button" aria-label="Больше" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className="icon-btn">
          <Plus className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function BookingFallback({ hostRef }: { hostRef?: React.Ref<HTMLParagraphElement> }) {
  return (
    <p ref={hostRef} className="min-h-[900px] rounded-tile bg-surface p-6 lg:min-h-[780px]">
      Бронь по телефону:{" "}
      <a className="underline decoration-violet underline-offset-4" href={club.phoneHref}>
        {club.phone}
      </a>
    </p>
  );
}

export function Booking() {
  const [today, setToday] = useState<Date | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [hour, setHour] = useState<number | null>(null);
  const [duration, setDuration] = useState(2);
  const [guests, setGuests] = useState(2);
  const [picked, setSpot] = useState<string | null>(null);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [done, setDone] = useState<(Saved & { name: string; phone: string; code: string; guests: number }) | null>(null);
  const hostRef = useRef<HTMLParagraphElement>(null);

  // the visitor's clock decides today and the hours left, so the widget is built on the client
  useEffect(() => {
    const n = new Date();
    const t = startOfDay(n);
    // a guest at 01:00 is still in yesterday's evening: start from today anyway
    // eslint-disable-next-line react-hooks/set-state-in-effect -- dates come from the visitor's clock
    setNow(n);
    setToday(t);
    setDate(t);
    setView({ y: t.getFullYear(), m: t.getMonth() });
    const first = startHours(t).find((h) => h > n.getHours()) ?? null;
    setHour(first);
    setSaved(readSaved());
  }, []);

  const hourOff = (h: number, d: Date | null) => !!(d && today && now && sameDay(d, today) && h <= now.getHours());

  const close = date ? openHours(date).to : 26;
  const maxDur = hour !== null ? Math.max(1, Math.min(6, close - hour)) : 6;
  const dur = Math.min(duration, maxDur);

  const busy = useMemo(() => {
    const map = new Map<string, boolean>();
    if (!date || hour === null) return map;
    for (const s of spots) map.set(s.id, isBusy(s.id, date, hour, dur, saved));
    return map;
  }, [date, hour, dur, saved]);

  const fits = (s: Spot) => s.seats >= guests;
  const spot = picked ? spots.find((s) => s.id === picked && !busy.get(s.id) && fits(s)) ?? null : null;

  if (!today || !view || !date) return <BookingFallback hostRef={hostRef} />;

  const lastDay = addDays(today, DAYS_AHEAD);
  const cells = monthGrid(view.y, view.m);
  const canPrev = view.y > today.getFullYear() || view.m > today.getMonth();
  const canNext = new Date(view.y, view.m + 1, 1) <= lastDay;
  const open = spots.filter((s) => !busy.get(s.id) && fits(s)).length;
  const timeLabel = hour !== null ? `${hh(hour)}–${hh(hour + dur)}` : "";

  const pickDate = (d: Date) => {
    setDate(d);
    const hours = startHours(d);
    if (hour === null || !hours.includes(hour) || hourOff(hour, d)) {
      setHour(hours.find((h) => !hourOff(h, d)) ?? null);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = cleanName(name);
    const p = phoneDigits(phone);
    const next: typeof errors = {};
    if (n.length < 2) next.name = "Напишите имя, хотя бы две буквы.";
    if (!p) next.phone = "Нужен номер из 10 цифр после +7, например +7 900 123-45-67.";
    setErrors(next);
    if (next.name || next.phone || !spot || hour === null) return;
    const booking: Saved = { spot: spot.id, date: keyOf(date), hour, duration: dur };
    const list = [...readSaved(), booking];
    writeSaved(list);
    setSaved(list);
    const code = `PV-${(hash(`${booking.date}${hour}${spot.id}${p}${Date.now()}`) % 9000) + 1000}`;
    setDone({ ...booking, name: n, phone: formatPhone(p!), code, guests });
    setName("");
    setPhone("");
  };

  if (done) {
    const d = new Date(`${done.date}T00:00:00`);
    const s = spots.find((x) => x.id === done.spot)!;
    return (
      <div role="status" className="in-up grid gap-8 rounded-tile bg-violet-deep/60 p-[clamp(24px,4vw,56px)] shadow-[inset_0_0_0_1px_#b45cff,0_0_60px_rgb(180_92_255/0.25)] lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h3 className="font-display text-h2">{s.name} за вами</h3>
          <p className="lead mt-4">
            {dayFmt.format(d)}, {hh(done.hour)}–{hh(done.hour + done.duration)}, {done.guests} {guestsWord(done.guests)}.
          </p>
          <p className="mt-4 text-soft">
            {done.name}, назовите администратору код брони <strong className="neon-ochre">{done.code}</strong>. Мы держим стол 15
            минут после начала; если задерживаетесь, позвоните{" "}
            <a className="text-ink underline decoration-violet underline-offset-4" href={club.phoneHref}>
              {club.phone}
            </a>
            .
          </p>
        </div>
        <div className="flex items-end lg:col-span-4 lg:justify-end">
          <button
            type="button"
            className="btn btn-neon"
            onClick={() => {
              setDone(null);
              setSpot(null);
            }}
          >
            Забронировать ещё
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-[var(--gutter)] lg:grid-cols-12">
      {/* ---------- When ---------- */}
      <Reveal from="left" className="flex flex-col gap-1.5 lg:col-span-5">
        <div className="rounded-tile bg-surface p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-[18px] font-semibold capitalize tracking-normal">
              {monthFmt.format(new Date(view.y, view.m, 1)).replace(" г.", "")}
            </h3>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Предыдущий месяц"
                disabled={!canPrev}
                onClick={() => setView((v) => (v ? (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }) : v))}
                className="icon-btn"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Следующий месяц"
                disabled={!canNext}
                onClick={() => setView((v) => (v ? (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }) : v))}
                className="icon-btn"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[14px] text-soft" aria-hidden="true">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1">
                {w}
              </span>
            ))}
          </div>
          <div key={`${view.y}-${view.m}`} className="cat-panel mt-1 grid grid-cols-7 gap-x-1 gap-y-1.5">
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const off = d < today || d > lastDay;
              const on = sameDay(d, date);
              return (
                <Keycap key={keyOf(d)} state={on ? "on" : off ? "busy" : "free"} h={42} r={10} ariaLabel={dayFmt.format(d)} onClick={() => pickDate(d)}>
                  <span className="relative">{d.getDate()}</span>
                </Keycap>
              );
            })}
          </div>
        </div>

        <div className="rounded-tile bg-surface p-5 md:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-sans text-[18px] font-semibold tracking-normal">Начало</h3>
            <p className="text-small text-soft">
              открыто {hh(openHours(date).from)}–{hh(openHours(date).to)}
            </p>
          </div>
          <div key={keyOf(date)} className="cat-panel mt-4 grid grid-cols-5 gap-x-1 gap-y-1.5">
            {startHours(date).map((h) => {
              const off = hourOff(h, date);
              return (
                <Keycap key={h} state={hour === h ? "on" : off ? "busy" : "free"} h={46} r={12} onClick={() => setHour(h)}>
                  <span className="relative">{hh(h)}</span>
                </Keycap>
              );
            })}
          </div>
          {startHours(date).every((h) => hourOff(h, date)) && (
            <p className="mt-3 text-small text-ochre">На сегодня бронь уже закрыта, выберите другой день.</p>
          )}
          <div className="mt-6 flex flex-col gap-4">
            <Stepper label="Сколько часов" id="dur-label" value={dur} min={1} max={maxDur} onChange={setDuration} unit="ч" />
            <Stepper label="Гостей" id="guests-label" value={guests} min={1} max={10} onChange={setGuests} unit="" />
          </div>
        </div>
      </Reveal>

      {/* ---------- Where ---------- */}
      <Reveal from="right" order={1} className="flex flex-col gap-1.5 lg:col-span-7">
        <div className="rounded-tile bg-surface p-5 md:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-sans text-[18px] font-semibold tracking-normal">Схема зала</h3>
            <p className="text-[14px] text-soft" aria-live="polite">
              {hour === null ? "Выберите время" : `Свободно ${open} из ${spots.length} для ${guests} ${guestsWord(guests)}, ${shortDayFmt.format(date)}, ${timeLabel}`}
            </p>
          </div>

          <div className="plan mt-5" role="group" aria-label="Схема зала: бар, столы, лаунж и зона PlayStation 5">
            {/* walls and fixtures */}
            <Deco x={3} y={3.5} w={41} h={7.5} className="bg-[linear-gradient(180deg,#3a2a12,#20160a)] text-[#ffd38a] shadow-[0_0_0_1px_rgb(255_176_59/0.5),0_0_24px_rgb(255_160_40/0.35)]">
              <span className="neon-ochre">Бар</span>
            </Deco>
            <Deco x={70} y={3.5} w={26} h={11} className="bg-[#0d1530] text-[#cfe0ff] shadow-[0_0_0_1px_rgb(79_139_255/0.55),0_0_24px_rgb(79_139_255/0.3)]">
              <span className="neon-blue">DJ · караоке</span>
            </Deco>
            <Deco x={97} y={21} w={1.4} h={15} className="!rounded-full bg-blue shadow-[0_0_14px_#4f8bff]" />
            <Deco x={30.5} y={44} w={0.6} h={19} className="!rounded-full bg-[repeating-linear-gradient(180deg,#8b7fa3_0_3px,transparent_3px_6px)]" />
            <Deco x={66} y={62} w={30} h={4} className="!hidden !justify-items-end !text-[10px] text-soft/60 sm:!grid">
              <span>стена-коллаж · 18+</span>
            </Deco>
            <Deco x={43} y={64.2} w={14} h={3.8} className="!rounded-b-none bg-ground text-[10px] text-soft shadow-[0_-2px_0_#b45cff]">
              Вход
            </Deco>

            {spots.map((s) => {
              const taken = !!busy.get(s.id) || hour === null;
              const small = !fits(s);
              const state = spot?.id === s.id ? "on" : taken || small ? "busy" : "free";
              return (
                <div key={s.id} className="plan-spot" style={pos(s)}>
                  <Keycap
                    state={state}
                    h="fill"
                    r={s.kind === "table" ? 999 : 10}
                    fs={s.kind === "table" || s.kind === "bar" ? 15 : 13}
                    fw={600}
                    strike={!small}
                    ariaLabel={`${s.name}, до ${s.seats} гостей${taken ? ", занято" : small ? ", мало мест" : ""}`}
                    onClick={() => setSpot(s.id)}
                  >
                    <span className="relative flex flex-col items-center leading-tight">
                      {s.short}
                      <span className="hidden text-[10px] font-medium opacity-70 sm:block">до {s.seats}</span>
                    </span>
                  </Keycap>
                </div>
              );
            })}
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-soft" aria-label="Обозначения">
            <li className="flex items-center gap-2">
              <KeyLegend state="free" /> свободно
            </li>
            <li className="flex items-center gap-2">
              <KeyLegend state="busy" /> занято или мало мест
            </li>
            <li className="flex items-center gap-2">
              <KeyLegend state="on" /> ваш выбор
            </li>
          </ul>
        </div>

        <form onSubmit={submit} noValidate className="grid gap-5 rounded-tile bg-surface p-5 md:grid-cols-2 md:p-6">
          <p className="lead md:col-span-2" aria-live="polite">
            {spot && hour !== null ? (
              <>
                {spot.name}, {shortDayFmt.format(date)}, {timeLabel},{" "}
                <span className="neon-violet">
                  {guests} {guestsWord(guests)}
                </span>
              </>
            ) : (
              <span className="text-soft">{hour === null ? "Выберите время начала." : "Нажмите на свободный стол или место у бара на схеме."}</span>
            )}
          </p>
          <label className="flex flex-col gap-2">
            Имя
            <input
              className="field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              autoComplete="given-name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <span id="name-error" className="text-[14px] text-[#ff8aa5]">
                {errors.name}
              </span>
            )}
          </label>
          <label className="flex flex-col gap-2">
            Телефон
            <input
              className="field"
              value={phone}
              onChange={(e) => setPhone(e.target.value.slice(0, 20))}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 900 123-45-67"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <span id="phone-error" className="text-[14px] text-[#ff8aa5]">
                {errors.phone}
              </span>
            )}
          </label>
          <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-2">
            <p className="max-w-[40ch] text-[14px] text-soft">Подтвердим бронь звонком или в WhatsApp. Отменить можно по телефону.</p>
            <button type="submit" className="btn btn-neon" disabled={!spot || hour === null}>
              {spot ? `Забронировать: ${spot.short.length < 3 && spot.kind === "table" ? `стол ${spot.short}` : spot.short}` : "Забронировать"}
            </button>
          </div>
        </form>
      </Reveal>
    </div>
  );
}
