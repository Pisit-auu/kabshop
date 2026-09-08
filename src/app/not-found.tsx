import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "ไม่พบหน้านี้" };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/KAB.png" alt="" width={40} height={40} className="object-contain" />
        <span className="u-display text-h3 font-black tracking-[-0.03em]">KABSHOP</span>
      </Link>

      <p className="u-fig mt-12 text-[88px] font-black leading-none text-rule-mid">404</p>
      <h1 className="u-display mt-4 text-h2">ไม่พบหน้าที่คุณเรียก</h1>
      <p className="mt-3 max-w-[46ch] text-base text-ink-mid">
        หน้านี้อาจถูกย้าย หรือสินค้าชิ้นนี้ถูกนำออกจากร้านแล้ว ลองกลับไปดูประกาศทั้งหมดของวันนี้
      </p>

      <Link
        href="/"
        className="mt-10 inline-flex min-h-[52px] items-center bg-ink px-6 font-display text-base font-semibold text-paper transition-shadow duration-150 hover:shadow-[inset_0_-3px_0_rgba(255,255,255,0.28)]"
      >
        กลับไปหน้าประกาศทั้งหมด
      </Link>
    </main>
  );
}
