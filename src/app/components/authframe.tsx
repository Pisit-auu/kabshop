import Link from "next/link";
import Image from "next/image";
import { PackageCheck, ShieldCheck, Truck } from "lucide-react";

const POINTS = [
  { Icon: Truck, text: "ค่าจัดส่งคงที่ ฿36 ต่อคำสั่งซื้อ ส่งทั่วไทย" },
  { Icon: PackageCheck, text: "ติดตามคำสั่งซื้อย้อนหลังได้ทุกรายการ" },
  { Icon: ShieldCheck, text: "เก็บที่อยู่จัดส่งไว้ใช้ครั้งต่อไป ไม่ต้องกรอกซ้ำ" },
];

export default function AuthFrame({
  title,
  intro,
  children,
  foot,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
  foot: React.ReactNode;
}) {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-canvas-2 px-12 py-12 lg:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/KAB.png" alt="" width={34} height={34} className="object-contain" priority />
          <span className="u-display text-h4 font-bold tracking-[-0.02em]">KABSHOP</span>
        </Link>

        <div>
          <p className="u-display max-w-[18ch] text-h1 leading-[1.12]">
            ร้านเดียว ครบทุกหมวดที่ต้องใช้
          </p>
          <ul className="mt-8 space-y-4">
            {POINTS.map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-small text-muted">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-ink">
                  <Icon size={16} aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-caption text-subtle">© {new Date().getFullYear()} KABSHOP</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          <Link href="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
            <Image src="/KAB.png" alt="" width={30} height={30} className="object-contain" priority />
            <span className="u-display text-h4 font-bold tracking-[-0.02em]">KABSHOP</span>
          </Link>

          <h1 className="u-display text-h2">{title}</h1>
          <p className="mt-2 text-small text-muted">{intro}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 border-t border-line pt-6 text-small text-muted">{foot}</p>
        </div>
      </section>
    </main>
  );
}
