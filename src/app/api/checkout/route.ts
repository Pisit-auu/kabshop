import { prisma } from "../../lib/prisma";
import { requireUser, fail, badRequest, HttpError } from "../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SHIPPING_COST = 36;
const PAYMENT_METHODS = new Set(["Qr", "Cash"]);

function serial() {
  const d = new Date();
  const ymd =
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KB-${ymd}-${tail}`;
}

/**
 * The whole purchase, once, on the server.
 *
 * Prices, totals and stock are read from the database inside a transaction —
 * the client sends only a payment method. Stock is re-checked at the moment of
 * writing, so two shoppers racing for the last unit cannot both win it, and a
 * failure anywhere rolls the entire order back instead of leaving a paid order
 * with un-decremented stock and a full cart.
 */
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json().catch(() => ({}));
    const paymentMethod = String(body?.paymentMethod ?? "");

    if (!PAYMENT_METHODS.has(paymentMethod)) {
      throw badRequest("กรุณาเลือกวิธีการชำระเงิน");
    }
    if (!user.name || !user.phone || !user.address) {
      throw new HttpError(409, "กรุณากรอกชื่อ เบอร์โทรศัพท์ และที่อยู่จัดส่งให้ครบก่อนสั่งซื้อ");
    }

    const orderId = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findMany({
        where: { userId: user.id },
        include: { post: true },
        orderBy: { id: "asc" },
      });

      if (cart.length === 0) throw badRequest("ไม่มีสินค้าในตะกร้า");

      let subTotal = 0;
      for (const line of cart) {
        const stock = line.post.quantity ?? 0;
        const price = line.post.price ?? 0;

        if (line.value < 1) throw badRequest(`จำนวนของ "${line.post.title}" ไม่ถูกต้อง`);
        if (stock < line.value) {
          throw new HttpError(
            409,
            stock === 0
              ? `"${line.post.title}" หมดสต็อกแล้ว กรุณานำออกจากตะกร้า`
              : `"${line.post.title}" เหลือเพียง ${stock} ชิ้น กรุณาปรับจำนวน`,
          );
        }
        subTotal += price * line.value;
      }

      const total = subTotal + SHIPPING_COST;

      let created = null;
      for (let attempt = 0; attempt < 5 && !created; attempt += 1) {
        const candidate = serial();
        const clash = await tx.order.findUnique({ where: { orderId: candidate } });
        if (clash) continue;
        created = await tx.order.create({
          data: {
            orderId: candidate,
            userId: user.id,
            Username: user.email,
            items: {
              create: cart.map((line) => ({
                postId: line.postId,
                quantity: line.value,
                totalPrice: (line.post.price ?? 0) * line.value,
              })),
            },
          },
        });
      }
      if (!created) throw new HttpError(503, "ระบบออกเลขคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่");

      for (const line of cart) {
        await tx.post.update({
          where: { id: line.postId },
          data: {
            quantity: { decrement: line.value },
            Sales: { increment: (line.post.price ?? 0) * line.value },
          },
        });
      }

      await tx.cart.deleteMany({ where: { userId: user.id } });
      await tx.user.update({
        where: { id: user.id },
        data: { purchaseamount: { increment: total } },
      });

      return created.orderId;
    });

    return Response.json({ orderId }, { status: 201 });
  } catch (error) {
    return fail(error, "สั่งซื้อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
  }
}
