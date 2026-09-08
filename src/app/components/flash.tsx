"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Check, Info, TriangleAlert, X } from "lucide-react";

type FlashKind = "ok" | "warn" | "info";
type FlashItem = { id: number; kind: FlashKind; text: string };

const FlashContext = createContext<(kind: FlashKind, text: string) => void>(() => {});

/** Replaces every window.alert() in the app. */
export function useFlash() {
  return useContext(FlashContext);
}

const SKIN: Record<FlashKind, { ring: string; icon: string; Icon: typeof Check }> = {
  ok: { ring: "border-go/25", icon: "bg-go-soft text-go-text", Icon: Check },
  warn: { ring: "border-sale/25", icon: "bg-sale-soft text-sale-text", Icon: TriangleAlert },
  info: { ring: "border-line", icon: "bg-canvas-2 text-ink", Icon: Info },
};

export function FlashProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FlashItem[]>([]);

  const push = useCallback((kind: FlashKind, text: string) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev.slice(-2), { id, kind, text }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const last = items[items.length - 1];
    const t = setTimeout(() => dismiss(last.id), 5000);
    return () => clearTimeout(t);
  }, [items, dismiss]);

  const value = useMemo(() => push, [push]);

  return (
    <FlashContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4"
      >
        {items.map((item) => {
          const skin = SKIN[item.kind];
          return (
            <div
              key={item.id}
              className={`pointer-events-auto flex w-full max-w-[440px] items-start gap-3 rounded border bg-surface p-3 shadow-pop animate-slide-down ${skin.ring}`}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${skin.icon}`}>
                <skin.Icon size={15} strokeWidth={2.5} aria-hidden />
              </span>
              <p className="flex-1 pt-0.5 text-small text-ink">{item.text}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="ปิดข้อความ"
                className="-m-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-subtle transition-colors duration-150 hover:bg-canvas-2 hover:text-ink"
              >
                <X size={15} aria-hidden />
              </button>
            </div>
          );
        })}
      </div>
    </FlashContext.Provider>
  );
}
