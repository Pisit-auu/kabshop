"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthFrame from "../../components/authframe";
import { Button, Label, Notice, PageLoading } from "../../components/press";

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoading label="กำลังเปิดหน้าเข้าสู่ระบบ" />}>
      <Login />
    </Suspense>
  );
}

function Login() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await signIn("credentials", { redirect: false, email, password });
      if (result?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบแล้วลองใหม่");
        setBusy(false);
        return;
      }
      router.push(next && next.startsWith("/") ? next : "/");
      router.refresh();
    } catch {
      setError("เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setBusy(false);
    }
  };

  return (
    <AuthFrame
      title="เข้าสู่ระบบ"
      intro="ใช้อีเมลและรหัสผ่านที่สมัครไว้กับ KABSHOP"
      foot={
        <>
          ยังไม่มีบัญชี?{" "}
          <Link
            href="/user/register"
            className="font-semibold text-[var(--section-text)] underline underline-offset-4"
          >
            สมัครสมาชิก
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-6">
        {error && <Notice>{error}</Notice>}

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
            aria-invalid={error ? true : undefined}
            className="u-field"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <Label htmlFor="password">รหัสผ่าน</Label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? true : undefined}
            className="u-field"
          />
        </div>

        <Button type="submit" size="lg" className="w-full" busy={busy}>
          เข้าสู่ระบบ
        </Button>
      </form>
    </AuthFrame>
  );
}
