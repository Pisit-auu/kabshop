import { prisma } from "../../lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  try {
    // 1. ดึงข้อมูลยอดขายโดยใช้ groupBy (ถอด select ออกเพื่อให้ TS ไม่ Error)
    const salesData = await prisma.orderItem.groupBy({
      by: ['postId'],
      _sum: {
        totalPrice: true
      }
    });

    // 2. ดึงข้อมูลชื่อผลิตภัณฑ์
    const posts = await prisma.post.findMany({
      where: {
        id: {
          in: salesData.map(item => item.postId)
        }
      }
    });

    // 3. จับคู่ข้อมูลยอดขายกับชื่อผลิตภัณฑ์
    const formattedSalesData = salesData.map(item => {
      const post = posts.find(p => p.id === item.postId);
      return {
        productName: post?.title || 'Unknown',
        totalSales: item._sum.totalPrice || 0
      };
    });

    return new Response(JSON.stringify(formattedSalesData), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return new Response('Failed to fetch sales data', { status: 500 });
  }
}