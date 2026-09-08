"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PackageOpen, SlidersHorizontal, X } from "lucide-react";
import { Badge, Money, Empty, Notice, Skeleton } from "./press";

type Category = { id: number; name: string; _count?: { posts: number } };
type Product = {
  id: number;
  title: string;
  price: number | null;
  img: string | null;
  quantity: number | null;
  category?: { name: string } | null;
};

type Sort = "new" | "price-asc" | "price-desc";

const SORTS: { id: Sort; label: string }[] = [
  { id: "new", label: "สินค้าใหม่ล่าสุด" },
  { id: "price-asc", label: "ราคาต่ำไปสูง" },
  { id: "price-desc", label: "ราคาสูงไปต่ำ" },
];

/**
 * The catalogue. Category and search live in the URL, so a filtered view is
 * shareable and the browser's back button behaves the way shoppers expect.
 */
export default function Rack({ hrefBase = "/product" }: { hrefBase?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const category = params.get("cat") ?? "";
  const search = params.get("q") ?? "";
  const sort = (params.get("sort") as Sort) || "new";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.replace(next.toString() ? `${pathname}?${next}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/categories")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error())))
      .then((data) => !cancelled && setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const query = new URLSearchParams({ category, search }).toString();
    fetch(`/api?${query}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error())))
      .then((data) => !cancelled && setProducts(Array.isArray(data) ? data : []))
      .catch(() => {
        if (cancelled) return;
        setError("โหลดรายการสินค้าไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        setProducts([]);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [category, search]);

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "price-asc") list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === "price-desc") list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return list;
  }, [products, sort]);

  const filtered = Boolean(category || search);

  return (
    <section aria-labelledby="catalogue-heading">
      {/* Category rail. Scrolls sideways on a phone rather than wrapping into
          an unpredictable number of rows. */}
      <nav aria-label="หมวดสินค้า" className="-mx-4 px-4 sm:mx-0 sm:px-0">
        <ul className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <li>
            <Chip active={category === ""} onSelect={() => setParam("cat", "")}>
              ทั้งหมด
            </Chip>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Chip
                active={category === c.name}
                count={c._count?.posts}
                onSelect={() => setParam("cat", category === c.name ? "" : c.name)}
              >
                {c.name}
              </Chip>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line pb-4">
        <div className="min-w-0">
          <h2 id="catalogue-heading" className="u-display text-h3">
            {category || (search ? `ผลการค้นหา “${search}”` : "สินค้าทั้งหมด")}
          </h2>
          <p className="mt-1 text-small text-muted" aria-live="polite">
            {loading ? (
              "กำลังโหลด…"
            ) : (
              <>
                <span className="u-fig font-semibold text-ink">{sorted.length}</span> รายการ
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {filtered && (
            <button
              type="button"
              onClick={() => router.replace(pathname, { scroll: false })}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-sm px-2.5 text-caption font-medium text-muted transition-colors duration-150 hover:bg-canvas-2 hover:text-ink"
            >
              <X size={14} aria-hidden /> ล้างตัวกรอง
            </button>
          )}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} aria-hidden className="text-subtle" />
            <label htmlFor="rack-sort" className="sr-only">
              เรียงลำดับสินค้า
            </label>
            <select
              id="rack-sort"
              value={sort}
              onChange={(e) => setParam("sort", e.target.value === "new" ? "" : e.target.value)}
              className="u-field !min-h-[40px] !w-auto !border-line !py-1.5 !text-caption"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6">
          <Notice>{error}</Notice>
        </div>
      )}

      {loading ? (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i}>
              <Skeleton className="aspect-square w-full !rounded" />
              <Skeleton className="mt-3 h-4 w-4/5" />
              <Skeleton className="mt-2 h-4 w-2/5" />
              <Skeleton className="mt-3 h-5 w-1/2" />
            </li>
          ))}
          <li className="sr-only">กำลังโหลดรายการสินค้า</li>
        </ul>
      ) : sorted.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {sorted.map((product, i) => (
            <li key={product.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 9) * 30}ms` }}>
              <ProductCard product={product} hrefBase={hrefBase} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <Empty
            icon={<PackageOpen size={26} strokeWidth={1.6} aria-hidden />}
            title={filtered ? "ไม่พบสินค้าที่ตรงกับที่ค้นหา" : "ยังไม่มีสินค้าวางขาย"}
            body={
              filtered
                ? "ลองใช้คำค้นที่สั้นลง หรือดูสินค้าทั้งหมดของทางร้าน"
                : "เมื่อทางร้านลงสินค้าใหม่ รายการจะขึ้นที่หน้านี้ทันที"
            }
            action={
              filtered ? (
                <button
                  type="button"
                  onClick={() => router.replace(pathname, { scroll: false })}
                  className="inline-flex min-h-[44px] items-center rounded-sm border border-line-strong px-5 font-display text-small font-semibold transition-colors duration-150 hover:bg-canvas-2"
                >
                  ดูสินค้าทั้งหมด
                </button>
              ) : undefined
            }
          />
        </div>
      )}
    </section>
  );
}

function Chip({
  active,
  count,
  onSelect,
  children,
}: {
  active: boolean;
  count?: number;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-small font-medium transition-colors duration-150 ${
        active
          ? "border-brand bg-brand text-brand-on"
          : "border-line-strong bg-surface text-ink hover:bg-canvas-2"
      }`}
    >
      {children}
      {count !== undefined && (
        <span className={`u-fig text-caption ${active ? "opacity-70" : "text-subtle"}`}>{count}</span>
      )}
    </button>
  );
}

function ProductCard({ product, hrefBase }: { product: Product; hrefBase: string }) {
  const stock = product.quantity ?? 0;

  return (
    <Link href={`${hrefBase}/${product.id}`} className="group block">
      <div className="relative aspect-square w-full overflow-hidden rounded bg-canvas-2">
        {product.img ? (
          <Image
            src={product.img}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 260px"
            className={`object-cover transition-transform duration-500 ease-ease group-hover:scale-[1.04] ${
              stock === 0 ? "opacity-45 saturate-50" : ""
            }`}
          />
        ) : (
          <span className="flex h-full items-center justify-center text-subtle">
            <PackageOpen size={30} strokeWidth={1.4} aria-hidden />
          </span>
        )}

        {stock === 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-surface/45">
            <Badge tone="solid">สินค้าหมด</Badge>
          </span>
        )}
        {stock > 0 && stock <= 3 && (
          <span className="absolute left-2 top-2">
            <Badge tone="sale">เหลือ {stock} ชิ้น</Badge>
          </span>
        )}
      </div>

      <div className="pt-3">
        {product.category?.name && (
          <p className="text-micro font-medium uppercase tracking-wide text-subtle">
            {product.category.name}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 min-h-[44px] text-small text-ink group-hover:underline">
          {product.title}
        </h3>
        <Money value={product.price} className="mt-2 block text-h4" />
      </div>
    </Link>
  );
}
