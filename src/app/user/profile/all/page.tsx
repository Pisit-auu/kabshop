"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PackageOpen, ShoppingBag } from "lucide-react";
import Masthead from "../../../components/masthead";
import SiteFoot from "../../../components/sitefoot";
import Sidebar from "../../../components/sidebar";
import RequireAuth from "../../../components/requireauth";
import { ButtonLink, Empty, Money, Notice, PageHead, Shell, Skeleton } from "../../../components/press";

const SHIPPING_COST = 36;

type Order = {
  orderId: string;
  createdAt: string;
  items: { postId: number; quantity: number; totalPrice: number; post: { title: string; img: string | null } }[];
};

export default function OrdersPage() {
  return (
    <RequireAuth>
      <Orders />
    </RequireAuth>
  );
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/getorder", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "");
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError("โหลดประวัติสั่งซื้อไม่สำเร็จ กรุณารีเฟรชหน้านี้อีกครั้ง");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Masthead />

      <main>
        <Shell className="pb-20">
          <PageHead
            title="ประวัติสั่งซื้อ"
            meta={
              loading
                ? "กำลังอ่านรายการ…"
                : orders.length === 0
                  ? "ยังไม่มีคำสั่งซื้อ"
                  : `${orders.length} คำสั่งซื้อ`
            }
          />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="lg:sticky lg:top-6 lg:self-start">
              <Sidebar />
            </div>

            <div className="space-y-6">
              {error && <Notice>{error}</Notice>}

              {loading ? (
                [0, 1].map((i) => (
                  <div key={i} className="border border-line bg-surface p-5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="mt-4 h-16 w-full" />
                  </div>
                ))
              ) : orders.length === 0 ? (
                <Empty
                  icon={<ShoppingBag size={40} strokeWidth={1.5} aria-hidden />}
                  title="ยังไม่มีคำสั่งซื้อ"
                  body="เมื่อคุณสั่งซื้อสำเร็จ รายการจะถูกเก็บไว้ที่นี่พร้อมหมายเลขคำสั่งซื้อ"
                  action={<ButtonLink href="/">เริ่มเลือกซื้อสินค้า</ButtonLink>}
                />
              ) : (
                orders.map((order) => {
                  const itemsTotal = order.items.reduce((sum, i) => sum + i.totalPrice, 0);
                  return (
                    <article key={order.orderId} className="border border-line bg-surface">
                      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-canvas-2 px-5 py-3">
                        <div>
                          <span className="u-label">หมายเลขคำสั่งซื้อ</span>
                          <p className="u-fig text-base font-bold">{order.orderId}</p>
                        </div>
                        <div className="text-right">
                          <span className="u-label">วันที่</span>
                          <p className="text-small font-semibold">
                            {new Date(order.createdAt).toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </header>

                      <ul className="divide-y divide-line">
                        {order.items.map((item) => (
                          <li key={item.postId} className="flex items-center gap-4 px-5 py-4">
                            <Link
                              href={`/product/${item.postId}`}
                              className="relative h-16 w-16 shrink-0 overflow-hidden border border-line bg-canvas-2"
                            >
                              {item.post.img ? (
                                <Image src={item.post.img} alt="" fill sizes="64px" className="object-cover" />
                              ) : (
                                <span className="flex h-full items-center justify-center text-subtle">
                                  <PackageOpen size={18} strokeWidth={1.5} aria-hidden />
                                </span>
                              )}
                            </Link>
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/product/${item.postId}`}
                                className="flex min-h-[40px] items-center truncate text-small font-semibold hover:underline"
                              >
                                {item.post.title}
                              </Link>
                              <p className="mt-1 text-caption text-muted">
                                จำนวน <span className="u-fig">{item.quantity}</span> ชิ้น
                              </p>
                            </div>
                            <Money value={item.totalPrice} className="text-base" />
                          </li>
                        ))}
                      </ul>

                      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas px-5 py-4">
                        <p className="text-caption text-muted">
                          รวมค่าจัดส่ง <span className="u-fig">฿{SHIPPING_COST}</span> แล้ว
                        </p>
                        <div className="flex items-baseline gap-3">
                          <span className="u-label">ยอดสุทธิ</span>
                          <Money value={itemsTotal + SHIPPING_COST} className="text-h3" />
                        </div>
                      </footer>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </Shell>
      </main>

      <SiteFoot />
    </div>
  );
}
