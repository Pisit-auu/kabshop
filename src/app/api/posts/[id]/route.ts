import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()


export async function GET(request: Request, { params }: { params: { id: string } }) {
  const postId = Number(params.id);
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      category: true,
      cart: true
    },
  });
  return new Response(JSON.stringify(post), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}



export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      // เปลี่ยนเป็น categoryId
      const { title, content,img, categoryId ,quantity,price,Sales} = await req.json()
      const post = await prisma.post.update({
        where: { id: Number(params.id) },
        data: { title, content,img, categoryId, quantity,price,Sales},
      })
      return Response.json(post)
    } catch (error) {
      return new Response(error as BodyInit, {
        status: 500,
      })
    }
  }



export async function DELETE(request: Request,{params}: {params: {id:string }}){
    try{
        const postId = Number(params.id)
    
        const deletedPost = await prisma.post.delete({
            where:{id:postId}
    
        })
    
    
        return Response.json(deletedPost)
    }catch(error){
        return new Response(error as BodyInit,{
            status: 500,
        })
    }
}
