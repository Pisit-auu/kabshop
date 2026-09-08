"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import React from "react";

/* ── Money ────────────────────────────────────────────────────────────────
   One numeral treatment for every figure a shopper reads: price, stock,
   quantity, totals, order number. Tabular so columns line up down a page.
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
    <span className={`u-fig font-display font-semibold whitespace-nowrap ${className}`}>
      {sign && <span aria-hidden className="mr-[0.1em] font-normal opacity-60">฿</span>}
      {safe.toLocaleString("th-TH")}
      <span className="sr-only"> บาท</span>
    </span>
  );
}

/* ── Buttons ──────────────────────────────────────────────────────────────
   Near-black primary in the premium-retail register; everything else is a
   quiet outline. Elevation only on the primary, only on hover.
   ───────────────────────────────────────────────────────────────────────── */

type ButtonTone = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const TONE: Record<ButtonTone, string> = {
  primary:
    "bg-brand text-brand-on border border-brand hover:bg-[var(--brand-hover)] hover:shadow-lift",
  secondary: "bg-surface text-ink border border-line-strong hover:bg-canvas-2 hover:border-subtle",
  ghost: "bg-transparent text-ink border border-transparent hover:bg-canvas-2",
  danger: "bg-surface text-sale-text border border-sale hover:bg-sale hover:text-white",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "min-h-[36px] px-3 text-caption gap-1.5 rounded-sm",
  md: "min-h-[44px] px-5 text-small gap-2 rounded-sm",
  lg: "min-h-[52px] px-6 text-base gap-2 rounded",
};

const BASE =
  "inline-flex items-center justify-center font-display font-semibold " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-ease " +
  "active:scale-[0.99] disabled:pointer-events-none " +
  "disabled:!bg-canvas-3 disabled:!text-subtle disabled:!border-canvas-3 disabled:!shadow-none";

export function Button({
  tone = "primary",
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
  tone = "primary",
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

/* ── Badges ───────────────────────────────────────────────────────────────
   Stock and order state, stated rather than implied by colour alone.
   ───────────────────────────────────────────────────────────────────────── */

export function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: "neutral" | "sale" | "go" | "solid";
  children: React.ReactNode;
  className?: string;
}) {
  const skin =
    tone === "sale"
      ? "bg-sale-soft text-sale-text"
      : tone === "go"
        ? "bg-go-soft text-go-text"
        : tone === "solid"
          ? "bg-brand text-brand-on"
          : "bg-canvas-2 text-muted";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-micro font-semibold ${skin} ${className}`}
    >
      {children}
    </span>
  );
}

/* ── Page furniture ───────────────────────────────────────────────────────── */

export function Shell({
  children,
  className = "",
  width = "shell",
}: {
  children: React.ReactNode;
  className?: string;
  width?: "shell" | "narrow" | "column";
}) {
  const w =
    width === "narrow" ? "max-w-[720px]" : width === "column" ? "max-w-[980px]" : "max-w-shell";
  return <div className={`mx-auto w-full ${w} px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function PageHead({
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
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 pb-6 pt-8 sm:pt-10">
      <div className="min-w-0">
        <As className="u-display text-h2 sm:text-h1">{title}</As>
        {meta && <p className="mt-2 text-small text-muted">{meta}</p>}
      </div>
      {action}
    </header>
  );
}

export function Card({
  children,
  className = "",
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: any;
}) {
  return <As className={`u-card ${className}`}>{children}</As>;
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
      <span className="text-small font-semibold text-ink">{children}</span>
      {hint && <span className="text-caption text-subtle">{hint}</span>}
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
    <div className="u-card flex flex-col items-center px-6 py-16 text-center">
      {icon && (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-canvas-2 text-subtle">
          {icon}
        </div>
      )}
      <h3 className="u-display text-h4">{title}</h3>
      {body && <p className="mt-2 max-w-[44ch] text-small text-muted">{body}</p>}
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`u-skeleton ${className}`}>
      <span className="sr-only">กำลังโหลด</span>
    </div>
  );
}

export function PageLoading({ label = "กำลังโหลด" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4" role="status">
      <Loader2 size={28} className="animate-spin text-subtle" aria-hidden />
      <p className="text-small text-muted">{label}</p>
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
      ? "border-go/25 bg-go-soft text-go-text"
      : tone === "info"
        ? "border-line bg-canvas-2 text-ink"
        : "border-sale/25 bg-sale-soft text-sale-text";
  return (
    <div role="alert" className={`rounded border px-4 py-3 text-small ${skin}`}>
      {children}
    </div>
  );
}
