"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType } from "react";

type RevealProps<T extends ElementType> = {
  as?: T;
  /** position in the section's stagger */
  order?: number;
  /** which screen edge the block comes in from */
  from?: "left" | "right" | "up" | "zoom";
} & ComponentPropsWithoutRef<T>;

// The server renders every block visible. After mount, a block still below the screen is set to
// wait (moved off towards its edge, transparent) and slides in once its top passes 90% of the
// screen height. One shared scroll listener serves all blocks.
const pending = new Set<HTMLElement>();
let timer: ReturnType<typeof setTimeout> | 0 = 0;
let listening = false;

const line = () => window.innerHeight * 0.9;

function check() {
  timer = 0;
  const y = line();
  for (const el of pending) {
    if (el.getBoundingClientRect().top < y) {
      el.classList.add("is-in");
      pending.delete(el);
    }
  }
}

function schedule() {
  if (!timer) timer = setTimeout(check, 40);
}

function watch(el: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (el.getBoundingClientRect().top < line()) return;
  el.dataset.reveal = "wait";
  pending.add(el);
  if (!listening) {
    listening = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
  }
  schedule();
}

/** Slides in from a screen edge once, when it enters the viewport. Visible without JS. */
export function Reveal<T extends ElementType = "div">({ as, order = 0, from = "up", style, ...rest }: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    watch(el);
    return () => {
      pending.delete(el);
    };
  }, []);

  return <Tag ref={ref} data-reveal="" data-from={from} style={{ ["--i" as string]: order, ...style }} {...rest} />;
}
