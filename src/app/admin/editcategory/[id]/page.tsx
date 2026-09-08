"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Masthead from "../../../components/masthead";
import SiteFoot from "../../../components/sitefoot";
import RequireAuth from "../../../components/requireauth";
import { useFlash } from "../../../components/flash";
import { FormShell, Fieldset } from "../../../components/adminform";
import { Button, ButtonLink, Label, Notice, PageLoading, Sheet } from "../../../components/press";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  return (
    <RequireAuth admin>
      <EditCategory id={params.id} />
    </RequireAuth>
  );
}

function EditCategory({ id }: { id: string }) {
  const router = useRouter();
  const flash = useFlash();

  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
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
        const res = await fetch(`/api/categories/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "");
        if (cancelled) return;
        setName(data.name ?? "");
        setCount(data._count?.posts ?? 0);
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error && err.message ? err.message : "โหลดหมวดหมู่ไม่สำเร็จ");
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
    setSaving(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "บันทึกไม่สำเร็จ");

      flash("ok", "บันทึกชื่อหมวดหมู่แล้ว");
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
        <PageLoading label="กำลังโหลดหมวดหมู่" />
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
        <Sheet width="narrow" className="pb-20">
          <FormShell
            title="แก้ไขหมวดหมู่"
            intro={`หมวดนี้มีสินค้าอยู่ ${count} รายการ การเปลี่ยนชื่อจะมีผลกับสารบัญหน้าร้านทันที`}
          >
            <form onSubmit={submit} noValidate className="space-y-6">
              {error && <Notice>{error}</Notice>}

              <Fieldset legend="ชื่อหมวดหมู่">
                <div>
                  <Label htmlFor="name">ชื่อที่แสดงบนหน้าร้าน</Label>
                  <input
                    id="name"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="u-field"
                  />
                </div>
              </Fieldset>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" size="lg" busy={saving} disabled={!name.trim()} className="flex-1">
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
