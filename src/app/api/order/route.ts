import { prisma } from "../../lib/prisma"
export const runtime = "nodejs"
import { NextResponse } from 'next/server';
// GET method for fetching orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            post: {
              select: {
                title: true,
                img: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new NextResponse('Failed to fetch orders', { status: 500 });
  }
}

// POST method for creating a new order
export async function POST(request: Request) {
  try {
    const { userId, orderId, items ,Username } = await request.json();

    // Create the order
    const newOrder = await prisma.order.create({
      data: {
        userId: userId,
        orderId: orderId,
        Username: Username,
        items: {
          create: items.map((item: any) => ({
            postId: item.postId,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
        },
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return new NextResponse('Failed to create order', { status: 500 });
  }
}
