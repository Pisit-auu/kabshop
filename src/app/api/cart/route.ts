import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const cart = await prisma.cart.findMany();
    return new Response(JSON.stringify(cart), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET Error:', error);
    return new Response('An error occurred while fetching cart items.', {
      status: 500,
    });
  }
}


export async function POST(req: Request) {
    const { userId, postId, quantity } = await req.json();

    try {
        // ตรวจสอบว่ามีโพสต์ที่ระบุหรือไม่
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return new Response('Post not found', { status: 404 });
        }

        // ตรวจสอบว่าปริมาณที่ต้องการไม่เกินปริมาณในโพสต์
        if (quantity > post.quantity) {
            return new Response('Quantity exceeds available stock', { status: 400 });
        }

        // อัปเดตหรือสร้างเรคคอร์ดในตะกร้า
        await prisma.cart.upsert({
            where: {
                userId_postId: { userId, postId }
            },
            update: {
                value: quantity // แทนที่ค่าที่มีอยู่ด้วยค่าใหม่
            },
            create: {
                userId,
                postId,
                value: quantity // สร้างเรคคอร์ดใหม่ถ้ายังไม่มี
            }
        });

        return new Response('Success', { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response('Error', { status: 500 });
    }
}