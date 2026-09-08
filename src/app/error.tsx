"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="u-label">เกิดข้อผิดพลาด</span>
      <h1 className="u-display mt-3 text-h2">หน้านี้เปิดไม่สำเร็จ</h1>
      <p className="mt-3 max-w-[48ch] text-base text-ink-mid">
        ระบบขัดข้องชั่วคราวระหว่างโหลดหน้านี้ ลองใหม่อีกครั้ง หากยังไม่ได้ กรุณาติดต่อทางร้าน
      </p>
      {error.digest && <p className="u-fig mt-4 text-caption text-ink-soft">รหัสอ้างอิง {error.digest}</p>}

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[52px] items-center bg-ink px-6 font-display text-base font-semibold text-paper transition-shadow duration-150 hover:shadow-[inset_0_-3px_0_rgba(255,255,255,0.28)]"
        >
          ลองใหม่อีกครั้ง
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[52px] items-center border border-ink px-6 font-display text-base font-semibold transition-colors duration-150 hover:bg-ink hover:text-paper"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </main>
  );
}
