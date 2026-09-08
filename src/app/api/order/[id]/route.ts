import { prisma } from "../../../lib/prisma";
import { requireUser, fail, HttpError } from "../../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A receipt is readable by the person who bought it, or by an admin. */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const me = await requireUser();
    const order = await prisma.order.findUnique({
      where: { orderId: params.id },
      include: {
        user: { select: { name: true, email: true, phone: true, address: true } },
        items: { include: { post: { select: { title: true, img: true } } } },
      },
    });

    if (!order) throw new HttpError(404, "ไม่พบคำสั่งซื้อหมายเลขนี้");
    if (order.userId !== me.id && me.role !== "admin") {
      throw new HttpError(403, "คำสั่งซื้อนี้ไม่ได้เป็นของบัญชีคุณ");
    }

    return Response.json({
      orderId: order.orderId,
      createdAt: order.createdAt.toISOString(),
      recipient: {
        name: order.user?.name ?? null,
        phone: order.user?.phone ?? null,
        address: order.user?.address ?? null,
      },
      items: order.items.map((item) => ({
        postId: item.postId,
        title: item.post.title,
        img: item.post.img,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
    });
  } catch (error) {
    return fail(error, "โหลดคำสั่งซื้อไม่สำเร็จ");
  }
}
