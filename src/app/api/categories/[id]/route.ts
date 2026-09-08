import { prisma } from "../../../lib/prisma";
import { requireAdmin, fail, intOrFail, textOrFail, HttpError } from "../../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: intOrFail(params.id, "รหัสหมวดหมู่") },
      include: { _count: { select: { posts: true } } },
    });
    if (!category) throw new HttpError(404, "ไม่พบหมวดหมู่นี้");
    return Response.json(category);
  } catch (error) {
    return fail(error, "โหลดหมวดหมู่ไม่สำเร็จ");
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const id = intOrFail(params.id, "รหัสหมวดหมู่");
    const body = await request.json().catch(() => ({}));
    const name = textOrFail(body.name, "ชื่อหมวดหมู่", { max: 60 });

    const clash = await prisma.category.findUnique({ where: { name } });
    if (clash && clash.id !== id) throw new HttpError(409, `มีหมวดหมู่ "${name}" อยู่แล้ว`);

    const category = await prisma.category.update({ where: { id }, data: { name } });
    return Response.json(category);
  } catch (error) {
    return fail(error, "บันทึกหมวดหมู่ไม่สำเร็จ");
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await prisma.category.delete({ where: { id: intOrFail(params.id, "รหัสหมวดหมู่") } });
    return Response.json({ ok: true });
  } catch (error) {
    return fail(error, "ลบหมวดหมู่ไม่สำเร็จ");
  }
}
