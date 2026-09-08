"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, UserRound } from "lucide-react";
import { useMe } from "./me";
import { Money } from "./press";

const ITEMS = [
  { href: "/user/profile/information", label: "ข้อมูลส่วนตัว", Icon: UserRound },
  { href: "/user/profile/all", label: "ประวัติสั่งซื้อ", Icon: ShoppingBag },
];

/** The account index. Reads the session from context — it used to refetch it. */
export default function Sidebar() {
  const pathname = usePathname();
  const { me } = useMe();

  return (
    <nav aria-label="เมนูบัญชี" className="border border-rule bg-stock">
      <div className="border-b border-rule px-5 py-5">
        <p className="u-label">บัญชีของ</p>
        <p className="mt-1 truncate text-base font-semibold">{me?.name || me?.email}</p>
        <p className="mt-3 flex items-baseline justify-between gap-3 border-t border-dashed border-rule-mid pt-3">
          <span className="u-label">ยอดซื้อสะสม</span>
          <Money value={me?.purchaseamount ?? 0} className="text-base" />
        </p>
      </div>

      <ul>
        {ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="border-b border-rule last:border-b-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[52px] items-center gap-3 px-5 font-display text-small font-semibold transition-colors duration-150 ${
                  active
                    ? "bg-[var(--section-fill)] text-[var(--section-on)]"
                    : "text-ink hover:bg-paper"
                }`}
              >
                <Icon size={17} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
