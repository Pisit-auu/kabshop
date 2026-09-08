import { prisma } from "../../lib/prisma";
import { requireAdmin, fail, textOrFail, HttpError } from "../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });
    return Response.json(categories);
  } catch (error) {
    return fail(error, "โหลดหมวดหมู่ไม่สำเร็จ");
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));
    const name = textOrFail(body.name, "ชื่อหมวดหมู่", { max: 60 });

    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) throw new HttpError(409, `มีหมวดหมู่ "${name}" อยู่แล้ว`);

    const category = await prisma.category.create({ data: { name } });
    return Response.json(category, { status: 201 });
  } catch (error) {
    return fail(error, "สร้างหมวดหมู่ไม่สำเร็จ");
  }
}
