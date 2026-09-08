"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, PackageOpen, X } from "lucide-react";
import { Money, Mark, Empty, Notice, inkFor, type SectionInk } from "./press";

type Category = { id: number; name: string; _count?: { posts: number } };
type Product = {
  id: number;
  title: string;
  price: number | null;
  img: string | null;
  quantity: number | null;
  category?: { name: string } | null;
};

/**
 * The rack: the classified section itself.
 *
 * Choosing a category re-rules the whole page in one move — the masthead flash,
 * the index, the section head and every cell shoulder take that section's ink
 * together, because the ink lives on the document root.
 */
export default function Rack({ hrefBase = "/product" }: { hrefBase?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState("");
  const [rawSearch, setRawSearch] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const firstLoad = useRef(true);

  const ink: SectionInk = useMemo(() => inkFor(category), [category]);

  // One control, the whole sheet: the section ink is set on the document root.
  useEffect(() => {
    document.documentElement.dataset.section = ink;
    return () => {
      delete document.documentElement.dataset.section;
    };
  }, [ink]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(rawSearch.trim()), 300);
    return () => clearTimeout(t);
  }, [rawSearch]);

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

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({ category, search }).toString();
      const res = await fetch(`/api?${query}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      setProducts(await res.json());
    } catch {
      setError("โหลดรายการสินค้าไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setProducts([]);
    } finally {
      setLoading(false);
      firstLoad.current = false;
    }
  }, [category, search]);

  useEffect(() => {
    load();
  }, [load]);

  const total = categories.reduce((sum, c) => sum + (c._count?.posts ?? 0), 0);
  const filtered = Boolean(category || search);

  return (
    <section aria-labelledby="rack-heading">
      <h2 id="rack-heading" className="sr-only">
        รายการสินค้า
      </h2>

      {/* The index: sections and their counts, ruled like a table of contents. */}
      <nav aria-label="หมวดสินค้า" className="border-t-2 border-ink">
        <ul className="flex flex-wrap border-b-2 border-ink">
          <IndexCell
            active={category === ""}
            count={total || undefined}
            onSelect={() => setCategory("")}
          >
            ทั้งหมด
          </IndexCell>
          {categories.map((c) => (
            <IndexCell
              key={c.id}
              active={category === c.name}
              count={c._count?.posts}
              onSelect={() => setCategory(category === c.name ? "" : c.name)}
            >
              {c.name}
            </IndexCell>
          ))}
        </ul>
      </nav>

      {/* The search slug. */}
      <div className="relative mt-6">
        <label htmlFor="rack-search" className="sr-only">
          ค้นหาสินค้า
        </label>
        <Search
          size={18}
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
        />
        <input
          id="rack-search"
          type="search"
          value={rawSearch}
          onChange={(e) => setRawSearch(e.target.value)}
          placeholder="ค้นหาชื่อสินค้า"
          className="u-field !pl-10 !pr-10"
        />
        {rawSearch && (
          <button
            type="button"
            onClick={() => setRawSearch("")}
            aria-label="ล้างคำค้นหา"
            className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center text-ink-mid transition-colors duration-150 hover:text-ink"
          >
            <X size={16} aria-hidden />
          </button>
        )}
      </div>

      {/* The running head for this section of the sheet. */}
      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="u-display text-h3">{category || "ประกาศทั้งหมด"}</h3>
        <p className="text-small text-ink-mid" aria-live="polite">
          {loading ? "กำลังจัดหน้า…" : <><span className="u-fig font-bold text-ink">{products.length}</span> รายการ</>}
          {search && !loading && <> จากคำค้น “{search}”</>}
        </p>
      </div>
      <div className="mt-3 flex" aria-hidden>
        <div className="h-[3px] w-24 bg-[var(--section-fill)] transition-colors duration-300 ease-press" />
        <div className="h-[3px] flex-1 bg-ink" />
      </div>

      {error && (
        <div className="mt-6">
          <Notice>{error}</Notice>
        </div>
      )}

      {loading ? (
        <ul className="mt-6 grid grid-cols-2 gap-px bg-rule sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="bg-stock p-3">
              <div className="aspect-[4/3] w-full bg-paper-deep" />
              <div className="mt-3 h-4 w-4/5 bg-paper-deep" />
              <div className="mt-2 h-4 w-2/5 bg-paper-deep" />
              <div className="mt-4 h-6 w-1/2 bg-paper-deep" />
            </li>
          ))}
          <li className="sr-only">กำลังโหลดรายการสินค้า</li>
        </ul>
      ) : products.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-px bg-rule sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <li
              key={product.id}
              className="animate-ink-settle"
              style={{ animationDelay: `${Math.min(i, 11) * 26}ms` }}
            >
              <ProductCell product={product} hrefBase={hrefBase} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <Empty
            icon={<PackageOpen size={40} strokeWidth={1.5} aria-hidden />}
            title={filtered ? "ไม่พบสินค้าที่ตรงกับที่ค้นหา" : "ยังไม่มีสินค้าวางขาย"}
            body={
              filtered
                ? "ลองใช้คำค้นที่สั้นลง หรือดูประกาศทั้งหมดของวันนี้"
                : "เมื่อทางร้านลงสินค้าใหม่ รายการจะขึ้นที่หน้านี้ทันที"
            }
            action={
              filtered ? (
                <button
                  type="button"
                  onClick={() => {
                    setCategory("");
                    setRawSearch("");
                  }}
                  className="inline-flex min-h-[46px] items-center border border-ink px-5 font-display text-small font-semibold transition-colors duration-150 hover:bg-ink hover:text-paper"
                >
                  ดูประกาศทั้งหมด
                </button>
              ) : undefined
            }
          />
        </div>
      )}
    </section>
  );
}

function IndexCell({
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
    <li className="border-b border-r border-rule">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        className={`flex min-h-[46px] items-baseline gap-2 px-4 font-display text-small font-semibold transition-colors duration-200 ease-press ${
          active
            ? "bg-[var(--section-fill)] text-[var(--section-on)]"
            : "text-ink hover:bg-paper-deep"
        }`}
      >
        {children}
        {count !== undefined && (
          <span className={`u-fig text-caption ${active ? "opacity-80" : "text-ink-soft"}`}>{count}</span>
        )}
      </button>
    </li>
  );
}

function ProductCell({ product, hrefBase }: { product: Product; hrefBase: string }) {
  const stock = product.quantity ?? 0;
  const ink = inkFor(product.category?.name ?? product.id);

  return (
    <Link
      href={`${hrefBase}/${product.id}`}
      data-section={ink}
      className="group flex h-full flex-col bg-stock outline-offset-[-2px] transition-colors duration-200 hover:bg-white"
    >
      <div className="h-[3px] bg-[var(--section-fill)]" aria-hidden />

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-deep">
        {product.img ? (
          <Image
            src={product.img}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            className="object-cover transition-transform duration-500 ease-press group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-ink-soft">
            <PackageOpen size={28} strokeWidth={1.5} aria-hidden />
          </span>
        )}
        {stock === 0 && (
          <span className="absolute left-0 top-0">
            <Mark tone="ink">หมดชั่วคราว</Mark>
          </span>
        )}
        {stock > 0 && stock <= 3 && (
          <span className="absolute left-0 top-0">
            <Mark tone="scarlet">เหลือ {stock} ชิ้น</Mark>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col border-t border-rule p-3">
        {product.category?.name && (
          <span className="u-label !text-[var(--section-text)] mb-1.5">{product.category.name}</span>
        )}
        <h4 className="text-small font-semibold leading-snug text-ink line-clamp-2 group-hover:underline">
          {product.title}
        </h4>
        <div className="mt-auto pt-3">
          <Money value={product.price} className="text-h4" />
        </div>
      </div>
    </Link>
  );
}
