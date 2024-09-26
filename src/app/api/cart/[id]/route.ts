import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const cart = Number(params.id)
      const carts = await prisma.cart.findUnique({
        where: { id: cart },
        include: {
            post: true // Include related posts in the response
        },
      })
      return Response.json(carts)
    } catch (error) {
      return new Response(error as BodyInit, {
        status: 500,
      })
    }
  }
  export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const { value } = await req.json()
      const cart = await prisma.cart.update({
        where: { id: Number(params.id) },
        data: { value },
      })
      return Response.json(cart)
    } catch (error) {
      return new Response(error as BodyInit, {
        status: 500,
      })
    }
  }

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    return Response.json(
      await prisma.cart.delete({
        where: { id: Number(params.id) },
      })
    )
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}