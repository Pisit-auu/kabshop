import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@auth/prisma-adapter'

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
          if (!credentials) return null
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (user && (await bcrypt.compare(credentials.password, user.password))) {
            return {
              // ✅ แปลง id เป็น string เพื่อให้ตรงกับ User interface ของ NextAuth
              id: user.id.toString(), 
              name: user.name,
              email: user.email,
              role: user.role,
              lineid: user.lineid,
              // แปลง phone เป็น string ด้วยถ้าใน Type ใหม่เรากำหนดเป็น string
              phone: user.phone?.toString() || "", 
              address: user.address
            }
          }
          throw new Error('Invalid email or password')
        }
    })
  ],
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt' as const,
  },
 callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // user ในที่นี้จะอ้างอิงตาม Interface User ที่เราขยายไว้ด้านบน
        token.id = user.id as string;
        token.role = user.role as string;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        // token ในที่นี้จะมี id และ role ตามที่เราขยายไว้ใน JWT
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }