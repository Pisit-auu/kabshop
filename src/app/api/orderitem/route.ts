// /api/orderitem/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
      const { orderId, postId, quantity, totalPrice } = await request.json();
  
      // ตรวจสอบว่ามีข้อมูลที่ต้องการทั้งหมด
      if (!orderId || !postId || quantity === undefined || totalPrice === undefined) {
        return new Response('Missing required fields', { status: 400 });
      }
  
      // สร้าง OrderItem ใหม่ในฐานข้อมูล
      const newOrderItem = await prisma.orderItem.create({
        data: {
          orderId: Number(orderId),
          postId: Number(postId),
          quantity,
          totalPrice,
        },
      });
  
      return new Response(JSON.stringify(newOrderItem), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('POST Error:', error);
      return new Response('An error occurred while creating the order item.', {
        status: 500,
      });
    }
  }