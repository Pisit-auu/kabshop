"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Masthead from "../../components/masthead";
import SiteFoot from "../../components/sitefoot";
import RequireAuth from "../../components/requireauth";
import { useFlash } from "../../components/flash";
import { useMe } from "../../components/me";
import { FormShell, Fieldset } from "../../components/adminform";
import { Button, Label, Notice, Shell } from "../../components/press";

export default function CreateStaffPage() {
  return (
    <RequireAuth admin>
      <CreateStaff />
    </RequireAuth>
  );
}

function CreateStaff() {
  const router = useRouter();
  const flash = useFlash();
  const { me } = useMe();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("admin");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // admin ทั่วไปเข้ามาหน้านี้ได้ผ่าน URL แต่สร้างบัญชีไม่ได้ — ส่งกลับหน้าจัดการร้าน
  useEffect(() => {
    if (me && me.role !== "superadmin") router.replace("/admin");
  }, [me, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");

    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "สร้างบัญชีไม่สำเร็จ");

      flash("ok", `สร้างบัญชี ${data.email} แล้ว`);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "สร้างบัญชีไม่สำเร็จ");
      setSaving(false);
    }
  };

  if (me?.role !== "superadmin") return null;

  return (
    <div className="min-h-screen">
      <Masthead />
      <main>
        <Shell width="narrow" className="pb-20">
          <FormShell
            title="เพิ่มบัญชีแอดมิน"
            intro="เฉพาะซูเปอร์แอดมินเท่านั้นที่สร้างบัญชีให้ทีมงานได้ ลูกค้ายังสมัครสมาชิกเองได้ตามปกติ"
          >
            <form onSubmit={submit} noValidate className="space-y-6">
              {error && <Notice>{error}</Notice>}

              <Fieldset legend="ข้อมูลบัญชี">
                <div>
                  <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                  <input
                    id="name"
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="u-field"
                  />
                </div>
                <div>
                  <Label htmlFor="email">อีเมล</Label>
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="off"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="u-field"
                    placeholder="staff@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password" hint="อย่างน้อย 8 ตัวอักษร">
                    รหัสผ่านเริ่มต้น
                  </Label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="u-field"
                  />
                </div>
              </Fieldset>

              <Fieldset legend="บทบาท">
                <div className="flex flex-wrap gap-5">
                  {([
                    ["admin", "แอดมิน — จัดการสินค้าและคำสั่งซื้อ"],
                    ["member", "สมาชิก — ลูกค้าทั่วไป"],
                  ] as const).map(([value, label]) => (
                    <label key={value} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="role"
                        value={value}
                        checked={role === value}
                        onChange={() => setRole(value)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </Fieldset>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="submit"
                  size="lg"
                  busy={saving}
                  disabled={!email.trim() || !password}
                  className="flex-1"
                >
                  สร้างบัญชี
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
