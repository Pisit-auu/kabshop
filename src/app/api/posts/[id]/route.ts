import { prisma } from "../../../lib/prisma";
import { requireAdmin, fail, intOrFail, textOrFail, badRequest, HttpError } from "../../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: intOrFail(params.id, "รหัสสินค้า") },
      include: { category: true },
    });
    if (!post) throw new HttpError(404, "ไม่พบสินค้าชิ้นนี้");
    return Response.json(post);
  } catch (error) {
    return fail(error, "โหลดข้อมูลสินค้าไม่สำเร็จ");
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const id = intOrFail(params.id, "รหัสสินค้า");
    const body = await request.json().catch(() => ({}));

    const categoryId = intOrFail(body.categoryId, "หมวดหมู่");
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw badRequest("ไม่พบหมวดหมู่ที่เลือก");

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: textOrFail(body.title, "ชื่อสินค้า", { max: 160 }),
        content: textOrFail(body.content, "รายละเอียดสินค้า", { max: 4000 }),
        price: intOrFail(body.price, "ราคา", { min: 0, max: 10_000_000 }),
        quantity: intOrFail(body.quantity, "จำนวนในคลัง", { min: 0, max: 1_000_000 }),
        img: typeof body.img === "string" ? body.img.slice(0, 600) : null,
        categoryId,
      },
    });
    return Response.json(post);
  } catch (error) {
    return fail(error, "บันทึกสินค้าไม่สำเร็จ");
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await prisma.post.delete({ where: { id: intOrFail(params.id, "รหัสสินค้า") } });
    return Response.json({ ok: true });
  } catch (error) {
    return fail(error, "ลบสินค้าไม่สำเร็จ");
  }
}
