import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all order items
    const orderItems = await prisma.orderItem.findMany({
      select: {
        postId: true,
        totalPrice: true,
        quantity: true,
      },
    });

    // Calculate total sales for each post
    const salesMap = new Map<number, number>();
    orderItems.forEach(item => {
      const currentSales = salesMap.get(item.postId) || 0;
      const itemTotal = item.totalPrice;
      salesMap.set(item.postId, currentSales + itemTotal);
    });

    // Update sales for each post
    for (const [postId, totalSales] of salesMap.entries()) {
      await prisma.post.update({
        where: { id: postId },
        data: { Sales: totalSales },
      });
    }

    return new Response(JSON.stringify({ message: 'Sales updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating sales:', error);
    return new Response('Failed to update sales', {
      status: 500,
    });
  }
}
