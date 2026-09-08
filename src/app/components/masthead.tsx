"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { LogOut, Menu, Package, Search, ShoppingBag, Truck, UserRound, X } from "lucide-react";
import { useMe } from "./me";

/**
 * The store header. One component for every reader: signed out, member and
 * shopkeeper. Search lives here and drives the catalogue through the URL, so a
 * filtered view is shareable and the back button works.
 */
export default function Masthead() {
  return (
    <Suspense fallback={<HeaderShell />}>
      <Header />
    </Suspense>
  );
}

function HeaderShell() {
  return <header className="h-[112px] border-b border-line bg-surface sm:h-[124px]" />;
}

function Header() {
  const { me, cartCount, loading } = useMe();
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState(params.get("q") ?? "");

  useEffect(() => setQuery(params.get("q") ?? ""), [params]);
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(pathname === "/" ? params.toString() : "");
    const q = query.trim();
    if (q) next.set("q", q);
    else next.delete("q");
    router.push(next.toString() ? `/?${next}` : "/");
  };

  return (
    <>
      <p className="flex items-center justify-center gap-2 bg-brand px-4 py-2 text-center text-micro font-medium text-brand-on">
        <Truck size={14} aria-hidden className="shrink-0" />
        ส่งทั่วไทย ค่าจัดส่งคงที่ ฿36 ต่อคำสั่งซื้อ ไม่ว่าจะสั่งกี่ชิ้น
      </p>

      <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto w-full max-w-shell px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="เปิดเมนู"
              aria-expanded={menuOpen}
              className="-ml-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-ink transition-colors duration-150 hover:bg-canvas-2 lg:hidden"
            >
              <Menu size={22} aria-hidden />
            </button>

            <Link href="/" className="flex shrink-0 items-center gap-2.5 py-2">
              <Image src="/KAB.png" alt="" width={34} height={34} className="object-contain" priority />
              <span className="u-display text-h4 font-bold tracking-[-0.02em]">KABSHOP</span>
            </Link>

            <form onSubmit={submitSearch} role="search" className="relative hidden flex-1 lg:block">
              <label htmlFor="site-search" className="sr-only">
                ค้นหาสินค้า
              </label>
              <Search
                size={18}
                aria-hidden
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
              />
              <input
                id="site-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาสินค้าที่ต้องการ"
                className="u-field !rounded-full !bg-canvas-2 !pl-11 !pr-4 !text-small"
              />
            </form>

            <nav aria-label="บัญชีของฉัน" className="ml-auto flex shrink-0 items-center gap-1">
              {loading ? (
                <span className="h-11 w-24 rounded-sm bg-canvas-2" aria-hidden />
              ) : me ? (
                <>
                  <Link
                    href="/user/profile/information"
                    className="hidden h-11 max-w-[180px] items-center gap-2 rounded-sm px-3 text-small font-medium transition-colors duration-150 hover:bg-canvas-2 sm:inline-flex"
                  >
                    <UserRound size={19} aria-hidden />
                    <span className="truncate">{me.name || me.email}</span>
                  </Link>
                  <Link
                    href="/cart"
                    aria-label={`ตะกร้าสินค้า ${cartCount} รายการ`}
                    className="relative inline-flex h-11 w-11 items-center justify-center rounded-sm transition-colors duration-150 hover:bg-canvas-2"
                  >
                    <ShoppingBag size={20} aria-hidden />
                    {cartCount > 0 && (
                      <span className="u-fig absolute right-1 top-1 min-w-[18px] rounded-full bg-sale px-1 text-center text-[11px] font-bold leading-[18px] text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    aria-label="ออกจากระบบ"
                    className="hidden h-11 w-11 items-center justify-center rounded-sm transition-colors duration-150 hover:bg-canvas-2 sm:inline-flex"
                  >
                    <LogOut size={19} aria-hidden />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/user/login"
                    className="inline-flex h-11 items-center rounded-sm px-3 text-small font-medium transition-colors duration-150 hover:bg-canvas-2"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/user/register"
                    className="inline-flex h-11 items-center whitespace-nowrap rounded-sm bg-brand px-4 font-display text-small font-semibold text-brand-on transition-colors duration-200 hover:bg-[var(--brand-hover)]"
                  >
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Mobile search sits on its own row rather than hiding behind an icon. */}
          <form onSubmit={submitSearch} role="search" className="relative pb-3 lg:hidden">
            <label htmlFor="site-search-sm" className="sr-only">
              ค้นหาสินค้า
            </label>
            <Search
              size={18}
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
            />
            <input
              id="site-search-sm"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาสินค้าที่ต้องการ"
              className="u-field !rounded-full !bg-canvas-2 !pl-11 !pr-4 !text-small"
            />
          </form>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            aria-label="ปิดเมนู"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-ink/45"
          />
          <nav
            aria-label="เมนูหลัก"
            className="absolute inset-y-0 left-0 flex w-[min(320px,86vw)] flex-col bg-surface animate-slide-down"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="u-display text-h4 font-bold">เมนู</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="ปิดเมนู"
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm transition-colors duration-150 hover:bg-canvas-2"
              >
                <X size={19} aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <MenuLink href="/" active={pathname === "/"} icon={<Package size={18} />}>
                สินค้าทั้งหมด
              </MenuLink>
              {me ? (
                <>
                  <MenuLink href="/cart" active={pathname === "/cart"} icon={<ShoppingBag size={18} />}>
                    ตะกร้าสินค้า {cartCount > 0 && <span className="u-fig text-muted">({cartCount})</span>}
                  </MenuLink>
                  <MenuLink
                    href="/user/profile/all"
                    active={pathname === "/user/profile/all"}
                    icon={<Truck size={18} />}
                  >
                    ประวัติสั่งซื้อ
                  </MenuLink>
                  <MenuLink
                    href="/user/profile/information"
                    active={pathname === "/user/profile/information"}
                    icon={<UserRound size={18} />}
                  >
                    ข้อมูลส่วนตัว
                  </MenuLink>
                  {me.role === "admin" && (
                    <MenuLink href="/admin" active={pathname === "/admin"} icon={<Package size={18} />}>
                      จัดการร้าน
                    </MenuLink>
                  )}
                </>
              ) : (
                <>
                  <MenuLink href="/user/login" active={pathname === "/user/login"} icon={<UserRound size={18} />}>
                    เข้าสู่ระบบ
                  </MenuLink>
                  <MenuLink
                    href="/user/register"
                    active={pathname === "/user/register"}
                    icon={<UserRound size={18} />}
                  >
                    สมัครสมาชิก
                  </MenuLink>
                </>
              )}
            </div>

            {me && (
              <div className="border-t border-line p-3">
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex min-h-[44px] w-full items-center gap-3 rounded-sm px-3 text-small font-medium text-sale-text transition-colors duration-150 hover:bg-sale-soft"
                >
                  <LogOut size={18} aria-hidden /> ออกจากระบบ
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

function MenuLink({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[48px] items-center gap-3 rounded-sm px-3 text-base transition-colors duration-150 ${
        active ? "bg-canvas-2 font-semibold text-ink" : "text-ink hover:bg-canvas-2"
      }`}
    >
      <span className="text-subtle" aria-hidden>
        {icon}
      </span>
      {children}
    </Link>
  );
}
