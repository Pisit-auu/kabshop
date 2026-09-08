import { prisma } from "../../lib/prisma";
import { requireUser, fail, intOrFail, badRequest, HttpError } from "../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Only ever your own cart. The old route returned every row in the table. */
export async function GET() {
  try {
    const user = await requireUser();
    const cart = await prisma.cart.findMany({
      where: { userId: user.id },
      include: { post: { include: { category: true } } },
      orderBy: { id: "asc" },
    });
    return Response.json(cart);
  } catch (error) {
    return fail(error, "โหลดตะกร้าไม่สำเร็จ");
  }
}

/**
 * Adds to the signed-in user's cart. The userId comes from the session, so a
 * shopper can no longer write into someone else's cart by editing the body.
 */
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json().catch(() => ({}));
    const postId = intOrFail(body.postId, "รหัสสินค้า");
    const quantity = intOrFail(body.quantity, "จำนวน", { min: 1, max: 999 });
    const mode = body.mode === "add" ? "add" : "set";

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new HttpError(404, "ไม่พบสินค้าชิ้นนี้");

    const stock = post.quantity ?? 0;
    if (stock < 1) throw new HttpError(409, `"${post.title}" หมดสต็อกแล้ว`);

    const existing = await prisma.cart.findUnique({
      where: { userId_postId: { userId: user.id, postId } },
    });
    const wanted = mode === "add" ? (existing?.value ?? 0) + quantity : quantity;

    if (wanted > stock) {
      throw new HttpError(409, `"${post.title}" เหลือ ${stock} ชิ้น ใส่ตะกร้าได้ไม่เกินจำนวนนี้`);
    }

    const line = await prisma.cart.upsert({
      where: { userId_postId: { userId: user.id, postId } },
      update: { value: wanted },
      create: { userId: user.id, postId, value: wanted },
    });

    const cartCount = await prisma.cart.count({ where: { userId: user.id } });
    return Response.json({ line, cartCount });
  } catch (error) {
    return fail(error, "เพิ่มสินค้าลงตะกร้าไม่สำเร็จ");
  }
}
