"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Check, TriangleAlert, Info, X } from "lucide-react";

type FlashKind = "ok" | "warn" | "info";
type FlashItem = { id: number; kind: FlashKind; text: string };

const FlashContext = createContext<(kind: FlashKind, text: string) => void>(() => {});

/**
 * Live state arrives as a reversed-type news flash, never as a silent number.
 * Replaces every window.alert() in the app.
 */
export function useFlash() {
  return useContext(FlashContext);
}

const SKIN: Record<FlashKind, { bg: string; fg: string; label: string; Icon: typeof Check }> = {
  ok: { bg: "var(--jade)", fg: "#fff", label: "สำเร็จ", Icon: Check },
  warn: { bg: "var(--scarlet)", fg: "#fff", label: "ไม่สำเร็จ", Icon: TriangleAlert },
  info: { bg: "var(--ink)", fg: "#fff", label: "แจ้งให้ทราบ", Icon: Info },
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
        className="fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-px px-4 pt-4 pointer-events-none"
      >
        {items.map((item) => {
          const skin = SKIN[item.kind];
          return (
            <div
              key={item.id}
              className="pointer-events-auto flex w-full max-w-[560px] items-stretch animate-flash-in"
              style={{ background: skin.bg, color: skin.fg }}
            >
              <span className="flex items-center gap-2 px-3 py-3 border-r border-white/25">
                <skin.Icon size={16} strokeWidth={2.5} aria-hidden />
                <span className="u-label" style={{ color: skin.fg }}>
                  {skin.label}
                </span>
              </span>
              <p className="flex-1 px-3 py-3 text-small font-medium leading-snug">{item.text}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="ปิดข้อความ"
                className="px-3 border-l border-white/25 transition-colors duration-150 hover:bg-black/15"
              >
                <X size={16} strokeWidth={2.5} aria-hidden />
              </button>
            </div>
          );
        })}
      </div>
    </FlashContext.Provider>
  );
}
