import { prisma } from "../../../lib/prisma";
import { requireUser, fail, badRequest, HttpError } from "../../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Only the account holder — or an admin — may read or write a profile. */
async function authorize(email: string) {
  const me = await requireUser();
  if (me.email !== email && me.role !== "admin") {
    throw new HttpError(403, "ไม่มีสิทธิ์เข้าถึงข้อมูลผู้ใช้รายนี้");
  }
  return me;
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const email = decodeURIComponent(params.id);
    await authorize(email);
    const user = await prisma.user.findUnique({
      where: { email },
      include: { cart: { include: { post: true }, orderBy: { id: "asc" } } },
    });
    if (!user) throw new HttpError(404, "ไม่พบผู้ใช้รายนี้");

    const { password, ...safe } = user;
    return Response.json(safe);
  } catch (error) {
    return fail(error, "โหลดข้อมูลผู้ใช้ไม่สำเร็จ");
  }
}

/**
 * Profile fields only. `role` and `purchaseamount` are deliberately not
 * writable here — the old route accepted purchaseamount straight from the
 * browser, and role would have been one request away from self-promotion.
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const email = decodeURIComponent(params.id);
    await authorize(email);
    const body = await request.json().catch(() => ({}));

    const data: Record<string, string | null> = {};

    if ("name" in body) {
      const name = String(body.name ?? "").trim();
      if (name.length > 120) throw badRequest("ชื่อยาวเกินไป");
      data.name = name || null;
    }
    if ("phone" in body) {
      const phone = String(body.phone ?? "").trim();
      if (phone && !/^[0-9+\-\s()]{6,20}$/.test(phone)) throw badRequest("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง");
      data.phone = phone || null;
    }
    if ("lineid" in body) {
      const lineid = String(body.lineid ?? "").trim();
      if (lineid.length > 60) throw badRequest("Line ID ยาวเกินไป");
      data.lineid = lineid || null;
    }
    if ("address" in body) {
      const address = String(body.address ?? "").trim();
      if (address.length > 600) throw badRequest("ที่อยู่ยาวเกินไป");
      data.address = address || null;
    }
    if ("email" in body) {
      const next = String(body.email ?? "").trim().toLowerCase();
      if (!EMAIL.test(next)) throw badRequest("รูปแบบอีเมลไม่ถูกต้อง");
      if (next !== email) {
        const clash = await prisma.user.findUnique({ where: { email: next } });
        if (clash) throw new HttpError(409, "อีเมลนี้ถูกใช้งานแล้ว");
      }
      data.email = next;
    }

    if (Object.keys(data).length === 0) throw badRequest("ไม่มีข้อมูลที่จะบันทึก");

    const updated = await prisma.user.update({ where: { email }, data });
    const { password, ...safe } = updated;
    return Response.json(safe);
  } catch (error) {
    return fail(error, "บันทึกข้อมูลไม่สำเร็จ");
  }
}
