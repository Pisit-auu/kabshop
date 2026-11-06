import { prisma } from "../../lib/prisma";
import { requireAdmin, requireSuperadmin, fail, badRequest, HttpError } from "../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Shop-wide figures. Admin only — this used to be readable by anyone. */
export async function GET() {
  try {
    await requireAdmin();

    const [topBuyer, memberCount] = await Promise.all([
      prisma.user.findFirst({
        where: { purchaseamount: { gt: 0 } },
        orderBy: { purchaseamount: "desc" },
        select: { name: true, email: true, purchaseamount: true },
      }),
      prisma.user.count(),
    ]);

    return Response.json({
      topBuyer: topBuyer
        ? { name: topBuyer.name || topBuyer.email, purchaseamount: topBuyer.purchaseamount }
        : null,
      memberCount,
    });
  } catch (error) {
    return fail(error, "โหลดข้อมูลสรุปไม่สำเร็จ");
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STAFF_ROLES = ["member", "admin"] as const;

/** Create an account on someone's behalf. Superadmin only — customers sign up at /api/auth/signup. */
export async function POST(request: Request) {
  try {
    await requireSuperadmin();
    const body = await request.json().catch(() => ({}));

    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const name = String(body.name ?? "").trim().slice(0, 120) || null;
    const role = String(body.role ?? "admin");

    if (!EMAIL.test(email)) throw badRequest("รูปแบบอีเมลไม่ถูกต้อง");
    if (password.length < 8) throw badRequest("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
    if (password.length > 72) throw badRequest("รหัสผ่านยาวเกิน 72 ตัวอักษร");
    if (!(STAFF_ROLES as readonly string[]).includes(role)) throw badRequest("บทบาทไม่ถูกต้อง");

    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (existing) throw new HttpError(409, "อีเมลนี้มีบัญชีอยู่แล้ว");

    const bcrypt = (await import("bcrypt")).default;
    const user = await prisma.user.create({
      data: { name, email, role, password: await bcrypt.hash(password, 10) },
      select: { id: true, email: true, name: true, role: true },
    });
    return Response.json(user, { status: 201 });
  } catch (error) {
    return fail(error, "สร้างบัญชีไม่สำเร็จ");
  }
}
