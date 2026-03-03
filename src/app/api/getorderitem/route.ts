import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. ดึงข้อมูล OrderItem ทั้งหมด
    const orderItems = await prisma.orderItem.findMany({
      select: {
        postId: true,
        totalPrice: true,
      },
    });

    // 2. คำนวณยอดขายรวมแยกตาม postId ด้วย Map
    const salesMap = new Map<number, number>();
    orderItems.forEach(item => {
      const currentSales = salesMap.get(item.postId) || 0;
      salesMap.set(item.postId, currentSales + item.totalPrice);
    });

    // 3. เตรียมคำสั่ง Update ทั้งหมดไว้ในรูปแบบของ Array of Promises
    const updatePromises = Array.from(salesMap.entries()).map(([postId, totalSales]) =>
      prisma.post.update({
        where: { id: postId },
        data: { Sales: totalSales },
      })
    );

    // 4. รอให้ทุกรายการอัปเดตเสร็จพร้อมกัน (Parallel Update)
    await Promise.all(updatePromises);

    return new Response(JSON.stringify({ 
      message: 'Sales updated successfully',
      updatedCount: updatePromises.length 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error updating sales:', error);
    return new Response(JSON.stringify({ error: 'Failed to update sales' }), {
      status: 500,
    });
  }
}