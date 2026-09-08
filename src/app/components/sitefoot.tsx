import Link from "next/link";

/** The paper's colophon: the standing facts, printed once at the foot. */
export default function SiteFoot() {
  return (
    <footer className="border-t-2 border-ink bg-paper-deep">
      <div className="mx-auto w-full max-w-sheet px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <p className="u-display text-h4 font-black tracking-[-0.02em]">KABSHOP</p>
            <p className="mt-2 max-w-[46ch] text-small text-ink-mid">
              ร้านค้าออนไลน์รวมสินค้าหลายหมวด ค่าจัดส่งคงที่ ฿36 ต่อหนึ่งคำสั่งซื้อ
              ชำระผ่าน QR พร้อมเพย์ หรือเก็บเงินปลายทาง
            </p>
          </div>
          <nav aria-label="ลิงก์ท้ายหน้า" className="flex flex-col gap-2">
            <Link href="/" className="inline-flex min-h-[40px] items-center text-small underline decoration-rule-mid hover:decoration-ink">
              หน้าแรก
            </Link>
            <Link href="/cart" className="inline-flex min-h-[40px] items-center text-small underline decoration-rule-mid hover:decoration-ink">
              ตะกร้าสินค้า
            </Link>
            <Link href="/user/profile/all" className="inline-flex min-h-[40px] items-center text-small underline decoration-rule-mid hover:decoration-ink">
              ประวัติสั่งซื้อ
            </Link>
          </nav>
        </div>
        <p className="mt-10 border-t border-rule-mid pt-4 text-caption text-ink-soft">
          © {new Date().getFullYear()} KABSHOP
        </p>
      </div>
    </footer>
  );
}
