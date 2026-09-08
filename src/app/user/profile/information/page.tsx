"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import Masthead from "../../../components/masthead";
import SiteFoot from "../../../components/sitefoot";
import Sidebar from "../../../components/sidebar";
import RequireAuth from "../../../components/requireauth";
import { useMe } from "../../../components/me";
import { useFlash } from "../../../components/flash";
import { Button, PageHead, Shell } from "../../../components/press";

type FieldKey = "name" | "email" | "phone" | "lineid" | "address";

const FIELDS: {
  key: FieldKey;
  label: string;
  hint?: string;
  type: string;
  multiline?: boolean;
  autoComplete: string;
  placeholder: string;
}[] = [
  { key: "name", label: "ชื่อ-นามสกุล", type: "text", autoComplete: "name", placeholder: "สมชาย ใจดี" },
  {
    key: "email",
    label: "อีเมล",
    hint: "เปลี่ยนแล้วต้องเข้าสู่ระบบใหม่",
    type: "email",
    autoComplete: "email",
    placeholder: "you@example.com",
  },
  { key: "phone", label: "เบอร์โทรศัพท์", type: "tel", autoComplete: "tel", placeholder: "08x-xxx-xxxx" },
  { key: "lineid", label: "Line ID", type: "text", autoComplete: "off", placeholder: "ไม่บังคับ" },
  {
    key: "address",
    label: "ที่อยู่จัดส่ง",
    type: "text",
    multiline: true,
    autoComplete: "street-address",
    placeholder: "บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์",
  },
];

export default function InformationPage() {
  return (
    <RequireAuth>
      <Information />
    </RequireAuth>
  );
}

function Information() {
  const router = useRouter();
  const flash = useFlash();
  const { me, refresh } = useMe();

  const [editing, setEditing] = useState<FieldKey | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);


  const start = (key: FieldKey) => {
    setDraft((me?.[key] as string) ?? "");
    setEditing(key);
  };

  const save = async (key: FieldKey) => {
    if (!me) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/user/${encodeURIComponent(me.email)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: draft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "บันทึกข้อมูลไม่สำเร็จ");

      setEditing(null);
      if (key === "email") {
        flash("info", "เปลี่ยนอีเมลแล้ว กรุณาเข้าสู่ระบบใหม่ด้วยอีเมลใหม่");
        router.replace("/user/login");
        return;
      }
      await refresh();
      flash("ok", "บันทึกข้อมูลแล้ว");
    } catch (err) {
      flash("warn", err instanceof Error ? err.message : "บันทึกข้อมูลไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  const incomplete = !me?.name || !me?.phone || !me?.address;

  return (
    <div className="min-h-screen">
      <Masthead />

      <main>
        <Shell className="pb-20">
          <PageHead
            title="ข้อมูลส่วนตัว"
            meta={
              incomplete
                ? "กรอกชื่อ เบอร์โทรศัพท์ และที่อยู่ให้ครบ เพื่อให้สั่งซื้อได้"
                : "ข้อมูลนี้ถูกใช้เป็นที่อยู่ผู้รับในทุกคำสั่งซื้อ"
            }
          />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="lg:sticky lg:top-6 lg:self-start">
              <Sidebar />
            </div>

            <dl className="border border-line bg-surface">
              {FIELDS.map(({ key, label, hint, type, multiline, autoComplete, placeholder }) => {
                const value = (me?.[key] as string) ?? "";
                const isEditing = editing === key;
                const required = key === "name" || key === "phone" || key === "address";

                return (
                  <div key={key} className="border-b border-line px-5 py-4 last:border-b-0">
                    <dt className="mb-2 flex flex-wrap items-baseline gap-x-2">
                      <span className="u-label">{label}</span>
                      {hint && <span className="text-caption text-subtle">{hint}</span>}
                    </dt>

                    <dd>
                      {isEditing ? (
                        <div className="flex flex-wrap items-start gap-2">
                          {multiline ? (
                            <textarea
                              autoFocus
                              rows={4}
                              value={draft}
                              onChange={(e) => setDraft(e.target.value)}
                              placeholder={placeholder}
                              aria-label={label}
                              className="u-field min-w-0 flex-1 resize-y"
                            />
                          ) : (
                            <input
                              autoFocus
                              type={type}
                              autoComplete={autoComplete}
                              value={draft}
                              onChange={(e) => setDraft(e.target.value)}
                              placeholder={placeholder}
                              aria-label={label}
                              className="u-field min-w-0 flex-1"
                            />
                          )}
                          <div className="flex gap-2">
                            <Button size="md" busy={saving} onClick={() => save(key)} aria-label={`บันทึก${label}`}>
                              <Check size={17} aria-hidden />
                            </Button>
                            <Button
                              size="md"
                              tone="secondary"
                              onClick={() => setEditing(null)}
                              aria-label="ยกเลิก"
                            >
                              <X size={17} aria-hidden />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span
                            className={`min-w-0 whitespace-pre-line text-base ${
                              value ? "text-ink" : "text-subtle"
                            }`}
                          >
                            {value || (required ? "ยังไม่ได้กรอก — จำเป็นสำหรับการสั่งซื้อ" : "ยังไม่ได้กรอก")}
                          </span>
                          <button
                            type="button"
                            onClick={() => start(key)}
                            className="inline-flex min-h-[40px] shrink-0 items-center px-2 font-display text-caption font-semibold text-[var(--ink)] underline underline-offset-4"
                          >
                            {value ? "แก้ไข" : "เพิ่ม"}
                            <span className="sr-only"> {label}</span>
                          </button>
                        </div>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </Shell>
      </main>

      <SiteFoot />
    </div>
  );
}
