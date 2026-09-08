import Link from "next/link";
import Image from "next/image";
import { CreditCard, Truck, Wallet } from "lucide-react";

const LINKS = [
  { href: "/", label: "สินค้าทั้งหมด" },
  { href: "/cart", label: "ตะกร้าสินค้า" },
  { href: "/user/profile/all", label: "ประวัติสั่งซื้อ" },
  { href: "/user/profile/information", label: "ข้อมูลส่วนตัว" },
];

const FACTS = [
  { Icon: Truck, title: "ค่าจัดส่งคงที่ ฿36", body: "ต่อหนึ่งคำสั่งซื้อ ไม่ว่าจะสั่งกี่ชิ้น" },
  { Icon: Wallet, title: "เก็บเงินปลายทาง", body: "ชำระกับพนักงานส่งของเมื่อได้รับสินค้า" },
  { Icon: CreditCard, title: "QR พร้อมเพย์", body: "ทางร้านส่ง QR ให้หลังยืนยันคำสั่งซื้อ" },
];

export default function SiteFoot() {
  return (
    <footer className="mt-20 border-t border-line bg-canvas-2">
      <div className="mx-auto w-full max-w-shell px-4 sm:px-6 lg:px-8">
        <ul className="grid gap-6 border-b border-line py-10 sm:grid-cols-3">
          {FACTS.map(({ Icon, title, body }) => (
            <li key={title} className="flex gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-ink">
                <Icon size={18} aria-hidden />
              </span>
              <span>
                <span className="block text-small font-semibold">{title}</span>
                <span className="mt-0.5 block text-caption text-muted">{body}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap justify-between gap-10 py-10">
          <div className="max-w-[42ch]">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/KAB.png" alt="" width={30} height={30} className="object-contain" />
              <span className="u-display text-h4 font-bold tracking-[-0.02em]">KABSHOP</span>
            </Link>
            <p className="mt-3 text-small text-muted">
              ร้านค้าออนไลน์รวมสินค้าหลายหมวด สั่งซื้อออนไลน์ จัดส่งทั่วประเทศไทย
            </p>
          </div>

          <nav aria-label="ลิงก์ท้ายหน้า">
            <p className="u-label mb-1">เมนู</p>
            <ul>
              {LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex min-h-[40px] items-center text-small text-muted transition-colors duration-150 hover:text-ink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="border-t border-line py-6 text-caption text-subtle">
          © {new Date().getFullYear()} KABSHOP
        </p>
      </div>
    </footer>
  );
}
