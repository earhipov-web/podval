"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * A mechanical keyboard keycap used as a booking control: a cap on a dark base, pressed 3px down on
 * pointer or Enter/Space and sprung back on release. Free keys are dark violet, the chosen key is neon
 * and sits slightly lower, busy keys are sunk flush into the plate. Press and hover touch the DOM
 * directly (transform and opacity only), so no re-render runs while a key moves.
 */

export type KeyState = "free" | "on" | "busy";

const SKIN = {
  free: { f1: "#2c1f45", f2: "#1d142f", s1: "#281b40", s2: "#170f27", s3: "#0c0715", base: "#05030a", hl: "rgba(255,255,255,.09)", ink: "#fff" },
  hover: { f1: "#5b2aa6", f2: "#431b85" },
  on: { f1: "#e2b8ff", f2: "#b45cff", s1: "#b45cff", s2: "#8a36e0", s3: "#5a1ea3", base: "#26093f", hl: "rgba(255,255,255,.6)", ink: "#000" },
} as const;

const CAP = 4; // travel of the cap, px
const SPRING = "transform 180ms cubic-bezier(.34,1.56,.64,1)";
const DOWN = "transform 70ms cubic-bezier(.22,1,.36,1)";
const MIN_HOLD = 90; // ms a tap stays down so it reads as a press

type Props = {
  state: KeyState;
  /** height of the cap face, px; "fill" stretches the key over its positioned parent */
  h: number | "fill";
  /** corner radius, px */
  r: number;
  /** a wide key: content stacked and left-aligned, with padding */
  wide?: boolean;
  /** wide key with its content pushed to the bottom */
  end?: boolean;
  pad?: number;
  fs?: number;
  fw?: number;
  /** strike the label through when busy */
  strike?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  children: ReactNode;
};

export function Keycap({ state, h, r, wide, end, pad, fs = 14, fw = 500, strike, onClick, ariaLabel, children }: Props) {
  const capRef = useRef<HTMLSpanElement>(null);
  const baseRef = useRef<HTMLSpanElement>(null);
  const hovRef = useRef<HTMLSpanElement>(null);
  const downAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const sunk = state === "busy";
  const live = !sunk;
  const P = state === "on" ? SKIN.on : SKIN.free;
  const rest = `translate3d(0,${state === "on" ? Math.min(2, CAP - 1) : sunk ? CAP : 0}px,0)`;
  const bx = wide ? 6 : 4;
  // the release runs after the click may have changed the key's state, so it reads the latest rest
  const restRef = useRef(rest);
  useEffect(() => {
    restRef.current = rest;
  }, [rest]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const press = () => {
    const cap = capRef.current, base = baseRef.current;
    if (!cap || !base) return;
    clearTimeout(timer.current);
    downAt.current = performance.now();
    cap.style.transition = base.style.transition = DOWN;
    cap.style.transform = `translate3d(0,${CAP - 1}px,0)`;
    base.style.transform = `translate3d(0,${Math.ceil((CAP - 1) / 2)}px,0)`;
  };
  const release = () => {
    const cap = capRef.current, base = baseRef.current;
    if (!cap || !base || !downAt.current) return;
    const wait = Math.max(0, MIN_HOLD - (performance.now() - downAt.current));
    downAt.current = 0;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      cap.style.transition = base.style.transition = SPRING;
      cap.style.transform = restRef.current;
      base.style.transform = "translate3d(0,0,0)";
    }, wait);
  };
  const hover = (on: boolean) => {
    if (hovRef.current) hovRef.current.style.opacity = on ? "1" : "0";
  };

  const fill = h === "fill";
  const capH = fill ? `calc(100% - ${CAP}px)` : h;
  const button: CSSProperties = {
    position: fill ? "absolute" : "relative",
    inset: fill ? 0 : undefined,
    display: "block",
    width: "100%",
    height: fill ? "100%" : h + CAP,
    padding: 0,
    background: "none",
    color: sunk ? "#5a4f6b" : P.ink,
    userSelect: "none",
    touchAction: "manipulation",
    contain: "layout style",
    cursor: live ? "pointer" : "default",
  };
  const baseStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: CAP,
    height: capH,
    borderRadius: r,
    background: sunk ? "#000" : P.base,
    boxShadow: sunk ? "none" : `0 3px 6px rgba(0,0,0,.7)${state === "on" ? ", 0 0 22px rgba(180,92,255,.4)" : ""}`,
    transform: "translate3d(0,0,0)",
    transition: SPRING,
    willChange: "transform",
  };
  const capStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: capH,
    borderRadius: r,
    background: sunk ? "#040208" : `linear-gradient(180deg, ${P.s1} 0%, ${P.s2} 55%, ${P.s3} 100%)`,
    boxShadow: sunk ? "inset 0 3px 4px rgba(0,0,0,.95), inset 0 0 0 1px #1d1529" : "inset 0 0 0 1px rgba(0,0,0,.35)",
    transform: rest,
    transition: SPRING,
    willChange: "transform",
    backfaceVisibility: "hidden",
  };
  const faceStyle: CSSProperties = {
    position: "absolute",
    top: 2,
    left: sunk ? 2 : bx,
    right: sunk ? 2 : bx,
    bottom: sunk ? 2 : 6,
    borderRadius: Math.max(4, r - 3),
    background: sunk ? "#000" : `radial-gradient(120% 90% at 50% 35%, ${P.f1} 0%, ${P.f2} 70%)`,
    boxShadow: sunk ? "none" : `inset 0 1px 0 ${P.hl}, inset 0 -2px 3px rgba(0,0,0,${state === "on" ? ".18" : ".35"})`,
    fontSize: fs,
    fontWeight: state === "on" ? 600 : fw,
    fontVariantNumeric: "tabular-nums",
    textDecoration: strike && sunk ? "line-through" : "none",
    display: "flex",
    flexDirection: wide ? "column" : "row",
    alignItems: wide ? "flex-start" : "center",
    justifyContent: wide ? (end ? "flex-end" : "space-between") : "center",
    gap: wide ? 4 : 0,
    padding: wide ? (pad ?? 12) : 0,
    textAlign: "left",
    overflow: "hidden",
  };
  const hovStyle: CSSProperties =
    state === "free"
      ? {
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: `radial-gradient(120% 90% at 50% 35%, ${SKIN.hover.f1} 0%, ${SKIN.hover.f2} 70%)`,
          opacity: 0,
          transition: "opacity 120ms ease-out",
          pointerEvents: "none",
        }
      : { display: "none" };

  return (
    <button
      type="button"
      disabled={!live}
      aria-pressed={state === "on"}
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerDown={live ? press : undefined}
      onPointerUp={live ? release : undefined}
      onPointerLeave={
        live
          ? () => {
              release();
              hover(false);
            }
          : undefined
      }
      onPointerEnter={live ? () => hover(true) : undefined}
      onKeyDown={live ? (e) => (e.key === "Enter" || e.key === " ") && !e.repeat && press() : undefined}
      onKeyUp={live ? (e) => (e.key === "Enter" || e.key === " ") && release() : undefined}
      style={button}
    >
      <span ref={baseRef} style={baseStyle} />
      <span ref={capRef} style={capStyle}>
        <span style={faceStyle}>
          <span ref={hovRef} style={hovStyle} />
          {children}
        </span>
      </span>
    </button>
  );
}

/** Small key used in the legend. */
export function KeyLegend({ state }: { state: KeyState }) {
  const style: CSSProperties =
    state === "busy"
      ? { display: "inline-block", width: 18, height: 16, borderRadius: 4, background: "#000", boxShadow: "inset 0 2px 2px rgba(0,0,0,.95), inset 0 0 0 1px #2e2540", transform: "translateY(2px)" }
      : (() => {
          const P = state === "on" ? SKIN.on : SKIN.free;
          return {
            display: "inline-block",
            width: 18,
            height: 16,
            borderRadius: 4,
            background: `radial-gradient(120% 90% at 50% 35%, ${P.f1}, ${P.f2})`,
            boxShadow: `inset 0 1px 0 ${P.hl}, 0 0 0 1px ${P.s2}, 0 2px 0 1px ${P.s3}, 0 3px 4px 1px rgba(0,0,0,.7)`,
          };
        })();
  return <span style={style} aria-hidden="true" />;
}
