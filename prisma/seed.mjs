// สร้าง (หรืออัปเดต) บัญชี superadmin จาก env
//   SUPERADMIN_EMAIL=... SUPERADMIN_PASSWORD=... npx prisma db seed
// ไม่มีรหัสผ่านอยู่ในโค้ด — ต้องส่งผ่าน env เท่านั้น
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const email = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.SUPERADMIN_PASSWORD;

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("ต้องตั้ง SUPERADMIN_EMAIL ให้เป็นอีเมลที่ถูกต้องก่อนรัน seed");
  process.exit(1);
}
if (!password || password.length < 12 || password.length > 72) {
  console.error("ต้องตั้ง SUPERADMIN_PASSWORD (12–72 ตัวอักษร) ก่อนรัน seed");
  process.exit(1);
}

const hashed = await bcrypt.hash(password, 12);

const user = await prisma.user.upsert({
  where: { email },
  update: { password: hashed, role: "superadmin" },
  create: { email, password: hashed, role: "superadmin", name: "Super Admin" },
  select: { id: true, email: true, role: true },
});

console.log(`superadmin พร้อมใช้งาน: ${user.email} (id ${user.id})`);
await prisma.$disconnect();
