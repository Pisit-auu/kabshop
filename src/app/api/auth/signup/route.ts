import { prisma } from "../../../lib/prisma";
import { fail, badRequest, HttpError } from "../../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const name = String(body.name ?? "").trim().slice(0, 120) || null;

    if (!EMAIL.test(email)) throw badRequest("รูปแบบอีเมลไม่ถูกต้อง");
    if (password.length < 8) throw badRequest("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
    if (password.length > 72) throw badRequest("รหัสผ่านยาวเกิน 72 ตัวอักษร");

    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (existing) throw new HttpError(409, "อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบ");

    const bcrypt = (await import("bcrypt")).default;
    await prisma.user.create({
      data: { name, email, password: await bcrypt.hash(password, 10) },
    });

    // Nothing about the new row goes back over the wire.
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    return fail(error, "สมัครสมาชิกไม่สำเร็จ");
  }
}
