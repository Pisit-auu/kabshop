import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const topBuyer = await prisma.user.findFirst({
      orderBy: {
        purchaseamount: 'desc',
      },
    });

    if (!topBuyer) {
      return new NextResponse('No buyer data found', { status: 404 });
    }

    // ส่งกลับแค่ข้อมูล purchaseamount
    return NextResponse.json({ purchaseamount: topBuyer.purchaseamount, name: topBuyer.name });
  } catch (error) {
    console.error('Error fetching top buyer:', error);
    return new NextResponse('Failed to fetch top buyer', { status: 500 });
  }
}
