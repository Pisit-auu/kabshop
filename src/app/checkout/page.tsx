"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, CreditCard, MapPin, PackageOpen, QrCode, Truck, Wallet } from "lucide-react";
import Masthead from "../components/masthead";
import SiteFoot from "../components/sitefoot";
import RequireAuth from "../components/requireauth";
import { useMe } from "../components/me";
import { useFlash } from "../components/flash";
import { Button, ButtonLink, Empty, Money, Notice, RunningHead, Sheet, PageLoading } from "../components/press";

const SHIPPING_COST = 36;

type CartLine = {
  id: number;
  value: number;
  post: { id: number; title: string; price: number | null; img: string | null; quantity: number | null };
};

const METHODS = [
  { id: "Qr", label: "QR พร้อมเพย์", note: "ทางร้านจะส่ง QR ให้หลังยืนยันคำสั่งซื้อ", Icon: QrCode },
  { id: "Cash", label: "เก็บเงินปลายทาง", note: "ชำระกับพนักงานส่งของเมื่อได้รับสินค้า", Icon: Wallet },
] as const;

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <Checkout />
    </RequireAuth>
  );
}

function Checkout() {
  const router = useRouter();
  const flash = useFlash();
  const { me, refresh } = useMe();

  const [lines, setLines] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "");
      setLines(Array.isArray(data) ? data : []);
    } catch {
      setError("โหลดตะกร้าไม่สำเร็จ กรุณารีเฟรชหน้านี้อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const subTotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.value * (line.post.price ?? 0), 0),
    [lines],
  );
  const total = subTotal + (lines.length > 0 ? SHIPPING_COST : 0);

  const missing = [
    !me?.name && "ชื่อ-นามสกุล",
    !me?.phone && "เบอร์โทรศัพท์",
    !me?.address && "ที่อยู่จัดส่ง",
  ].filter(Boolean) as string[];

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: method }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "สั่งซื้อไม่สำเร็จ");

      await refresh();
      router.push(`/bill?orderId=${encodeURIComponent(data.orderId)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "สั่งซื้อไม่สำเร็จ";
      setError(message);
      flash("warn", message);
      setSubmitting(false);
      load();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Masthead />
        <PageLoading label="กำลังเตรียมคำสั่งซื้อ" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Masthead />

      <main>
        <Sheet className="pb-20">
          <RunningHead title="ยืนยันคำสั่งซื้อ" meta="ตรวจสอบที่อยู่ รายการ และยอดชำระก่อนกดยืนยัน" />

          {lines.length === 0 ? (
            <div className="mt-8">
              <Empty
                icon={<PackageOpen size={40} strokeWidth={1.5} aria-hidden />}
                title="ไม่มีสินค้าที่จะสั่งซื้อ"
                body="ตะกร้าของคุณว่างอยู่ เลือกสินค้าก่อนจึงจะทำรายการได้"
                action={<ButtonLink href="/">ดูประกาศทั้งหมด</ButtonLink>}
              />
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-8">
                {/* Delivery */}
                <section aria-labelledby="ck-address" className="border border-rule bg-stock">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-5 py-3">
                    <h2 id="ck-address" className="flex items-center gap-2 font-display text-small font-bold">
                      <MapPin size={16} aria-hidden className="text-[var(--section-text)]" /> จัดส่งถึง
                    </h2>
                    <Link
                      href="/user/profile/information"
                      className="inline-flex min-h-[40px] items-center text-caption font-semibold underline underline-offset-4 decoration-rule-mid hover:decoration-ink"
                    >
                      แก้ไขข้อมูล
                    </Link>
                  </div>
                  <div className="px-5 py-4">
                    {missing.length > 0 ? (
                      <Notice>
                        ยังขาด {missing.join(" · ")} — กรอกให้ครบที่หน้าข้อมูลส่วนตัวก่อนจึงจะยืนยันคำสั่งซื้อได้
                      </Notice>
                    ) : (
                      <address className="not-italic">
                        <p className="text-base font-semibold">{me?.name}</p>
                        <p className="u-fig mt-1 text-small text-ink-mid">{me?.phone}</p>
                        <p className="mt-1 max-w-[52ch] whitespace-pre-line text-small text-ink-mid">{me?.address}</p>
                      </address>
                    )}
                  </div>
                </section>

                {/* Lines */}
                <section aria-labelledby="ck-items" className="border border-rule bg-stock">
                  <h2
                    id="ck-items"
                    className="flex items-center gap-2 border-b border-rule px-5 py-3 font-display text-small font-bold"
                  >
                    <Truck size={16} aria-hidden className="text-[var(--section-text)]" /> รายการสินค้า
                  </h2>
                  <ul className="divide-y divide-rule">
                    {lines.map((line) => (
                      <li key={line.id} className="flex items-center gap-4 px-5 py-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-rule bg-paper-deep">
                          {line.post.img ? (
                            <Image src={line.post.img} alt="" fill sizes="64px" className="object-cover" />
                          ) : (
                            <span className="flex h-full items-center justify-center text-ink-soft">
                              <PackageOpen size={18} strokeWidth={1.5} aria-hidden />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-small font-semibold">{line.post.title}</p>
                          <p className="u-fig mt-1 text-caption text-ink-mid">
                            {line.value} × {(line.post.price ?? 0).toLocaleString("th-TH")}
                          </p>
                        </div>
                        <Money value={line.value * (line.post.price ?? 0)} className="text-base" />
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Payment */}
                <section aria-labelledby="ck-pay" className="border border-rule bg-stock">
                  <h2
                    id="ck-pay"
                    className="flex items-center gap-2 border-b border-rule px-5 py-3 font-display text-small font-bold"
                  >
                    <CreditCard size={16} aria-hidden className="text-[var(--section-text)]" /> วิธีการชำระเงิน
                  </h2>
                  <fieldset className="p-5">
                    <legend className="sr-only">เลือกวิธีการชำระเงิน</legend>
                    <div className="grid grid-cols-1 gap-px bg-rule sm:grid-cols-2">
                      {METHODS.map(({ id, label, note, Icon }) => {
                        const active = method === id;
                        return (
                          <label
                            key={id}
                            className={`flex cursor-pointer items-start gap-3 p-4 transition-colors duration-150 ${
                              active ? "bg-[var(--section-fill)] text-[var(--section-on)]" : "bg-stock hover:bg-paper"
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={id}
                              checked={active}
                              onChange={() => setMethod(id)}
                              className="sr-only"
                            />
                            <span
                              aria-hidden
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
                                active ? "border-current" : "border-ink-soft"
                              }`}
                            >
                              {active && <span className="h-2.5 w-2.5 bg-current" />}
                            </span>
                            <span className="min-w-0">
                              <span className="flex items-center gap-2 font-display text-small font-bold">
                                <Icon size={16} aria-hidden /> {label}
                              </span>
                              <span
                                className={`mt-1 block text-caption ${active ? "opacity-85" : "text-ink-mid"}`}
                              >
                                {note}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </section>
              </div>

              {/* The box score. */}
              <aside className="lg:sticky lg:top-6 lg:self-start">
                <section aria-labelledby="ck-total" className="border-2 border-ink bg-stock">
                  <h2 id="ck-total" className="border-b border-rule px-5 py-3 font-display text-small font-bold">
                    ยอดที่ต้องชำระ
                  </h2>
                  <dl className="divide-y divide-rule px-5 text-small">
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-ink-mid">ยอดรวมสินค้า</dt>
                      <dd>
                        <Money value={subTotal} />
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-ink-mid">ค่าจัดส่ง</dt>
                      <dd>
                        <Money value={SHIPPING_COST} />
                      </dd>
                    </div>
                  </dl>
                  <div className="flex items-center justify-between gap-4 border-t-2 border-ink px-5 py-4">
                    <span className="font-display text-small font-bold">รวมสุทธิ</span>
                    <Money value={total} className="text-h3 text-[var(--section-text)]" />
                  </div>

                  <div className="space-y-3 p-5 pt-0">
                    {error && <Notice>{error}</Notice>}
                    <Button
                      size="lg"
                      className="w-full"
                      busy={submitting}
                      disabled={!method || missing.length > 0}
                      onClick={submit}
                    >
                      ยืนยันสั่งซื้อ <ChevronRight size={18} aria-hidden />
                    </Button>
                    <p className="text-caption text-ink-mid">
                      {missing.length > 0
                        ? "กรอกข้อมูลจัดส่งให้ครบก่อนจึงจะยืนยันได้"
                        : !method
                          ? "เลือกวิธีการชำระเงินก่อนจึงจะยืนยันได้"
                          : "ระบบจะตัดสต็อกและออกเลขคำสั่งซื้อเมื่อกดยืนยัน"}
                    </p>
                  </div>
                </section>
              </aside>
            </div>
          )}
        </Sheet>
      </main>

      <SiteFoot />
    </div>
  );
}
