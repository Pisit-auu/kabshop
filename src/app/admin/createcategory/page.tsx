"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Masthead from "../../components/masthead";
import SiteFoot from "../../components/sitefoot";
import RequireAuth from "../../components/requireauth";
import { useFlash } from "../../components/flash";
import { FormShell, Fieldset } from "../../components/adminform";
import { Button, Label, Notice, Sheet } from "../../components/press";

export default function CreateCategoryPage() {
  return (
    <RequireAuth admin>
      <CreateCategory />
    </RequireAuth>
  );
}

function CreateCategory() {
  const router = useRouter();
  const flash = useFlash();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.section = "cobalt";
    return () => {
      delete document.documentElement.dataset.section;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "สร้างหมวดหมู่ไม่สำเร็จ");

      flash("ok", `สร้างหมวดหมู่ “${name.trim()}” แล้ว`);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "สร้างหมวดหมู่ไม่สำเร็จ");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Masthead />
      <main>
        <Sheet width="narrow" className="pb-20">
          <FormShell
            title="เพิ่มหมวดหมู่"
            intro="หมวดหมู่จะปรากฏเป็นสารบัญบนหน้าร้าน และใช้กรองสินค้าให้ลูกค้า"
          >
            <form onSubmit={submit} noValidate className="space-y-6">
              {error && <Notice>{error}</Notice>}

              <Fieldset legend="ชื่อหมวดหมู่">
                <div>
                  <Label htmlFor="name" hint="ไม่ซ้ำกับหมวดหมู่เดิม">
                    ชื่อที่แสดงบนหน้าร้าน
                  </Label>
                  <input
                    id="name"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น เครื่องเขียน, ของใช้ในบ้าน"
                    className="u-field"
                  />
                </div>
              </Fieldset>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" size="lg" busy={saving} disabled={!name.trim()} className="flex-1">
                  สร้างหมวดหมู่
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
