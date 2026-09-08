import { prisma } from "../../lib/prisma";
import { requireAdmin, fail } from "../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The whole shop's order log. Admin only.
 * Order creation lives in POST /api/checkout, inside one transaction — this
 * route no longer accepts writes, so an order can never exist without its
 * stock decrement.
 */
export async function GET() {
  try {
    await requireAdmin();
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { post: { select: { title: true, img: true } } } },
      },
    });
    return Response.json(orders);
  } catch (error) {
    return fail(error, "โหลดรายการสั่งซื้อไม่สำเร็จ");
  }
}
