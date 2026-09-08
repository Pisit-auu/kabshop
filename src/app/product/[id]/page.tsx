"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, CreditCard, Minus, PackageOpen, Plus, ShoppingCart, Truck } from "lucide-react";
import Masthead from "../../components/masthead";
import SiteFoot from "../../components/sitefoot";
import { useMe } from "../../components/me";
import { useFlash } from "../../components/flash";
import { Button, ButtonLink, Money, Mark, Notice, Sheet, PageLoading, inkFor } from "../../components/press";

type Product = {
  id: number;
  title: string;
  content: string | null;
  price: number | null;
  img: string | null;
  quantity: number | null;
  category?: { id: number; name: string } | null;
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const flash = useFlash();
  const { me, refresh } = useMe();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"cart" | "buy" | null>(null);

  const stock = product?.quantity ?? 0;
  const ink = useMemo(() => inkFor(product?.category?.name ?? params.id), [product, params.id]);

  useEffect(() => {
    document.documentElement.dataset.section = ink;
    return () => {
      delete document.documentElement.dataset.section;
    };
  }, [ink]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/posts/${params.id}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "");
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error && err.message ? err.message : "โหลดข้อมูลสินค้าไม่สำเร็จ");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const addToCart = useCallback(
    async (mode: "cart" | "buy") => {
      if (!product) return;
      setBusy(mode);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: product.id, quantity, mode: "add" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "เพิ่มสินค้าลงตะกร้าไม่สำเร็จ");

        await refresh();
        if (mode === "buy") {
          router.push("/cart");
        } else {
          flash("ok", `เพิ่ม “${product.title}” จำนวน ${quantity} ชิ้น ลงตะกร้าแล้ว`);
          setBusy(null);
        }
      } catch (err) {
        flash("warn", err instanceof Error ? err.message : "เพิ่มสินค้าลงตะกร้าไม่สำเร็จ");
        setBusy(null);
      }
    },
    [product, quantity, refresh, router, flash],
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <Masthead />
        <PageLoading label="กำลังเปิดหน้าสินค้า" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen">
        <Masthead />
        <Sheet width="narrow" className="py-16">
          <Notice>{error ?? "ไม่พบสินค้าชิ้นนี้"}</Notice>
          <div className="mt-6">
            <ButtonLink href="/" tone="quiet">
              กลับไปหน้าประกาศทั้งหมด
            </ButtonLink>
          </div>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Masthead />

      <main>
        <Sheet className="pb-20 pt-6">
          <nav aria-label="เส้นทาง" className="flex flex-wrap items-center gap-1 text-caption text-ink-mid">
            <Link href="/" className="inline-flex min-h-[40px] items-center underline decoration-rule-mid hover:decoration-ink">
              ประกาศทั้งหมด
            </Link>
            {product.category?.name && (
              <>
                <ChevronRight size={13} aria-hidden className="text-rule-mid" />
                <span className="font-semibold text-[var(--section-text)]">{product.category.name}</span>
              </>
            )}
          </nav>

          <div className="mt-6 grid grid-cols-1 gap-px bg-rule lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* The plate: the colour photograph, printed full. */}
            <div className="relative aspect-[4/3] w-full bg-stock lg:aspect-auto lg:min-h-[520px]">
              {product.img ? (
                <Image
                  src={product.img}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-contain p-6"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-ink-soft">
                  <PackageOpen size={44} strokeWidth={1.5} aria-hidden />
                  <p className="text-small">ยังไม่มีรูปภาพสินค้า</p>
                </div>
              )}
            </div>

            {/* The entry. */}
            <div className="flex flex-col bg-stock p-6 sm:p-10">
              {product.category?.name && (
                <p className="u-label !text-[var(--section-text)]">{product.category.name}</p>
              )}
              <h1 className="u-display mt-3 text-h3 leading-[1.15] sm:text-h2">{product.title}</h1>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Money value={product.price} className="text-h1 leading-none text-[var(--section-text)]" />
                {stock === 0 ? (
                  <Mark tone="ink">หมดชั่วคราว</Mark>
                ) : stock <= 3 ? (
                  <Mark tone="scarlet">เหลือ {stock} ชิ้น</Mark>
                ) : (
                  <Mark tone="quiet">คงเหลือ {stock} ชิ้น</Mark>
                )}
              </div>

              <p className="mt-5 flex items-center gap-2 border-y border-rule py-3 text-caption text-ink-mid">
                <Truck size={15} aria-hidden className="text-ink-soft" />
                ค่าจัดส่ง ฿36 ต่อคำสั่งซื้อ ไม่ว่าจะสั่งกี่ชิ้น
              </p>

              <div className="mt-6">
                <h2 className="u-label mb-2">รายละเอียดสินค้า</h2>
                <p className="u-measure whitespace-pre-line text-base text-ink-mid">
                  {product.content?.trim() || "ทางร้านยังไม่ได้ระบุรายละเอียดของสินค้าชิ้นนี้"}
                </p>
              </div>

              <div className="mt-auto pt-8">
                {stock === 0 ? (
                  <Notice tone="info">
                    สินค้าชิ้นนี้หมดชั่วคราว ลองดูประกาศอื่นในหมวดเดียวกัน หรือกลับมาตรวจสอบอีกครั้งภายหลัง
                  </Notice>
                ) : !me ? (
                  <div className="space-y-4">
                    <p className="text-small text-ink-mid">เข้าสู่ระบบเพื่อใส่ตะกร้าและสั่งซื้อสินค้าชิ้นนี้</p>
                    <div className="flex flex-wrap gap-2">
                      <ButtonLink href="/user/login" size="lg">
                        เข้าสู่ระบบ
                      </ButtonLink>
                      <ButtonLink href="/user/register" tone="quiet" size="lg">
                        สมัครสมาชิก
                      </ButtonLink>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="u-label">จำนวน</span>
                      <div className="flex items-stretch border border-ink">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                          aria-label="ลดจำนวน"
                          className="inline-flex h-11 w-11 items-center justify-center transition-colors duration-150 hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:text-rule-mid"
                        >
                          <Minus size={16} aria-hidden />
                        </button>
                        <output
                          aria-live="polite"
                          className="u-fig flex h-11 w-14 items-center justify-center border-x border-ink text-lead font-bold"
                        >
                          {quantity}
                        </output>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                          disabled={quantity >= stock}
                          aria-label="เพิ่มจำนวน"
                          className="inline-flex h-11 w-11 items-center justify-center transition-colors duration-150 hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:text-rule-mid"
                        >
                          <Plus size={16} aria-hidden />
                        </button>
                      </div>
                      <p className="text-small text-ink-mid">
                        รวม <Money value={(product.price ?? 0) * quantity} className="text-base text-ink" />
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Button
                        tone="quiet"
                        size="lg"
                        busy={busy === "cart"}
                        onClick={() => addToCart("cart")}
                        disabled={busy !== null}
                      >
                        <ShoppingCart size={18} aria-hidden /> ใส่ตะกร้า
                      </Button>
                      <Button
                        size="lg"
                        busy={busy === "buy"}
                        onClick={() => addToCart("buy")}
                        disabled={busy !== null}
                      >
                        <CreditCard size={18} aria-hidden /> ซื้อเลย
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Sheet>
      </main>

      <SiteFoot />
    </div>
  );
}
