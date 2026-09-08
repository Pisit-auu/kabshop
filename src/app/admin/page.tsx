"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import Masthead from "../components/masthead";
import SiteFoot from "../components/sitefoot";
import RequireAuth from "../components/requireauth";
import { useFlash } from "../components/flash";
import { Button, ButtonLink, Badge, Money, Notice, PageHead, Shell } from "../components/press";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Product = {
  id: number;
  title: string;
  price: number | null;
  quantity: number | null;
  Sales: number;
  category?: { name: string } | null;
};
type Category = { id: number; name: string; _count?: { posts: number } };
type Order = {
  orderId: string;
  createdAt: string;
  Username: string | null;
  user?: { name: string | null; email: string } | null;
  items: { totalPrice: number }[];
};

const SHIPPING_COST = 36;

export default function AdminPage() {
  return (
    <RequireAuth admin>
      <Admin />
    </RequireAuth>
  );
}

function Admin() {
  const flash = useFlash();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<{ topBuyer: { name: string; purchaseamount: number } | null; memberCount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);
  const [showAllOrders, setShowAllOrders] = useState(false);


  const load = useCallback(async () => {
    setError(null);
    try {
      const query = new URLSearchParams({ category, search }).toString();
      const [p, c, s, o] = await Promise.all([
        fetch(`/api?${query}`, { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
        fetch("/api/user", { cache: "no-store" }),
        fetch("/api/order", { cache: "no-store" }),
      ]);
      if (!p.ok || !c.ok || !s.ok || !o.ok) throw new Error();
      setProducts(await p.json());
      setCategories(await c.json());
      setSummary(await s.json());
      setOrders(await o.json());
    } catch {
      setError("โหลดข้อมูลหลังร้านไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const remove = async (kind: "posts" | "categories", id: number, label: string) => {
    try {
      const res = await fetch(`/api/${kind}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "ลบไม่สำเร็จ");
      flash("ok", `ลบ “${label}” แล้ว`);
      setConfirming(null);
      load();
    } catch (err) {
      flash("warn", err instanceof Error ? err.message : "ลบไม่สำเร็จ");
    }
  };

  const revenue = useMemo(
    () => orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.totalPrice, 0) + SHIPPING_COST, 0),
    [orders],
  );
  const outOfStock = products.filter((p) => (p.quantity ?? 0) === 0).length;

  const topSellers = useMemo(
    () => [...products].filter((p) => p.Sales > 0).sort((a, b) => b.Sales - a.Sales).slice(0, 8),
    [products],
  );

  const chartData = {
    labels: topSellers.map((p) => (p.title.length > 18 ? `${p.title.slice(0, 17)}…` : p.title)),
    datasets: [
      {
        label: "ยอดขาย (บาท)",
        data: topSellers.map((p) => p.Sales),
        backgroundColor: "#16161a",
        hoverBackgroundColor: "#5c5c66",
        borderWidth: 0,
        borderRadius: 4,
        barPercentage: 0.66,
      },
    ],
  };

  const visibleOrders = showAllOrders ? orders : orders.slice(0, 6);

  return (
    <div className="min-h-screen">
      <Masthead />

      <main>
        <Shell className="pb-20">
          <PageHead
            title="จัดการร้าน"
            meta="สต็อก หมวดหมู่ และคำสั่งซื้อทั้งหมดของ KABSHOP"
            action={
              <div className="flex flex-wrap gap-2">
                <ButtonLink href="/admin/createcategory" tone="secondary">
                  <Plus size={16} aria-hidden /> เพิ่มหมวดหมู่
                </ButtonLink>
                <ButtonLink href="/admin/create">
                  <Plus size={16} aria-hidden /> เพิ่มสินค้า
                </ButtonLink>
              </div>
            }
          />

          {error && (
            <div className="mt-6">
              <Notice>{error}</Notice>
            </div>
          )}

          {/* The figures band: read across like a market table, not stat cards. */}
          <dl className="mt-8 grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
            <Figure label="สินค้าในระบบ" value={loading ? "…" : String(products.length)} note={`หมด ${outOfStock} รายการ`} />
            <Figure label="หมวดหมู่" value={loading ? "…" : String(categories.length)} />
            <Figure label="คำสั่งซื้อ" value={loading ? "…" : String(orders.length)} note={`รวม ฿${revenue.toLocaleString("th-TH")}`} />
            <Figure
              label="ลูกค้าอันดับหนึ่ง"
              value={summary?.topBuyer?.name ?? "—"}
              note={
                summary?.topBuyer
                  ? `ยอดสะสม ฿${summary.topBuyer.purchaseamount.toLocaleString("th-TH")}`
                  : "ยังไม่มียอดซื้อ"
              }
              text
            />
          </dl>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* min-w-0: without it the grid track stretches to the table's
                min-width and the whole page scrolls sideways on a phone. */}
            <div className="min-w-0 space-y-10">
              {/* Inventory */}
              <section aria-labelledby="ad-stock">
                <h2 id="ad-stock" className="u-display text-h4">
                  คลังสินค้า
                </h2>
                <div className="mt-3 border-b border-line" aria-hidden />

                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="relative min-w-[200px] flex-1">
                    <label htmlFor="ad-search" className="sr-only">
                      ค้นหาสินค้า
                    </label>
                    <Search
                      size={16}
                      aria-hidden
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
                    />
                    <input
                      id="ad-search"
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="ค้นหาชื่อสินค้า"
                      className="u-field !pl-10 !text-small"
                    />
                  </div>
                  <div className="min-w-[180px]">
                    <label htmlFor="ad-cat" className="sr-only">
                      กรองตามหมวดหมู่
                    </label>
                    <select
                      id="ad-cat"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="u-field !text-small"
                    >
                      <option value="">ทุกหมวดหมู่</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Phones get a ruled list; a 620px table inside a scroller
                    still pushes the document sideways in Chromium. */}
                <ul className="mt-4 divide-y divide-line border border-line bg-surface lg:hidden">
                  {products.map((p) => {
                    const stock = p.quantity ?? 0;
                    const key = `posts-${p.id}`;
                    return (
                      <li key={p.id} className="px-4 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <p className="min-w-0 text-small font-semibold">{p.title}</p>
                          <Money value={p.price} className="shrink-0 text-small" />
                        </div>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
                          <span>{p.category?.name ?? "ไม่มีหมวดหมู่"}</span>
                          {stock === 0 ? (
                            <Badge tone="sale">หมด</Badge>
                          ) : (
                            <span className={stock <= 3 ? "text-sale-text" : ""}>
                              คงเหลือ <span className="u-fig font-bold">{stock}</span> ชิ้น
                            </span>
                          )}
                        </p>
                        <div className="mt-3">
                          <RowActions
                            id={p.id}
                            label={p.title}
                            confirmKey={key}
                            confirming={confirming}
                            setConfirming={setConfirming}
                            onDelete={() => remove("posts", p.id, p.title)}
                            editHref={`/admin/edit/${p.id}`}
                            align="start"
                          />
                        </div>
                      </li>
                    );
                  })}
                  {!loading && products.length === 0 && (
                    <li className="px-4 py-10 text-center text-small text-muted">
                      {search || category ? "ไม่พบสินค้าตามเงื่อนไขที่กรอง" : "ยังไม่มีสินค้าในคลัง"}
                    </li>
                  )}
                </ul>

                <div className="mt-4 hidden border border-line bg-surface lg:block">
                  <table className="w-full border-collapse text-left">
                    <caption className="sr-only">รายการสินค้าทั้งหมดในคลัง</caption>
                    <thead>
                      <tr className="border-b border-line bg-canvas-2">
                        <th scope="col" className="u-label px-4 py-3">ชื่อสินค้า</th>
                        <th scope="col" className="u-label px-4 py-3">หมวดหมู่</th>
                        <th scope="col" className="u-label px-4 py-3 text-right">ราคา</th>
                        <th scope="col" className="u-label px-4 py-3 text-right">คงเหลือ</th>
                        <th scope="col" className="u-label px-4 py-3 text-right">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {products.map((p) => {
                        const stock = p.quantity ?? 0;
                        return (
                          <tr key={p.id} className="transition-colors duration-150 hover:bg-canvas">
                            <td className="px-4 py-3 text-small font-semibold">{p.title}</td>
                            <td className="px-4 py-3 text-caption text-muted">{p.category?.name ?? "—"}</td>
                            <td className="px-4 py-3 text-right">
                              <Money value={p.price} className="text-small" />
                            </td>
                            <td className="px-4 py-3 text-right">
                              {stock === 0 ? (
                                <Badge tone="sale">หมด</Badge>
                              ) : (
                                <span className={`u-fig text-small font-bold ${stock <= 3 ? "text-sale-text" : ""}`}>
                                  {stock}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <RowActions
                                id={p.id}
                                label={p.title}
                                confirmKey={`posts-${p.id}`}
                                confirming={confirming}
                                setConfirming={setConfirming}
                                onDelete={() => remove("posts", p.id, p.title)}
                                editHref={`/admin/edit/${p.id}`}
                                align="end"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {!loading && products.length === 0 && (
                    <div className="p-10 text-center">
                      <p className="text-small text-muted">
                        {search || category ? "ไม่พบสินค้าตามเงื่อนไขที่กรอง" : "ยังไม่มีสินค้าในคลัง"}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Sales */}
              <section aria-labelledby="ad-sales">
                <h2 id="ad-sales" className="u-display text-h4">
                  ยอดขายรายสินค้า
                </h2>
                <div className="mt-3 border-b border-line" aria-hidden />
                <div className="mt-4 border border-line bg-surface p-5">
                  {topSellers.length === 0 ? (
                    <p className="py-10 text-center text-small text-muted">ยังไม่มียอดขายที่จะแสดง</p>
                  ) : (
                    <div className="h-[300px]">
                      <Bar
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: "#16161a",
                              padding: 10,
                              cornerRadius: 6,
                              displayColors: false,
                              callbacks: {
                                label: (ctx) => `฿${Number(ctx.raw).toLocaleString("th-TH")}`,
                              },
                            },
                          },
                          scales: {
                            x: {
                              grid: { display: false },
                              border: { color: "#e6e4e0", width: 1 },
                              ticks: { color: "#5c5c66", font: { size: 11 } },
                            },
                            y: {
                              grid: { color: "#f0eeeb" },
                              border: { display: false },
                              ticks: {
                                color: "#5c5c66",
                                font: { size: 11 },
                                callback: (v) => `฿${Number(v).toLocaleString("th-TH")}`,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-10">
              <section aria-labelledby="ad-cats">
                <h2 id="ad-cats" className="u-display text-h4">
                  หมวดหมู่
                </h2>
                <div className="mt-3 border-b border-line" aria-hidden />
                <ul className="mt-4 border border-line bg-surface">
                  {categories.map((c) => {
                    const key = `categories-${c.id}`;
                    return (
                      <li key={c.id} className="border-b border-line px-4 py-3 last:border-b-0">
                        <div className="flex items-center justify-between gap-3">
                          <span className="min-w-0 truncate text-small font-semibold">
                            {c.name}{" "}
                            <span className="u-fig text-caption font-normal text-subtle">
                              {c._count?.posts ?? 0}
                            </span>
                          </span>
                          {confirming === key ? (
                            <div className="flex shrink-0 items-center gap-2">
                              <Button size="sm" tone="danger" onClick={() => remove("categories", c.id, c.name)}>
                                ลบ
                              </Button>
                              <Button size="sm" tone="secondary" onClick={() => setConfirming(null)}>
                                ยกเลิก
                              </Button>
                            </div>
                          ) : (
                            <div className="-mr-2 flex shrink-0 items-center">
                              <Link
                                href={`/admin/editcategory/${c.id}`}
                                aria-label={`แก้ไขหมวดหมู่ ${c.name}`}
                                className="inline-flex h-10 w-10 items-center justify-center text-subtle transition-colors duration-150 hover:text-ink"
                              >
                                <Pencil size={15} aria-hidden />
                              </Link>
                              <button
                                type="button"
                                onClick={() => setConfirming(key)}
                                aria-label={`ลบหมวดหมู่ ${c.name}`}
                                className="inline-flex h-10 w-10 items-center justify-center text-subtle transition-colors duration-150 hover:text-sale-text"
                              >
                                <Trash2 size={15} aria-hidden />
                              </button>
                            </div>
                          )}
                        </div>
                        {confirming === key && (
                          <p className="mt-2 text-caption text-sale-text">
                            ลบหมวดหมู่นี้จะลบสินค้าทั้งหมด {c._count?.posts ?? 0} รายการในหมวดด้วย
                          </p>
                        )}
                      </li>
                    );
                  })}
                  {!loading && categories.length === 0 && (
                    <li className="px-4 py-8 text-center text-small text-muted">ยังไม่มีหมวดหมู่</li>
                  )}
                </ul>
              </section>

              <section aria-labelledby="ad-orders">
                <h2 id="ad-orders" className="u-display text-h4">
                  คำสั่งซื้อล่าสุด
                </h2>
                <div className="mt-3 border-b border-line" aria-hidden />
                <ul className="mt-4 border border-line bg-surface">
                  {visibleOrders.map((o) => {
                    const total = o.items.reduce((s, i) => s + i.totalPrice, 0) + SHIPPING_COST;
                    return (
                      <li key={o.orderId} className="border-b border-line px-4 py-3 last:border-b-0">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="u-fig text-small font-bold">{o.orderId}</span>
                          <Money value={total} className="text-small" />
                        </div>
                        <p className="mt-1 truncate text-caption text-muted">
                          {o.user?.name || o.user?.email || o.Username || "ไม่ทราบผู้สั่ง"}
                        </p>
                        <p className="u-fig mt-0.5 text-caption text-subtle">
                          {new Date(o.createdAt).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </li>
                    );
                  })}
                  {!loading && orders.length === 0 && (
                    <li className="px-4 py-8 text-center text-small text-muted">ยังไม่มีคำสั่งซื้อ</li>
                  )}
                </ul>
                {orders.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllOrders((v) => !v)}
                    aria-expanded={showAllOrders}
                    className="mt-1 inline-flex min-h-[40px] items-center font-display text-caption font-semibold text-[var(--ink)] underline underline-offset-4"
                  >
                    {showAllOrders ? "ย่อรายการ" : `ดูทั้งหมด ${orders.length} คำสั่งซื้อ`}
                  </button>
                )}
              </section>
            </div>
          </div>
        </Shell>
      </main>

      <SiteFoot />
    </div>
  );
}

function RowActions({
  confirmKey,
  confirming,
  setConfirming,
  onDelete,
  editHref,
  label,
  align,
}: {
  id: number;
  confirmKey: string;
  confirming: string | null;
  setConfirming: (v: string | null) => void;
  onDelete: () => void;
  editHref: string;
  label: string;
  align: "start" | "end";
}) {
  const justify = align === "end" ? "justify-end" : "justify-start";

  if (confirming === confirmKey) {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${justify}`}>
        <span className="text-caption text-muted">ลบถาวร?</span>
        <Button size="sm" tone="danger" onClick={onDelete}>
          ลบ
        </Button>
        <Button size="sm" tone="secondary" onClick={() => setConfirming(null)}>
          ยกเลิก
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${justify}`}>
      <Link
        href={editHref}
        className="inline-flex min-h-[40px] items-center gap-1 pr-2 text-caption font-semibold text-[var(--ink)] underline underline-offset-4"
      >
        <Pencil size={13} aria-hidden /> แก้ไข
        <span className="sr-only"> {label}</span>
      </Link>
      <button
        type="button"
        onClick={() => setConfirming(confirmKey)}
        className="inline-flex min-h-[40px] items-center gap-1 px-2 text-caption font-semibold text-sale-text underline underline-offset-4"
      >
        <Trash2 size={13} aria-hidden /> ลบ
        <span className="sr-only"> {label}</span>
      </button>
    </div>
  );
}

function Figure({
  label,
  value,
  note,
  text = false,
}: {
  label: string;
  value: string;
  note?: string;
  text?: boolean;
}) {
  return (
    <div className="bg-surface px-4 py-4">
      <dt className="u-label">{label}</dt>
      <dd
        className={`mt-1 truncate font-display font-bold ${
          text ? "text-lead" : "u-fig text-h3"
        }`}
      >
        {value}
      </dd>
      {note && <p className="mt-1 truncate text-caption text-subtle">{note}</p>}
    </div>
  );
}
