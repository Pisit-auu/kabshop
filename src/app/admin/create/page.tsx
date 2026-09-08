"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Masthead from "../../components/masthead";
import SiteFoot from "../../components/sitefoot";
import RequireAuth from "../../components/requireauth";
import { useFlash } from "../../components/flash";
import { FormShell, Fieldset, ImageField } from "../../components/adminform";
import { Button, Label, Notice, Shell } from "../../components/press";

type Category = { id: number; name: string };

export default function CreateProductPage() {
  return (
    <RequireAuth admin>
      <CreateProduct />
    </RequireAuth>
  );
}

function CreateProduct() {
  const router = useRouter();
  const flash = useFlash();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [img, setImg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.section = "cobalt";
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {});
    return () => {
      delete document.documentElement.dataset.section;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!categoryId) return setError("กรุณาเลือกหมวดหมู่สินค้า");

    setSaving(true);
    try {
      const res = await fetch("/api", {
        method: "POST",
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
      if (!res.ok) throw new Error(data?.error ?? "บันทึกสินค้าไม่สำเร็จ");

      flash("ok", `เพิ่ม “${title}” เข้าคลังแล้ว`);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "บันทึกสินค้าไม่สำเร็จ");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Masthead />
      <main>
        <Shell width="column" className="pb-20">
          <FormShell title="เพิ่มสินค้าใหม่" intro="กรอกข้อมูลให้ครบ สินค้าจะขึ้นหน้าร้านทันทีหลังบันทึก">
            <form onSubmit={submit} noValidate className="space-y-6">
              {error && <Notice>{error}</Notice>}

              <Fieldset legend="ข้อมูลสินค้า">
                <div>
                  <Label htmlFor="title">ชื่อสินค้า</Label>
                  <input
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น รองเท้าผ้าใบสีขาว"
                    className="u-field"
                  />
                </div>
                <div>
                  <Label htmlFor="content">รายละเอียดสินค้า</Label>
                  <textarea
                    id="content"
                    required
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="ขนาด วัสดุ สี และเงื่อนไขที่ลูกค้าควรรู้ก่อนสั่งซื้อ"
                    className="u-field resize-y"
                  />
                </div>
              </Fieldset>

              <Fieldset legend="ราคาและคลังสินค้า">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="price" hint="บาท">
                      ราคาขาย
                    </Label>
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
                    <Label htmlFor="quantity" hint="ชิ้น">
                      จำนวนในคลัง
                    </Label>
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
              </Fieldset>

              <Fieldset legend="รูปภาพ">
                <ImageField value={img} onChange={setImg} />
              </Fieldset>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" size="lg" busy={saving} className="flex-1">
                  บันทึกและขึ้นขาย
                </Button>
                <Button type="button" tone="secondary" size="lg" onClick={() => router.push("/admin")}>
                  ยกเลิก
                </Button>
              </div>
            </form>
          </FormShell>
        </Shell>
      </main>
      <SiteFoot />
    </div>
  );
}
