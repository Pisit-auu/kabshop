import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const userId = Number(params.id);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        cart: {
          include: {
            post: true,
          },
        },order: {
          
        }
      },
    });
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }