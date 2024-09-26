import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ดึงผู้ที่ซื้อสินค้ามากที่สุด
    const topBuyer = await prisma.user.findFirst({
      orderBy: {
        cart: {
          _count: 'desc'
        }
      },
      select: {
        name: true,
      }
    });

    if (!topBuyer) {
      return new Response('Top buyer not found', { status: 404 });
    }

    return new Response(JSON.stringify(topBuyer), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching top buyer:', error);
    return new Response('Failed to fetch top buyer', { status: 500 });
  }
}
