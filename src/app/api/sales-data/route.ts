import { prisma } from "../../lib/prisma";
import { requireAdmin, fail } from "../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Revenue per product, computed from order items rather than a cached column. */
export async function GET() {
  try {
    await requireAdmin();

    const grouped = await prisma.orderItem.groupBy({
      by: ["postId"],
      _sum: { totalPrice: true, quantity: true },
    });
    if (grouped.length === 0) return Response.json([]);

    const posts = await prisma.post.findMany({
      where: { id: { in: grouped.map((g) => g.postId) } },
      select: { id: true, title: true },
    });
    const titleById = new Map(posts.map((p) => [p.id, p.title]));

    const rows = grouped
      .map((g) => ({
        postId: g.postId,
        title: titleById.get(g.postId) ?? "สินค้าที่ถูกลบแล้ว",
        revenue: g._sum.totalPrice ?? 0,
        units: g._sum.quantity ?? 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    return Response.json(rows);
  } catch (error) {
    return fail(error, "โหลดข้อมูลยอดขายไม่สำเร็จ");
  }
}
