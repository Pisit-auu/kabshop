"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthFrame from "../../components/authframe";
import { useFlash } from "../../components/flash";
import { Button, Label, Notice } from "../../components/press";

export default function Register() {
  const router = useRouter();
  const flash = useFlash();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) return setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
    if (password !== confirm) return setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");

    setBusy(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "สมัครสมาชิกไม่สำเร็จ");

      // Straight into the shop — no second trip through the sign-in form.
      const signedIn = await signIn("credentials", { redirect: false, email, password });
      if (signedIn?.error) {
        flash("ok", "สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ");
        router.push("/user/login");
        return;
      }
      flash("ok", "สมัครสมาชิกสำเร็จ ยินดีต้อนรับสู่ KABSHOP");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "สมัครสมาชิกไม่สำเร็จ");
      setBusy(false);
    }
  };

  return (
    <AuthFrame
      title="สมัครสมาชิก"
      intro="ใช้เวลาไม่ถึงหนึ่งนาที ที่อยู่จัดส่งกรอกทีหลังได้"
      foot={
        <>
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/user/login" className="font-semibold text-[var(--section-text)] underline underline-offset-4">
            เข้าสู่ระบบ
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-6">
        {error && <Notice>{error}</Notice>}

        <div>
          <Label htmlFor="name" hint="ใช้เป็นชื่อผู้รับสินค้า">
            ชื่อ-นามสกุล
          </Label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="u-field"
            placeholder="สมชาย ใจดี"
          />
        </div>

        <div>
          <Label htmlFor="email">อีเมล</Label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="u-field"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <Label htmlFor="password" hint="อย่างน้อย 8 ตัวอักษร">
            รหัสผ่าน
          </Label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={password.length > 0 && password.length < 8 ? true : undefined}
            className="u-field"
          />
        </div>

        <div>
          <Label htmlFor="confirm">ยืนยันรหัสผ่าน</Label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={confirm.length > 0 && confirm !== password ? true : undefined}
            className="u-field"
          />
          {confirm.length > 0 && confirm !== password && (
            <p className="mt-2 text-caption text-scarlet-text">รหัสผ่านทั้งสองช่องยังไม่ตรงกัน</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" busy={busy}>
          สมัครสมาชิก
        </Button>
      </form>
    </AuthFrame>
  );
}
