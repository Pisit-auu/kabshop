"use client";

import Link from "next/link";
import { ChevronLeft, ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useFlash } from "./flash";
import { Label } from "./press";

/** The shared shell for every back-office form. */
export function FormShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 pt-8 text-small font-semibold underline decoration-rule-mid underline-offset-4 hover:decoration-ink"
      >
        <ChevronLeft size={16} aria-hidden /> กลับหน้าจัดการร้าน
      </Link>

      <header className="pb-4 pt-6">
        <h1 className="u-display text-h2">{title}</h1>
        <p className="mt-2 max-w-[56ch] text-small text-ink-mid">{intro}</p>
        <div className="mt-4 flex" aria-hidden>
          <div className="h-[6px] w-20 bg-[var(--section-fill)]" />
          <div className="h-[6px] flex-1 bg-ink" />
        </div>
      </header>

      {children}
    </>
  );
}

export function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="border border-rule bg-stock">
      <legend className="sr-only">{legend}</legend>
      <p className="border-b border-rule px-5 py-3 font-display text-small font-bold">{legend}</p>
      <div className="space-y-6 p-5">{children}</div>
    </fieldset>
  );
}

/** Upload straight to Cloudinary through the admin-only route, with a preview. */
export function ImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const flash = useFlash();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/uploadimg", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "อัปโหลดรูปภาพไม่สำเร็จ");
      onChange(data.url);
      flash("ok", "อัปโหลดรูปภาพแล้ว");
    } catch (err) {
      flash("warn", err instanceof Error ? err.message : "อัปโหลดรูปภาพไม่สำเร็จ");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <Label htmlFor="product-image" hint="JPG, PNG, WebP หรือ GIF ไม่เกิน 5 MB">
        รูปภาพสินค้า
      </Label>

      <div className="flex flex-wrap items-start gap-4">
        <div className="relative h-32 w-32 shrink-0 border border-rule-mid bg-paper-deep">
          {value ? (
            // Cloudinary URLs vary in shape; a plain img keeps the preview honest.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="ตัวอย่างรูปสินค้า" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-ink-soft">
              <ImageIcon size={26} strokeWidth={1.5} aria-hidden />
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-paper/85">
              <Loader2 size={22} className="animate-spin text-ink" aria-hidden />
              <span className="sr-only">กำลังอัปโหลด</span>
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            id="product-image"
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            onChange={upload}
            disabled={uploading}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex min-h-[46px] items-center gap-2 border border-ink px-4 font-display text-small font-semibold transition-colors duration-150 hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-45"
          >
            <Upload size={16} aria-hidden /> {value ? "เปลี่ยนรูปภาพ" : "เลือกรูปภาพ"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex min-h-[38px] items-center gap-2 px-1 text-caption font-semibold text-scarlet-text underline underline-offset-4"
            >
              <Trash2 size={14} aria-hidden /> นำรูปออก
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
