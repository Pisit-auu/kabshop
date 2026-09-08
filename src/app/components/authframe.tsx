import Link from "next/link";
import Image from "next/image";

/**
 * The subscription counter: the paper's name printed on one side, the form on
 * the other. Shared by sign-in and sign-up so the two never drift apart again.
 */
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
    <main className="min-h-screen lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,9fr)]">
      <section className="flex flex-col justify-between bg-ink px-6 py-8 text-paper sm:px-10 lg:py-12">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/KAB.png" alt="" width={40} height={40} className="object-contain" priority />
          <span className="u-display text-h3 font-black tracking-[-0.03em]">KABSHOP</span>
        </Link>

        <div className="my-10 lg:my-0">
          <p className="u-display max-w-[16ch] text-h2 leading-[1.05] lg:text-h1">
            ทุกหมวดสินค้า อยู่ในหน้าเดียว
          </p>
          <p className="mt-4 max-w-[40ch] text-small text-white/70">
            สมัครสมาชิกครั้งเดียว ใช้สั่งซื้อ ติดตามคำสั่งซื้อ และเก็บที่อยู่จัดส่งไว้ใช้ครั้งต่อไป
          </p>
        </div>

        <p className="u-label !text-white/45">ค่าจัดส่งคงที่ ฿36 ต่อคำสั่งซื้อ</p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          <h1 className="u-display text-h2">{title}</h1>
          <p className="mt-2 text-small text-ink-mid">{intro}</p>
          <div className="mt-4 flex" aria-hidden>
            <div className="h-[3px] w-16 bg-[var(--section-fill)]" />
            <div className="h-[3px] flex-1 bg-ink" />
          </div>

          <div className="mt-8">{children}</div>

          <p className="mt-8 border-t border-rule pt-6 text-small text-ink-mid">{foot}</p>
        </div>
      </section>
    </main>
  );
}
