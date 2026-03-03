import { prisma } from "../../../lib/prisma"
export const runtime = "nodejs"

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