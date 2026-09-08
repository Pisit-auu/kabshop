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

export default function Sidebar() {
  const pathname = usePathname();
  const { me } = useMe();

  return (
    <nav aria-label="เมนูบัญชี" className="u-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-canvas-2 font-display text-lead font-semibold">
          {(me?.name || me?.email || "?").charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-small font-semibold">{me?.name || me?.email}</span>
          <span className="block text-caption text-muted">
            ยอดซื้อสะสม <Money value={me?.purchaseamount ?? 0} className="!text-caption text-ink" />
          </span>
        </span>
      </div>

      <ul className="p-2">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[48px] items-center gap-3 rounded-sm px-3 text-small transition-colors duration-150 ${
                  active ? "bg-canvas-2 font-semibold text-ink" : "text-muted hover:bg-canvas-2 hover:text-ink"
                }`}
              >
                <Icon size={18} aria-hidden className={active ? "text-ink" : "text-subtle"} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
