"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Minus, PackageOpen, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import Masthead from "../components/masthead";
import SiteFoot from "../components/sitefoot";
import RequireAuth from "../components/requireauth";
import { useMe } from "../components/me";
import { useFlash } from "../components/flash";
import { Button, ButtonLink, Empty, Mark, Money, Notice, RunningHead, Sheet, Skeleton } from "../components/press";

const SHIPPING_COST = 36;

type CartLine = {
  id: number;
  postId: number;
  value: number;
  post: { id: number; title: string; price: number | null; img: string | null; quantity: number | null };
};

export default function CartPage() {
  return (
    <RequireAuth>
      <Cart />
    </RequireAuth>
  );
}

function Cart() {
  const router = useRouter();
  const flash = useFlash();
  const { me, refresh } = useMe();

  const [lines, setLines] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<number | null>(null);

  const [address, setAddress] = useState(me?.address ?? "");
  const [editingAddress, setEditingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => setAddress(me?.address ?? ""), [me?.address]);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "");
      setLines(Array.isArray(data) ? data : []);
      setError(null);
    } catch {
      setError("โหลดตะกร้าไม่สำเร็จ กรุณารีเฟรชหน้านี้อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const { subTotal, units } = useMemo(
    () =>
      lines.reduce(
        (acc, line) => ({
          subTotal: acc.subTotal + line.value * (line.post.price ?? 0),
          units: acc.units + line.value,
        }),
        { subTotal: 0, units: 0 },
      ),
    [lines],
  );

  const shipping = lines.length > 0 ? SHIPPING_COST : 0;

  const setQuantity = async (line: CartLine, next: number) => {
    setPending(line.id);
    try {
      const res =
        next <= 0
          ? await fetch(`/api/cart/${line.id}`, { method: "DELETE" })
          : await fetch(`/api/cart/${line.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ value: next }),
            });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "ปรับจำนวนไม่สำเร็จ");

      if (next <= 0) flash("ok", `นำ “${line.post.title}” ออกจากตะกร้าแล้ว`);
      await Promise.all([load(), refresh()]);
    } catch (err) {
      flash("warn", err instanceof Error ? err.message : "ปรับจำนวนไม่สำเร็จ");
    } finally {
      setPending(null);
    }
  };

  const saveAddress = async () => {
    setSavingAddress(true);
    try {
      const res = await fetch(`/api/user/${encodeURIComponent(me!.email)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "บันทึกที่อยู่ไม่สำเร็จ");
      await refresh();
      setEditingAddress(false);
      flash("ok", "บันทึกที่อยู่จัดส่งแล้ว");
    } catch (err) {
      flash("warn", err instanceof Error ? err.message : "บันทึกที่อยู่ไม่สำเร็จ");
    } finally {
      setSavingAddress(false);
    }
  };

  const overStock = lines.filter((l) => l.value > (l.post.quantity ?? 0));

  return (
    <div className="min-h-screen">
      <Masthead />

      <main>
        <Sheet className="pb-20">
          <RunningHead
            title="ตะกร้าสินค้า"
            meta={
              loading
                ? "กำลังอ่านรายการ…"
                : lines.length === 0
                  ? "ยังไม่มีสินค้าในตะกร้า"
                  : `${lines.length} รายการ · ${units} ชิ้น`
            }
          />

          {error && (
            <div className="mt-6">
              <Notice>{error}</Notice>
            </div>
          )}

          {loading ? (
            <div className="mt-8 space-y-px bg-rule">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-4 bg-stock p-4">
                  <Skeleton className="h-24 w-24 shrink-0" />
                  <div className="flex-1 space-y-3 pt-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : lines.length === 0 ? (
            <div className="mt-8">
              <Empty
                icon={<ShoppingBag size={40} strokeWidth={1.5} aria-hidden />}
                title="ตะกร้ายังว่างอยู่"
                body="เลือกสินค้าจากประกาศประจำวัน แล้วกลับมาที่หน้านี้เพื่อสรุปยอด"
                action={<ButtonLink href="/">ดูประกาศทั้งหมด</ButtonLink>}
              />
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              {/* The order lines. */}
              <section aria-label="รายการในตะกร้า">
                <ul className="space-y-px bg-rule">
                  {lines.map((line) => {
                    const stock = line.post.quantity ?? 0;
                    const busy = pending === line.id;
                    return (
                      <li key={line.id} className="flex gap-4 bg-stock p-4">
                        <Link
                          href={`/product/${line.postId}`}
                          className="relative h-24 w-24 shrink-0 overflow-hidden border border-rule bg-paper-deep"
                        >
                          {line.post.img ? (
                            <Image src={line.post.img} alt={line.post.title} fill sizes="96px" className="object-cover" />
                          ) : (
                            <span className="flex h-full items-center justify-center text-ink-soft">
                              <PackageOpen size={22} strokeWidth={1.5} aria-hidden />
                            </span>
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/product/${line.postId}`}
                                className="text-base font-semibold leading-snug hover:underline"
                              >
                                {line.post.title}
                              </Link>
                              <p className="mt-1 text-caption text-ink-mid">
                                ชิ้นละ <Money value={line.post.price} className="text-caption text-ink" />
                                {stock <= 3 && (
                                  <>
                                    {" · "}
                                    <span className="text-scarlet-text">คงเหลือ {stock} ชิ้น</span>
                                  </>
                                )}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setQuantity(line, 0)}
                              disabled={busy}
                              aria-label={`นำ ${line.post.title} ออกจากตะกร้า`}
                              className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-ink-soft transition-colors duration-150 hover:text-scarlet-text disabled:opacity-40"
                            >
                              <Trash2 size={17} aria-hidden />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-stretch border border-rule-mid">
                              <button
                                type="button"
                                onClick={() => setQuantity(line, line.value - 1)}
                                disabled={busy || line.value <= 1}
                                aria-label="ลดจำนวน"
                                className="inline-flex h-10 w-10 items-center justify-center transition-colors duration-150 hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:text-rule-mid"
                              >
                                <Minus size={15} aria-hidden />
                              </button>
                              <output className="u-fig flex h-10 w-12 items-center justify-center border-x border-rule-mid font-bold">
                                {busy ? "·" : line.value}
                              </output>
                              <button
                                type="button"
                                onClick={() => setQuantity(line, line.value + 1)}
                                disabled={busy || line.value >= stock}
                                aria-label="เพิ่มจำนวน"
                                className="inline-flex h-10 w-10 items-center justify-center transition-colors duration-150 hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:text-rule-mid"
                              >
                                <Plus size={15} aria-hidden />
                              </button>
                            </div>
                            <Money value={line.value * (line.post.price ?? 0)} className="text-h4" />
                          </div>

                          {line.value > stock && (
                            <Mark tone="scarlet">
                              เหลือ {stock} ชิ้น กรุณาลดจำนวนก่อนชำระเงิน
                            </Mark>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* The box score. */}
              <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                <section aria-labelledby="cart-address" className="border border-rule bg-stock">
                  <h2
                    id="cart-address"
                    className="flex items-center gap-2 border-b border-rule px-5 py-3 font-display text-small font-bold"
                  >
                    <MapPin size={16} aria-hidden className="text-[var(--section-text)]" /> ที่อยู่จัดส่ง
                  </h2>
                  <div className="p-5">
                    {editingAddress ? (
                      <div className="space-y-3">
                        <label htmlFor="cart-address-field" className="sr-only">
                          ที่อยู่จัดส่ง
                        </label>
                        <textarea
                          id="cart-address-field"
                          rows={4}
                          value={address}
                          autoFocus
                          onChange={(e) => setAddress(e.target.value)}
                          className="u-field resize-y !text-small"
                          placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" busy={savingAddress} onClick={saveAddress} className="flex-1">
                            บันทึก
                          </Button>
                          <Button
                            size="sm"
                            tone="quiet"
                            onClick={() => {
                              setAddress(me?.address ?? "");
                              setEditingAddress(false);
                            }}
                            className="flex-1"
                          >
                            ยกเลิก
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className={`text-small ${me?.address ? "text-ink-mid" : "text-ink-soft"}`}>
                          {me?.address || "ยังไม่ได้ระบุที่อยู่จัดส่ง — ต้องกรอกก่อนจึงจะชำระเงินได้"}
                        </p>
                        <button
                          type="button"
                          onClick={() => setEditingAddress(true)}
                          className="mt-1 inline-flex min-h-[40px] items-center text-caption font-semibold text-[var(--section-text)] underline underline-offset-4"
                        >
                          {me?.address ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่จัดส่ง"}
                        </button>
                      </>
                    )}
                  </div>
                </section>

                <section aria-labelledby="cart-summary" className="border border-rule bg-stock">
                  <h2 id="cart-summary" className="border-b border-rule px-5 py-3 font-display text-small font-bold">
                    สรุปคำสั่งซื้อ
                  </h2>
                  <dl className="divide-y divide-rule px-5 text-small">
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-ink-mid">ราคาสินค้า ({units} ชิ้น)</dt>
                      <dd>
                        <Money value={subTotal} />
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="flex items-center gap-1.5 text-ink-mid">
                        <Truck size={14} aria-hidden className="text-ink-soft" /> ค่าจัดส่ง
                      </dt>
                      <dd>
                        <Money value={shipping} />
                      </dd>
                    </div>
                  </dl>
                  <div className="flex items-center justify-between gap-4 border-t-2 border-ink px-5 py-4">
                    <span className="font-display text-small font-bold">ยอดชำระสุทธิ</span>
                    <Money value={subTotal + shipping} className="text-h3 text-[var(--section-text)]" />
                  </div>
                  <div className="p-5 pt-0">
                    {overStock.length > 0 && (
                      <div className="mb-3">
                        <Notice>ปรับจำนวนสินค้าที่เกินสต็อกก่อน จึงจะไปหน้าชำระเงินได้</Notice>
                      </div>
                    )}
                    <Button
                      size="lg"
                      className="w-full"
                      disabled={lines.length === 0 || overStock.length > 0}
                      onClick={() => router.push("/checkout")}
                    >
                      ไปที่หน้าชำระเงิน
                    </Button>
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
