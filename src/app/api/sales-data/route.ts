import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ดึงข้อมูลยอดขายของแต่ละผลิตภัณฑ์
    const salesData = await prisma.orderItem.groupBy({
      by: ['postId'],
      _sum: {
        totalPrice: true
      },
      select: {
        postId: true,
        _sum: {
          totalPrice: true
        }
      }
    });

    // ดึงข้อมูลชื่อผลิตภัณฑ์
    const posts = await prisma.post.findMany({
      where: {
        id: {
          in: salesData.map(item => item.postId)
        }
      }
    });

    // จับคู่ข้อมูลยอดขายกับชื่อผลิตภัณฑ์
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
