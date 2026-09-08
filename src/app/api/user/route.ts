import { prisma } from "../../lib/prisma";
import { requireAdmin, fail } from "../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Shop-wide figures. Admin only — this used to be readable by anyone. */
export async function GET() {
  try {
    await requireAdmin();

    const [topBuyer, memberCount] = await Promise.all([
      prisma.user.findFirst({
        where: { purchaseamount: { gt: 0 } },
        orderBy: { purchaseamount: "desc" },
        select: { name: true, email: true, purchaseamount: true },
      }),
      prisma.user.count(),
    ]);

    return Response.json({
      topBuyer: topBuyer
        ? { name: topBuyer.name || topBuyer.email, purchaseamount: topBuyer.purchaseamount }
        : null,
      memberCount,
    });
  } catch (error) {
    return fail(error, "โหลดข้อมูลสรุปไม่สำเร็จ");
  }
}
