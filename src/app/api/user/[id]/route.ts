import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()


export async function GET(request: Request,{params}: {params: {id:string }}

) {
    const email = params.id;
    const user = await prisma.user.findUnique({
        where: {
            email: email,
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
    return Response.json(user)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const email = params.id;
    const { name, email: newEmail, phone, lineid, address,purchaseamount } = await req.json();
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: {
        name,
        email: newEmail,
        phone,
        lineid,
        address,
        purchaseamount,
      },
    });
    return new Response(JSON.stringify(updatedUser), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(error.message || 'An error occurred', {
      status: 500,
    });
  }
}
export async function DELETE(request: Request,{params}: {params: {id:string }}){
    try{
        const userId = Number(params.id)
    
        const deleteduser = await prisma.user.delete({
            where:{id:userId}
    
        })
    
    
        return Response.json(deleteduser)
    }catch(error){
        return new Response(error as BodyInit,{
            status: 500,
        })
    }
}
