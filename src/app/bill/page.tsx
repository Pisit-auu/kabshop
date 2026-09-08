"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Printer } from "lucide-react";
import Masthead from "../components/masthead";
import SiteFoot from "../components/sitefoot";
import RequireAuth from "../components/requireauth";
import { Button, ButtonLink, Money, Notice, Sheet, PageLoading } from "../components/press";

const SHIPPING_COST = 36;

type Receipt = {
  orderId: string;
  createdAt: string;
  recipient: { name: string | null; phone: string | null; address: string | null };
  items: { postId: number; title: string; quantity: number; totalPrice: number }[];
};

export default function BillPage() {
  return (
    <RequireAuth>
      <Suspense
        fallback={
          <div className="min-h-screen">
            <Masthead />
            <PageLoading label="กำลังออกใบสั่งซื้อ" />
          </div>
        }
      >
        <Bill />
      </Suspense>
    </RequireAuth>
  );
}

function Bill() {
  const orderId = useSearchParams().get("orderId");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!orderId) {
      setError("ไม่ได้ระบุหมายเลขคำสั่งซื้อ");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/order/${encodeURIComponent(orderId)}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "");
      setReceipt(data);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "โหลดคำสั่งซื้อไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Masthead />
        <PageLoading label="กำลังออกใบสั่งซื้อ" />
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen">
        <Masthead />
        <Sheet width="narrow" className="py-16">
          <Notice>{error ?? "ไม่พบคำสั่งซื้อนี้"}</Notice>
          <div className="mt-6 flex gap-2">
            <ButtonLink href="/user/profile/all" tone="quiet">
              ดูประวัติสั่งซื้อ
            </ButtonLink>
            <ButtonLink href="/">กลับหน้าแรก</ButtonLink>
          </div>
        </Sheet>
        <SiteFoot />
      </div>
    );
  }

  const subTotal = receipt.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const grandTotal = subTotal + SHIPPING_COST;
  const placedAt = new Date(receipt.createdAt).toLocaleString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen">
      <Masthead />

      <main>
        <Sheet width="narrow" className="pb-20 pt-10">
          {/* The receipt: a printed document of record, torn from the sheet. */}
          <article className="bg-stock border-x border-rule">
            <div className="h-1 border-t-2 border-dashed border-rule-mid" aria-hidden />

            <header className="bg-[var(--jade)] px-6 py-8 text-center text-white sm:px-10">
              <CheckCircle2 size={36} strokeWidth={2} aria-hidden className="mx-auto" />
              <h1 className="u-display mt-3 text-h2 leading-tight">รับคำสั่งซื้อแล้ว</h1>
              <p className="mt-2 text-small text-white/85">
                ทางร้านได้รับคำสั่งซื้อของคุณเรียบร้อย และจะติดต่อกลับเพื่อยืนยันการจัดส่ง
              </p>
            </header>

            <div className="px-6 py-8 sm:px-10">
              <dl className="grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-2">
                <div className="bg-stock px-4 py-3">
                  <dt className="u-label">หมายเลขคำสั่งซื้อ</dt>
                  <dd className="u-fig mt-1 text-h4 font-bold">{receipt.orderId}</dd>
                </div>
                <div className="bg-stock px-4 py-3">
                  <dt className="u-label">วันที่สั่งซื้อ</dt>
                  <dd className="mt-1 text-small font-semibold">{placedAt}</dd>
                </div>
              </dl>

              {receipt.recipient.name && (
                <section className="mt-6">
                  <h2 className="u-label mb-2">จัดส่งถึง</h2>
                  <address className="not-italic text-small text-ink-mid">
                    <span className="block font-semibold text-ink">{receipt.recipient.name}</span>
                    {receipt.recipient.phone && <span className="u-fig mt-1 block">{receipt.recipient.phone}</span>}
                    {receipt.recipient.address && (
                      <span className="mt-1 block whitespace-pre-line">{receipt.recipient.address}</span>
                    )}
                  </address>
                </section>
              )}

              <section className="mt-8">
                <h2 className="u-label mb-3">รายการสินค้า</h2>
                <ul className="border-y-2 border-ink">
                  {receipt.items.map((item) => (
                    <li
                      key={item.postId}
                      className="flex items-start justify-between gap-4 border-b border-dashed border-rule-mid py-3 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="text-small font-semibold">{item.title}</p>
                        <p className="mt-0.5 text-caption text-ink-mid">
                          จำนวน <span className="u-fig">{item.quantity}</span> ชิ้น
                        </p>
                      </div>
                      <Money value={item.totalPrice} className="text-base" />
                    </li>
                  ))}
                </ul>
              </section>

              <dl className="mt-6 text-small">
                <div className="flex justify-between gap-4 py-2">
                  <dt className="text-ink-mid">ราคารวมสินค้า</dt>
                  <dd>
                    <Money value={subTotal} />
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-rule py-2">
                  <dt className="text-ink-mid">ค่าจัดส่ง</dt>
                  <dd>
                    <Money value={SHIPPING_COST} />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b-2 border-ink py-4">
                  <dt className="font-display text-base font-bold">ยอดรวมสุทธิ</dt>
                  <dd>
                    <Money value={grandTotal} className="text-h2 text-[var(--jade-text)]" />
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-2 print:hidden">
                <ButtonLink href="/" tone="ink" size="lg" className="flex-1">
                  เลือกซื้อสินค้าต่อ
                </ButtonLink>
                <Button tone="quiet" size="lg" onClick={() => window.print()}>
                  <Printer size={17} aria-hidden /> พิมพ์
                </Button>
              </div>

              <p className="mt-6 text-caption text-ink-soft">
                เก็บหมายเลขคำสั่งซื้อไว้อ้างอิงเมื่อติดต่อทางร้าน ดูรายการทั้งหมดได้ที่{" "}
                <a
                  href="/user/profile/all"
                  className="font-semibold underline decoration-rule-mid underline-offset-4 hover:decoration-ink"
                >
                  ประวัติสั่งซื้อ
                </a>
              </p>
            </div>

            <div className="h-1 border-b-2 border-dashed border-rule-mid" aria-hidden />
          </article>
        </Sheet>
      </main>

      <SiteFoot />
    </div>
  );
}
