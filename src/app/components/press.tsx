"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import React from "react";

/* ── Section inks ─────────────────────────────────────────────────────────
   Four flat inks. A category takes one and then owns the page: the flash
   rule, the running head, the spine and every cell shoulder change together.
   ───────────────────────────────────────────────────────────────────────── */

export const SECTION_INKS = ["scarlet", "cobalt", "jade", "chrome"] as const;
export type SectionInk = (typeof SECTION_INKS)[number];

export function inkFor(seed: string | number | null | undefined): SectionInk {
  if (seed === null || seed === undefined || seed === "") return "scarlet";
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return SECTION_INKS[h % SECTION_INKS.length];
}

/* ── Money ────────────────────────────────────────────────────────────────
   One numeral treatment for every baht in the product: the rack, the cart,
   the checkout and the receipt all set money the same way.
   ───────────────────────────────────────────────────────────────────────── */

export function Money({
  value,
  className = "",
  sign = true,
}: {
  value: number | string | null | undefined;
  className?: string;
  sign?: boolean;
}) {
  const n = Number(value ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  return (
    <span className={`u-fig font-bold whitespace-nowrap ${className}`}>
      {sign && <span aria-hidden className="opacity-55 mr-[0.12em]">฿</span>}
      {safe.toLocaleString("th-TH")}
      <span className="sr-only"> บาท</span>
    </span>
  );
}

/* ── Rules ────────────────────────────────────────────────────────────────── */

export function Rule({
  weight = "hair",
  tone = "rule",
  className = "",
  draw = false,
}: {
  weight?: "hair" | "mid" | "flash";
  tone?: "rule" | "ink" | "section";
  className?: string;
  draw?: boolean;
}) {
  const h = weight === "flash" ? "h-2" : weight === "mid" ? "h-[3px]" : "h-px";
  const bg =
    tone === "section"
      ? "bg-[var(--section-fill)]"
      : tone === "ink"
        ? "bg-ink"
        : "bg-rule";
  return (
    <div
      role="presentation"
      className={`${h} ${bg} ${draw ? "u-rule-draw animate-rule-draw" : ""} ${className}`}
    />
  );
}

/* ── Buttons ──────────────────────────────────────────────────────────────
   Stamped ink blocks. No radius, no drop shadow: pressure, not elevation.
   ───────────────────────────────────────────────────────────────────────── */

type ButtonTone = "section" | "ink" | "quiet" | "danger";
type ButtonSize = "md" | "lg" | "sm";

const TONE: Record<ButtonTone, string> = {
  section:
    "bg-[var(--section-fill)] text-[var(--section-on)] border border-[var(--section-fill)] hover:shadow-[inset_0_-3px_0_rgba(0,0,0,0.34)]",
  ink: "bg-ink text-paper border border-ink hover:shadow-[inset_0_-3px_0_rgba(255,255,255,0.28)]",
  quiet:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper",
  danger:
    "bg-transparent text-scarlet-text border border-scarlet hover:bg-scarlet hover:text-white",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "min-h-[38px] px-3 text-caption gap-1.5",
  md: "min-h-[46px] px-5 text-small gap-2",
  lg: "min-h-[56px] px-6 text-base gap-2",
};

const BASE =
  "inline-flex items-center justify-center font-display font-semibold tracking-[0.01em] " +
  "transition-[box-shadow,background-color,color,transform] duration-150 ease-press " +
  "active:translate-y-px disabled:pointer-events-none " +
  "disabled:!bg-paper-deep disabled:!text-ink-soft disabled:!border-rule-mid disabled:!shadow-none";

export function Button({
  tone = "section",
  size = "md",
  busy = false,
  className = "",
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: ButtonTone;
  size?: ButtonSize;
  busy?: boolean;
}) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || busy}
      aria-busy={busy || undefined}
      className={`${BASE} ${TONE[tone]} ${SIZE[size]} ${className}`}
    >
      {busy && <Loader2 size={16} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  tone = "section",
  size = "md",
  className = "",
  children,
  ...rest
}: React.ComponentProps<typeof Link> & { tone?: ButtonTone; size?: ButtonSize }) {
  return (
    <Link href={href} {...rest} className={`${BASE} ${TONE[tone]} ${SIZE[size]} ${className}`}>
      {children}
    </Link>
  );
}

/* ── Marks ────────────────────────────────────────────────────────────────
   Reversed-type blocks. State is printed, not tinted.
   ───────────────────────────────────────────────────────────────────────── */

export function Mark({
  tone = "ink",
  children,
  className = "",
}: {
  tone?: "ink" | "section" | "scarlet" | "jade" | "chrome" | "quiet";
  children: React.ReactNode;
  className?: string;
}) {
  const skin =
    tone === "section"
      ? "bg-[var(--section-fill)] text-[var(--section-on)]"
      : tone === "scarlet"
        ? "bg-scarlet text-white"
        : tone === "jade"
          ? "bg-[var(--jade)] text-white"
          : tone === "chrome"
            ? "bg-[var(--chrome)] text-ink"
            : tone === "quiet"
              ? "bg-paper-deep text-ink-mid"
              : "bg-ink text-paper";
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 font-display text-[11px] font-semibold uppercase tracking-[0.08em] leading-[15px] ${skin} ${className}`}
    >
      {children}
    </span>
  );
}

/* ── Page furniture ───────────────────────────────────────────────────────── */

/** The sheet: the content column, carrying the spine every region registers to. */
export function Sheet({
  children,
  className = "",
  width = "sheet",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "sheet" | "narrow" | "column";
}) {
  const w = width === "narrow" ? "max-w-[720px]" : width === "column" ? "max-w-[980px]" : "max-w-sheet";
  return (
    <div className={`mx-auto w-full ${w} px-4 sm:px-6 ${className}`}>
      <div className="u-spine pl-4 sm:pl-6">{children}</div>
    </div>
  );
}

/** The running head: the section flag that names where the reader is. */
export function RunningHead({
  title,
  meta,
  action,
  as: As = "h1",
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <header className="pt-8 pb-4">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <As className="u-display text-h2 sm:text-h1 leading-[0.95]">{title}</As>
          {meta && <p className="mt-2 text-small text-ink-mid">{meta}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4 flex items-stretch">
        <div className="w-20 bg-[var(--section-fill)] transition-colors duration-300 ease-press" style={{ height: 6 }} />
        <div className="flex-1 bg-ink" style={{ height: 6 }} />
      </div>
    </header>
  );
}

export function Label({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex flex-wrap items-baseline gap-x-2">
      <span className="u-label">{children}</span>
      {hint && <span className="text-caption text-ink-soft normal-case tracking-normal">{hint}</span>}
    </label>
  );
}

/** Empty states name the situation and hand over the next move. */
export function Empty({
  title,
  body,
  action,
  icon,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="border border-dashed border-rule-mid bg-stock px-6 py-16 text-center">
      {icon && <div className="mb-5 flex justify-center text-ink-soft">{icon}</div>}
      <h3 className="u-display text-h4">{title}</h3>
      {body && <p className="mx-auto mt-2 max-w-[42ch] text-small text-ink-mid">{body}</p>}
      {action && <div className="mt-7 flex justify-center">{action}</div>}
    </div>
  );
}

/** The press run: rules and blocks settling in before the ink arrives. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[linear-gradient(90deg,var(--paper-deep)_0%,var(--rule)_50%,var(--paper-deep)_100%)] bg-[length:200%_100%] ${className}`}
      style={{ animation: "rule-draw 0s", backgroundPosition: "0 0" }}
    >
      <span className="sr-only">กำลังโหลด</span>
    </div>
  );
}

export function PageLoading({ label = "กำลังจัดหน้า" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4" role="status">
      <div className="flex w-40 flex-col gap-1.5">
        <div className="h-1 bg-ink animate-rule-draw u-rule-draw" />
        <div className="h-1 bg-[var(--section-fill)] animate-rule-draw u-rule-draw" style={{ animationDelay: "90ms" }} />
        <div className="h-1 bg-rule-mid animate-rule-draw u-rule-draw" style={{ animationDelay: "180ms" }} />
      </div>
      <p className="u-label">{label}</p>
    </div>
  );
}

/** Errors name the problem and the recovery, never just a colour. */
export function Notice({
  tone = "warn",
  children,
}: {
  tone?: "warn" | "ok" | "info";
  children: React.ReactNode;
}) {
  const skin =
    tone === "ok"
      ? { bar: "var(--jade)", label: "สำเร็จ" }
      : tone === "info"
        ? { bar: "var(--ink)", label: "แจ้งให้ทราบ" }
        : { bar: "var(--scarlet)", label: "ไม่สำเร็จ" };
  return (
    <div role="alert" className="flex items-stretch border border-rule bg-stock">
      <span
        className="flex w-2 shrink-0"
        style={{ background: skin.bar }}
        aria-hidden
      />
      <div className="px-4 py-3">
        <span className="u-label block">{skin.label}</span>
        <p className="mt-1 text-small text-ink">{children}</p>
      </div>
    </div>
  );
}
