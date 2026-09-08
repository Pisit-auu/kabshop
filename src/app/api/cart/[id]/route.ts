import { prisma } from "../../../lib/prisma";
import { requireUser, fail, intOrFail, HttpError } from "../../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Every cart line is checked against the session owner before it is touched. */
async function ownLine(id: number) {
  const user = await requireUser();
  const line = await prisma.cart.findUnique({ where: { id }, include: { post: true } });
  if (!line || line.userId !== user.id) throw new HttpError(404, "ไม่พบรายการนี้ในตะกร้าของคุณ");
  return line;
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    return Response.json(await ownLine(intOrFail(params.id, "รหัสรายการ")));
  } catch (error) {
    return fail(error, "โหลดรายการไม่สำเร็จ");
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const line = await ownLine(intOrFail(params.id, "รหัสรายการ"));
    const body = await request.json().catch(() => ({}));
    const value = intOrFail(body.value, "จำนวน", { min: 1, max: 999 });

    const stock = line.post.quantity ?? 0;
    if (value > stock) {
      throw new HttpError(409, `"${line.post.title}" เหลือเพียง ${stock} ชิ้น`);
    }

    const updated = await prisma.cart.update({ where: { id: line.id }, data: { value } });
    return Response.json(updated);
  } catch (error) {
    return fail(error, "ปรับจำนวนไม่สำเร็จ");
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const line = await ownLine(intOrFail(params.id, "รหัสรายการ"));
    await prisma.cart.delete({ where: { id: line.id } });
    return Response.json({ ok: true });
  } catch (error) {
    return fail(error, "นำสินค้าออกจากตะกร้าไม่สำเร็จ");
  }
}
