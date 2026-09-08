import { type NextRequest } from "next/server";
import { prisma } from "../lib/prisma";
import { requireAdmin, fail, intOrFail, textOrFail, badRequest } from "../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const category = sp.get("category")?.trim() || "";
    const search = sp.get("search")?.trim().slice(0, 120) || "";
    const sort = sp.get("sort") === "asc" ? "asc" : "desc";

    const posts = await prisma.post.findMany({
      where: {
        title: { contains: search, mode: "insensitive" },
        ...(category ? { category: { is: { name: category } } } : {}),
      },
      orderBy: { createdAt: sort },
      include: { category: true },
    });
    return Response.json(posts);
  } catch (error) {
    return fail(error, "โหลดรายการสินค้าไม่สำเร็จ");
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));

    const categoryId = intOrFail(body.categoryId, "หมวดหมู่");
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw badRequest("ไม่พบหมวดหมู่ที่เลือก");

    const post = await prisma.post.create({
      data: {
        title: textOrFail(body.title, "ชื่อสินค้า", { max: 160 }),
        content: textOrFail(body.content, "รายละเอียดสินค้า", { max: 4000 }),
        price: intOrFail(body.price, "ราคา", { min: 0, max: 10_000_000 }),
        quantity: intOrFail(body.quantity, "จำนวนในคลัง", { min: 0, max: 1_000_000 }),
        img: typeof body.img === "string" ? body.img.slice(0, 600) : null,
        categoryId,
      },
    });
    return Response.json(post, { status: 201 });
  } catch (error) {
    return fail(error, "บันทึกสินค้าไม่สำเร็จ");
  }
}
