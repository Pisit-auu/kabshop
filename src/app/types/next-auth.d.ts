// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // ใช้ string ตามที่แปลงมาข้างบน
      role?: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string; // ต้องเป็น string เท่านั้น
    role?: string;
  }
}