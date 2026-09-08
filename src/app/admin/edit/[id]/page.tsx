"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Masthead from "../../../components/masthead";
import SiteFoot from "../../../components/sitefoot";
import RequireAuth from "../../../components/requireauth";
import { useFlash } from "../../../components/flash";
import { FormShell, Fieldset, ImageField } from "../../../components/adminform";
import { Button, ButtonLink, Label, Notice, PageLoading, Sheet } from "../../../components/press";

type Category = { id: number; name: string };

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <RequireAuth admin>
      <EditProduct id={params.id} />
    </RequireAuth>
  );
}

function EditProduct({ id }: { id: string }) {
  const router = useRouter();
  const flash = useFlash();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [img, setImg] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.section = "cobalt";
    return () => {
      delete document.documentElement.dataset.section;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`/api/posts/${id}`, { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);
        const post = await pRes.json();
        if (!pRes.ok) throw new Error(post?.error ?? "");
        if (cancelled) return;

        setTitle(post.title ?? "");
        setContent(post.content ?? "");
        setPrice(String(post.price ?? ""));
        setQuantity(String(post.quantity ?? ""));
        setCategoryId(String(post.categoryId ?? ""));
        setImg(post.img ?? "");
        setCategories(cRes.ok ? await cRes.json() : []);
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error && err.message ? err.message : "โหลดข้อมูลสินค้าไม่สำเร็จ");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!categoryId) return setError("กรุณาเลือกหมวดหมู่สินค้า");

    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          img,
          price: Number(price),
          quantity: Number(quantity),
          categoryId: Number(categoryId),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "บันทึกไม่สำเร็จ");

      flash("ok", `อัปเดต “${title}” แล้ว`);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Masthead />
        <PageLoading label="กำลังดึงข้อมูลสินค้า" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen">
        <Masthead />
        <Sheet width="narrow" className="py-16">
          <Notice>{loadError}</Notice>
          <div className="mt-6">
            <ButtonLink href="/admin" tone="quiet">
              กลับหน้าจัดการร้าน
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
        <Sheet width="column" className="pb-20">
          <FormShell title="แก้ไขสินค้า" intro={`รหัสสินค้า #${id} — การเปลี่ยนแปลงจะมีผลกับหน้าร้านทันที`}>
            <form onSubmit={submit} noValidate className="space-y-6">
              {error && <Notice>{error}</Notice>}

              <Fieldset legend="ข้อมูลสินค้า">
                <div>
                  <Label htmlFor="title">ชื่อสินค้า</Label>
                  <input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} className="u-field" />
                </div>
                <div>
                  <Label htmlFor="content">รายละเอียดสินค้า</Label>
                  <textarea
                    id="content"
                    required
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="u-field resize-y"
                  />
                </div>
              </Fieldset>

              <Fieldset legend="ราคาและคลังสินค้า">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="price" hint="บาท">ราคาขาย</Label>
                    <input
                      id="price"
                      type="number"
                      min={0}
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="u-field u-fig"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity" hint="ชิ้น">จำนวนในคลัง</Label>
                    <input
                      id="quantity"
                      type="number"
                      min={0}
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="u-field u-fig"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">หมวดหมู่</Label>
                    <select
                      id="category"
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="u-field"
                    >
                      <option value="">เลือกหมวดหมู่</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-caption text-ink-mid">
                  การเปลี่ยนหมวดหมู่มีผลกับการกรองสินค้าในหน้าร้านทันที
                </p>
              </Fieldset>

              <Fieldset legend="รูปภาพ">
                <ImageField value={img} onChange={setImg} />
              </Fieldset>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" size="lg" busy={saving} className="flex-1">
                  บันทึกการเปลี่ยนแปลง
                </Button>
                <Button type="button" tone="quiet" size="lg" onClick={() => router.push("/admin")}>
                  ยกเลิก
                </Button>
              </div>
            </form>
          </FormShell>
        </Sheet>
      </main>
      <SiteFoot />
    </div>
  );
}
