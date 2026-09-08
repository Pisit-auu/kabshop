"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { LogOut, Menu, ShoppingCart, UserRound, X, Wrench } from "lucide-react";
import { useMe } from "./me";

const EDITION_DATE = new Intl.DateTimeFormat("th-TH", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * The masthead. One component for every reader of the paper: signed out,
 * signed in, and the shopkeeper — the app used to ship three separate navbars
 * that disagreed about the brand.
 *
 * `size="full"` prints the front-page masthead; inner pages take the strip.
 */
export default function Masthead({ size = "strip" }: { size?: "full" | "strip" }) {
  const { me, cartCount, loading } = useMe();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState("");

  // Rendered after mount: the server and the reader are rarely in the same day.
  useEffect(() => setToday(EDITION_DATE.format(new Date())), []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="bg-ink text-paper">
        <div className="mx-auto w-full max-w-sheet px-4 sm:px-6">
          {/* Flag line: the paper's standing facts. */}
          <div className="flex items-center justify-between gap-4 border-b border-white/15 py-2">
            <p className="u-label !text-white/60 truncate">{today || " "}</p>
            <p className="u-label !text-white/60 hidden sm:block">ส่งทั่วไทย · ค่าส่ง ฿36 ต่อคำสั่งซื้อ</p>
          </div>

          <div
            className={
              size === "full"
                ? "relative flex flex-col items-center gap-4 py-6"
                : "flex items-center justify-between gap-3 py-3"
            }
          >
            <div
              className={
                size === "full"
                  ? "flex w-full items-center justify-center"
                  : "flex min-w-0 items-center gap-3"
              }
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="เปิดสารบัญ"
                aria-expanded={open}
                className={`inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/25 transition-colors duration-150 hover:bg-white/10 ${
                  size === "full" ? "absolute left-0 top-0" : ""
                }`}
              >
                <Menu size={20} aria-hidden />
              </button>

              {/* On the front page the masthead is the page's heading, the way a
                  paper's nameplate is. Inner pages carry their own h1. */}
              <Wordmark as={size === "full" ? "h1" : "span"} size={size} />
            </div>

            {size === "full" && (
              <p className="mx-auto max-w-[52ch] text-center text-caption text-white/65">
                ประกาศขายสินค้าประจำวัน — รวมทุกหมวดไว้ในหน้าเดียว
              </p>
            )}

            <nav
              aria-label="บัญชีของฉัน"
              className={`flex shrink-0 items-center gap-2 ${
                size === "full" ? "justify-center sm:absolute sm:right-0 sm:top-0" : "justify-end"
              }`}
            >
              {loading ? (
                <span className="h-11 w-28 bg-white/10" aria-hidden />
              ) : me ? (
                <>
                  <Link
                    href="/cart"
                    className="inline-flex h-11 items-center gap-2 border border-white/25 px-2.5 transition-colors duration-150 hover:bg-white/10 sm:px-3"
                  >
                    <ShoppingCart size={18} aria-hidden />
                    <span className="hidden text-caption font-semibold sm:inline">ตะกร้า</span>
                    <span className="u-fig min-w-[22px] bg-[var(--section-fill)] px-1 text-center text-[12px] font-bold leading-[18px] text-[var(--section-on)]">
                      {cartCount}
                    </span>
                    <span className="sr-only">รายการในตะกร้า</span>
                  </Link>
                  <Link
                    href="/user/profile/information"
                    aria-label="ข้อมูลส่วนตัว"
                    className="inline-flex h-11 max-w-[190px] items-center justify-center gap-2 border border-white/25 px-2.5 transition-colors duration-150 hover:bg-white/10 sm:px-3"
                  >
                    <UserRound size={18} aria-hidden />
                    <span className="hidden truncate text-caption font-semibold sm:inline">
                      {me.name || me.email}
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    aria-label="ออกจากระบบ"
                    className="inline-flex h-11 w-11 items-center justify-center border border-white/25 transition-colors duration-150 hover:bg-white/10"
                  >
                    <LogOut size={18} aria-hidden />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/user/login"
                    className="inline-flex h-11 items-center px-3 text-small font-semibold underline underline-offset-4 decoration-white/40 transition-colors duration-150 hover:decoration-white"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/user/register"
                    className="inline-flex h-11 items-center whitespace-nowrap bg-[var(--section-fill)] px-3 font-display text-small font-semibold text-[var(--section-on)] transition-shadow duration-150 hover:shadow-[inset_0_-3px_0_rgba(0,0,0,0.34)] sm:px-4"
                  >
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* The flash rule: the live section ink, printed across the full width. */}
        <div className="flex" aria-hidden>
          <div className="h-2 w-1/3 bg-[var(--section-fill)] transition-colors duration-300 ease-press" />
          <div className="h-2 flex-1 bg-paper-deep" />
        </div>
      </header>

      {/* The index drawer. */}
      {open && (
        <div className="fixed inset-0 z-[90]">
          <button
            type="button"
            aria-label="ปิดสารบัญ"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-ink/55"
          />
          <nav
            aria-label="สารบัญ"
            className="absolute inset-y-0 left-0 flex w-[min(340px,86vw)] flex-col bg-paper animate-flash-in"
          >
            <div className="flex items-center justify-between bg-ink px-5 py-4 text-paper">
              <span className="u-display text-h4 font-black tracking-[-0.02em]">สารบัญ</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="ปิดสารบัญ"
                className="inline-flex h-10 w-10 items-center justify-center border border-white/25 transition-colors duration-150 hover:bg-white/10"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <p className="u-label mb-3">หน้าร้าน</p>
              <IndexLink href="/" active={pathname === "/"}>หน้าแรก</IndexLink>

              {me ? (
                <>
                  <p className="u-label mb-3 mt-8">บัญชีของฉัน</p>
                  <IndexLink href="/cart" active={pathname === "/cart"}>
                    ตะกร้าสินค้า <span className="u-fig text-ink-mid">({cartCount})</span>
                  </IndexLink>
                  <IndexLink href="/user/profile/all" active={pathname === "/user/profile/all"}>ประวัติสั่งซื้อ</IndexLink>
                  <IndexLink href="/user/profile/information" active={pathname === "/user/profile/information"}>ข้อมูลส่วนตัว</IndexLink>

                  {me.role === "admin" && (
                    <>
                      <p className="u-label mb-3 mt-8">หลังร้าน</p>
                      <IndexLink href="/admin" active={pathname === "/admin"}>
                        <Wrench size={16} aria-hidden /> จัดการร้าน
                      </IndexLink>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="u-label mb-3 mt-8">บัญชี</p>
                  <IndexLink href="/user/login" active={pathname === "/user/login"}>เข้าสู่ระบบ</IndexLink>
                  <IndexLink href="/user/register" active={pathname === "/user/register"}>สมัครสมาชิก</IndexLink>
                </>
              )}
            </div>

            {me && (
              <div className="border-t border-rule p-5">
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 border border-scarlet px-4 font-display text-small font-semibold text-scarlet-text transition-colors duration-150 hover:bg-scarlet hover:text-white"
                >
                  <LogOut size={16} aria-hidden /> ออกจากระบบ
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

function Wordmark({ as: As, size }: { as: "h1" | "span"; size: "full" | "strip" }) {
  return (
    <As className="min-w-0">
      <Link href="/" className="group flex min-w-0 items-center gap-3 py-2">
        <Image
          src="/KAB.png"
          alt=""
          width={size === "full" ? 56 : 34}
          height={size === "full" ? 56 : 34}
          className={`object-contain ${size === "full" ? "" : "hidden sm:block"}`}
          priority
        />
        <span
          className={`u-display font-black leading-none tracking-[-0.035em] ${
            size === "full" ? "text-masthead" : "text-h4 sm:text-h3"
          }`}
        >
          KABSHOP
        </span>
      </Link>
    </As>
  );
}

function IndexLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[46px] items-center gap-2 border-b border-rule text-base transition-colors duration-150 ${
        active ? "font-semibold text-[var(--section-text)]" : "text-ink hover:text-[var(--section-text)]"
      }`}
    >
      {children}
    </Link>
  );
}
