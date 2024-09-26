import { type NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export async function GET(request: NextRequest){
    const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'desc'

    let whereCondition = category ? {
        category: {
            is: {
              name: category,
            },
          },
        title: {
            contains: search,
            mode: 'insensitive'
           },        
    }: {
        title: {
            contains: search,
            mode: 'insensitive'
           },   
    }
    const posts = await prisma.post.findMany({
        where: whereCondition as any,
        orderBy:{
            createdAt: sort,

        } as any,
        include: {
            category: true, // Include category data in the response
          },
    })
    return Response.json(posts)
}

export async function POST( request: Request){
    const { title,price, content,categoryId,quantity,img } = await request.json()
    const newPost = await prisma.post.create({
        data:{
            title,
            price,
            content,
            img,
            quantity,
            categoryId: Number(categoryId) }
    })
    return Response.json(newPost)
}