import { prisma } from "../../lib/prisma";
import { requireUser, fail } from "../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Your own purchase history. The user id comes from the session; the old
 * route took it from a query string, so any id returned anyone's orders.
 */
export async function GET() {
  try {
    const me = await requireUser();
    const orders = await prisma.order.findMany({
      where: { userId: me.id },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { post: { select: { title: true, img: true } } } } },
    });
    return Response.json(orders);
  } catch (error) {
    return fail(error, "โหลดประวัติการสั่งซื้อไม่สำเร็จ");
  }
}
