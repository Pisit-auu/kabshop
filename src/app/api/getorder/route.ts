// src/app/api/order/route.ts

'use server';

import { prisma } from "../../lib/prisma"
export const runtime = "nodejs"

// GET method for fetching orders by userId
export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return new Response('User ID is required', { status: 400 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: Number(userId) },
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

    return new Response(JSON.stringify(orders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response('Failed to fetch orders', { status: 500 });
  }
}
