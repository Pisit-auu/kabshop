import { currentUser, fail } from "../../lib/guard";
import { prisma } from "../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One call for everything the chrome needs: who is signed in, whether they
 * administer the shop, and how many lines are in their cart. Replaces the
 * per-page `/api/user/<email>` round trip the whole app used to make.
 */
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return Response.json({ user: null }, { status: 200 });

    const cartCount = await prisma.cart.count({ where: { userId: user.id } });

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        lineid: user.lineid,
        address: user.address,
        role: user.role,
        purchaseamount: user.purchaseamount,
      },
      cartCount,
    });
  } catch (error) {
    return fail(error);
  }
}
