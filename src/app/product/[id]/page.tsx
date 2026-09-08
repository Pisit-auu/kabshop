"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  CreditCard,
  Minus,
  PackageOpen,
  Plus,
  RotateCcw,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Masthead from "../../components/masthead";
import SiteFoot from "../../components/sitefoot";
import { useMe } from "../../components/me";
import { useFlash } from "../../components/flash";
import { Badge, Button, ButtonLink, Money, Notice, Shell, PageLoading } from "../../components/press";

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/posts/${params.id}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "");
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error && err.message ? err.message : "โหลดข้อมูลสินค้าไม่สำเร็จ");
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
      <div className="flex min-h-screen flex-col">
        <Masthead />
        <PageLoading label="กำลังโหลดสินค้า" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Masthead />
        <Shell width="narrow" className="flex-1 py-16">
          <Notice>{error ?? "ไม่พบสินค้าชิ้นนี้"}</Notice>
          <div className="mt-6">
            <ButtonLink href="/" tone="secondary">
              กลับไปดูสินค้าทั้งหมด
            </ButtonLink>
          </div>
        </Shell>
        <SiteFoot />
      </div>
    );
  }

  const lineTotal = (product.price ?? 0) * quantity;

  return (
    <div className="flex min-h-screen flex-col">
      <Masthead />

      <main className="flex-1">
        <Shell className="pb-20 pt-5">
          <nav aria-label="เส้นทาง" className="flex flex-wrap items-center gap-1 text-caption text-muted">
            <Link
              href="/"
              className="inline-flex min-h-[36px] items-center transition-colors duration-150 hover:text-ink"
            >
              สินค้าทั้งหมด
            </Link>
            {product.category?.name && (
              <>
                <ChevronRight size={13} aria-hidden className="text-subtle" />
                <Link
                  href={`/?cat=${encodeURIComponent(product.category.name)}`}
                  className="inline-flex min-h-[36px] items-center transition-colors duration-150 hover:text-ink"
                >
                  {product.category.name}
                </Link>
              </>
            )}
          </nav>

          <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-14">
            {/* Gallery */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-canvas-2">
              {product.img ? (
                <Image
                  src={product.img}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-subtle">
                  <PackageOpen size={44} strokeWidth={1.4} aria-hidden />
                  <p className="text-small">ยังไม่มีรูปภาพสินค้า</p>
                </div>
              )}
            </div>

            {/* Buy box */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              {product.category?.name && (
                <p className="text-micro font-medium uppercase tracking-wide text-subtle">
                  {product.category.name}
                </p>
              )}
              <h1 className="u-display mt-2 text-h3 sm:text-h2">{product.title}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Money value={product.price} className="!text-h1" />
                {stock === 0 ? (
                  <Badge tone="solid">สินค้าหมด</Badge>
                ) : stock <= 3 ? (
                  <Badge tone="sale">เหลือ {stock} ชิ้น</Badge>
                ) : (
                  <Badge tone="go">พร้อมส่ง {stock} ชิ้น</Badge>
                )}
              </div>

              {stock === 0 ? (
                <div className="mt-6">
                  <Notice tone="info">
                    สินค้าชิ้นนี้หมดชั่วคราว ลองดูสินค้าอื่นในหมวดเดียวกัน หรือกลับมาตรวจสอบอีกครั้งภายหลัง
                  </Notice>
                  <div className="mt-4">
                    <ButtonLink
                      href={product.category?.name ? `/?cat=${encodeURIComponent(product.category.name)}` : "/"}
                      tone="secondary"
                      size="lg"
                      className="w-full"
                    >
                      ดูสินค้าอื่นในหมวดนี้
                    </ButtonLink>
                  </div>
                </div>
              ) : !me ? (
                <div className="mt-6 space-y-3">
                  <ButtonLink href="/user/login" size="lg" className="w-full">
                    เข้าสู่ระบบเพื่อสั่งซื้อ
                  </ButtonLink>
                  <ButtonLink href="/user/register" tone="secondary" size="lg" className="w-full">
                    สมัครสมาชิก
                  </ButtonLink>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-small font-semibold">จำนวน</span>
                    <div className="flex items-stretch overflow-hidden rounded-sm border border-line-strong">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        aria-label="ลดจำนวน"
                        className="inline-flex h-11 w-11 items-center justify-center transition-colors duration-150 hover:bg-canvas-2 disabled:pointer-events-none disabled:text-line-strong"
                      >
                        <Minus size={16} aria-hidden />
                      </button>
                      <output
                        aria-live="polite"
                        className="u-fig flex h-11 w-14 items-center justify-center border-x border-line-strong font-display text-base font-semibold"
                      >
                        {quantity}
                      </output>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                        disabled={quantity >= stock}
                        aria-label="เพิ่มจำนวน"
                        className="inline-flex h-11 w-11 items-center justify-center transition-colors duration-150 hover:bg-canvas-2 disabled:pointer-events-none disabled:text-line-strong"
                      >
                        <Plus size={16} aria-hidden />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between gap-4 border-y border-line py-3">
                    <span className="text-small text-muted">ราคารวม</span>
                    <Money value={lineTotal} className="!text-h4" />
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    busy={busy === "buy"}
                    disabled={busy !== null}
                    onClick={() => addToCart("buy")}
                  >
                    <CreditCard size={18} aria-hidden /> ซื้อเลย
                  </Button>
                  <Button
                    tone="secondary"
                    size="lg"
                    className="w-full"
                    busy={busy === "cart"}
                    disabled={busy !== null}
                    onClick={() => addToCart("cart")}
                  >
                    <ShoppingBag size={18} aria-hidden /> ใส่ตะกร้า
                  </Button>
                </div>
              )}

              <ul className="mt-6 space-y-3 rounded border border-line bg-canvas-2 p-4">
                <li className="flex items-start gap-2.5 text-caption text-muted">
                  <Truck size={16} aria-hidden className="mt-0.5 shrink-0 text-ink" />
                  ค่าจัดส่งคงที่ ฿36 ต่อคำสั่งซื้อ ไม่ว่าจะสั่งกี่ชิ้น
                </li>
                <li className="flex items-start gap-2.5 text-caption text-muted">
                  <RotateCcw size={16} aria-hidden className="mt-0.5 shrink-0 text-ink" />
                  หากได้รับสินค้าไม่ตรงตามรายละเอียด แจ้งทางร้านได้ภายใน 7 วัน
                </li>
              </ul>
            </div>
          </div>

          <section aria-labelledby="pdp-detail" className="mt-14 border-t border-line pt-8">
            <h2 id="pdp-detail" className="u-display text-h4">
              รายละเอียดสินค้า
            </h2>
            <p className="u-measure mt-3 whitespace-pre-line text-base text-muted">
              {product.content?.trim() || "ทางร้านยังไม่ได้ระบุรายละเอียดของสินค้าชิ้นนี้"}
            </p>
          </section>
        </Shell>
      </main>

      <SiteFoot />
    </div>
  );
}
