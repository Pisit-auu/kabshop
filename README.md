# KABSHOP — ร้านค้าออนไลน์สินค้าทั่วไป

**KABSHOP** เป็นเว็บร้านค้าออนไลน์แบบ Full-stack สำหรับขายสินค้าหลายหมวดหมู่ในร้านเดียว พัฒนาด้วย Next.js 14 (App Router), Prisma, PostgreSQL และ NextAuth

หน้าร้านกับหลังร้านอยู่ในแอปเดียวกันและใช้ระบบบัญชีเดียวกัน ลูกค้าเลือกสินค้า ใส่ตะกร้า สั่งซื้อ และดูประวัติคำสั่งซื้อได้ ส่วนเจ้าของร้าน (แอดมิน) จัดการสินค้า หมวดหมู่ สต็อก และดูยอดขายได้จากเบราว์เซอร์

---

## สารบัญ

- [ฟีเจอร์หลัก](#ฟีเจอร์หลัก)
- [ผู้ใช้งานและสิทธิ์](#ผู้ใช้งานและสิทธิ์)
- [Tech Stack](#tech-stack)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [โครงสร้างฐานข้อมูล](#โครงสร้างฐานข้อมูล)
- [ขั้นตอนการสั่งซื้อ](#ขั้นตอนการสั่งซื้อ)
- [เริ่มต้นใช้งาน](#เริ่มต้นใช้งาน)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [หน้าเว็บ (Routes)](#หน้าเว็บ-routes)
- [API Endpoints](#api-endpoints)
- [ความปลอดภัย](#ความปลอดภัย)
- [การ Deploy](#การ-deploy)
- [ระบบดีไซน์](#ระบบดีไซน์)
- [ข้อจำกัดที่ทราบ](#ข้อจำกัดที่ทราบ)

---

## ฟีเจอร์หลัก

### ลูกค้า
- **เลือกดูสินค้า** ค้นหาด้วยชื่อ กรองตามหมวดหมู่ และเรียงตามวันที่เพิ่ม (ไม่ต้องล็อกอิน)
- **หน้ารายละเอียดสินค้า** แสดงรูป ราคา จำนวนคงเหลือ และคำอธิบาย
- **สมัครสมาชิก / เข้าสู่ระบบ** ด้วยอีเมลและรหัสผ่าน (อีเมลไม่สนตัวพิมพ์เล็ก-ใหญ่)
- **ตะกร้าสินค้า** เพิ่ม ปรับจำนวน และลบสินค้า พร้อมตัวนับจำนวนรายการบนแถบเมนู
- **ข้อมูลจัดส่ง** แก้ไขชื่อ เบอร์โทร Line ID และที่อยู่
- **สั่งซื้อ (Checkout)** เลือกชำระผ่าน QR พร้อมเพย์ หรือเก็บเงินปลายทาง ค่าส่งเหมาเรต ฿36 ต่อคำสั่งซื้อ
- **ใบเสร็จ** แสดงเลขคำสั่งซื้อและรายการสินค้าหลังสั่งซื้อสำเร็จ
- **ประวัติคำสั่งซื้อ** ดูคำสั่งซื้อทั้งหมดของตัวเอง

### แอดมิน
- **แดชบอร์ดหลังร้าน** ภาพรวมสินค้า หมวดหมู่ ผู้ใช้ และคำสั่งซื้อในหน้าเดียว
- **จัดการสินค้า** เพิ่ม แก้ไข ลบ พร้อมอัปโหลดรูปขึ้น Cloudinary
- **จัดการหมวดหมู่** เพิ่ม แก้ไข ลบ
- **กราฟยอดขายรายสินค้า** แสดงด้วย Chart.js (Bar chart)
- **ดูรายชื่อผู้ใช้และคำสั่งซื้อทั้งหมด**

### ทั้งระบบ
- UI ภาษาไทย รองรับทั้งมือถือและคอมพิวเตอร์
- มีหน้า loading, error และ 404 ของตัวเอง

---

## ผู้ใช้งานและสิทธิ์

| ผู้ใช้ | สิทธิ์ |
|--------|--------|
| ผู้เยี่ยมชม (ยังไม่ล็อกอิน) | ดูสินค้า ค้นหา ดูรายละเอียดสินค้า |
| `member` (ค่าเริ่มต้นเมื่อสมัคร) | ทุกอย่างของผู้เยี่ยมชม + ตะกร้า สั่งซื้อ แก้ไขข้อมูลส่วนตัว ดูประวัติคำสั่งซื้อของตัวเอง |
| `admin` | ทุกอย่างของ `member` + เข้า `/admin` จัดการสินค้า หมวดหมู่ ดูผู้ใช้ คำสั่งซื้อ และยอดขาย |

สิทธิ์ถูกตรวจที่ฝั่งเซิร์ฟเวอร์ทุก API ผ่าน `src/app/lib/guard.ts` (`requireUser`, `requireAdmin`) และอ่านตัวตนผู้ใช้จาก session cookie เท่านั้น ไม่เชื่อค่าที่ส่งมาใน request body

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) + React 18 |
| ภาษา | TypeScript (บางไฟล์ยังเป็น `.jsx`) |
| Styling | Tailwind CSS 3 + ไอคอน lucide-react |
| ORM | Prisma 5 |
| Database | PostgreSQL |
| Authentication | NextAuth v4 (Credentials Provider, JWT session) + bcrypt |
| เก็บรูปภาพ | Cloudinary |
| กราฟ | Chart.js + react-chartjs-2 |
| Deploy | Vercel |

---

## โครงสร้างโปรเจกต์

```
kabshop/
├── prisma/
│   ├── schema.prisma              # Schema ฐานข้อมูล
│   └── migrations/                # Migration history
├── public/                        # โลโก้ (KAB.png) และรูปประกอบ
├── src/app/
│   ├── page.tsx                   # หน้าแรก / รายการสินค้า
│   ├── layout.tsx                 # Root layout (SessionProvider, masthead, footer)
│   ├── loading.tsx, error.tsx, not-found.tsx
│   ├── product/[id]/              # รายละเอียดสินค้า
│   ├── products/[id]/             # path เดิม redirect ไป /product/[id]
│   ├── home/                      # path เดิม redirect ไป /
│   ├── cart/                      # ตะกร้าสินค้า
│   ├── checkout/                  # ยืนยันคำสั่งซื้อ + เลือกวิธีชำระเงิน
│   ├── bill/                      # ใบเสร็จหลังสั่งซื้อ
│   ├── user/
│   │   ├── login/, register/      # เข้าสู่ระบบ / สมัครสมาชิก
│   │   └── profile/
│   │       ├── information/       # แก้ไขข้อมูลจัดส่ง
│   │       └── all/               # ประวัติคำสั่งซื้อ
│   ├── admin/                     # แดชบอร์ด, เพิ่ม/แก้ไขสินค้าและหมวดหมู่
│   ├── api/                       # Route Handlers (REST API)
│   ├── components/                # masthead, sidebar, rack, flash, requireauth, adminform ฯลฯ
│   ├── lib/
│   │   ├── auth.ts                # การตั้งค่า NextAuth
│   │   ├── guard.ts               # ตรวจสิทธิ์ + ตรวจข้อมูลขาเข้า
│   │   ├── prisma.ts              # Prisma client
│   │   └── cloudinary.tsx         # การตั้งค่า Cloudinary
│   └── types/next-auth.d.ts       # ขยาย type ของ Session/JWT
├── PRODUCT.md                     # บริบทผลิตภัณฑ์และผู้ใช้
├── DESIGN.md                      # ระบบดีไซน์
└── tailwind.config.js
```

---

## โครงสร้างฐานข้อมูล

```
Category 1───* Post *───* Cart *───1 User
                 │                    │
                 └──* OrderItem *──1 Order *──┘
```

| Model | หน้าที่ | ฟิลด์สำคัญ |
|-------|---------|------------|
| `Post` | สินค้า | `title`, `price`, `quantity` (สต็อก), `content`, `img`, `Sales` (ยอดขายสะสมเป็นบาท), `categoryId` |
| `Category` | หมวดหมู่สินค้า | `name` (unique) |
| `User` | ผู้ใช้ | `email` (unique), `password` (hash), `name`, `phone`, `lineid`, `address`, `role` (`member`/`admin`), `purchaseamount` (ยอดซื้อสะสม) |
| `Cart` | สินค้าในตะกร้า | `userId`, `postId`, `value` (จำนวน) unique คู่ผู้ใช้+สินค้า |
| `Order` | คำสั่งซื้อ | `orderId` (เลขคำสั่งซื้อ unique), `userId`, `Username`, `createdAt` |
| `OrderItem` | รายการในคำสั่งซื้อ | `orderId`, `postId`, `quantity`, `totalPrice` |

> `Post` คือ "สินค้า" (ชื่อ model มาจากเวอร์ชันแรกของโปรเจกต์)

---

## ขั้นตอนการสั่งซื้อ

`POST /api/checkout` ทำการสั่งซื้อทั้งหมดในฝั่งเซิร์ฟเวอร์ภายใน **database transaction เดียว** โดย client ส่งมาแค่วิธีชำระเงิน

1. ตรวจว่าล็อกอินแล้ว และเลือกวิธีชำระเงินเป็น `Qr` หรือ `Cash`
2. ตรวจว่าข้อมูลจัดส่ง (ชื่อ เบอร์โทร ที่อยู่) ครบ ถ้าไม่ครบตอบ `409`
3. อ่านตะกร้าและราคาจากฐานข้อมูล (ไม่เชื่อราคาจาก client)
4. ตรวจสต็อกของทุกรายการ ถ้าไม่พอตอบ `409` พร้อมข้อความบอกว่าสินค้าไหนเหลือเท่าไร
5. คำนวณยอดรวม = ราคาสินค้า + ค่าส่ง ฿36
6. ออกเลขคำสั่งซื้อรูปแบบ `KB-YYMMDD-XXXX` (สุ่มใหม่ถ้าซ้ำ สูงสุด 5 ครั้ง)
7. สร้าง `Order` + `OrderItem` ตัดสต็อก เพิ่ม `Sales` ของสินค้า ล้างตะกร้า และเพิ่ม `purchaseamount` ของผู้ใช้
8. ถ้าขั้นตอนใดล้มเหลว ทุกอย่างจะ rollback ไม่มีกรณีคำสั่งซื้อถูกสร้างแต่สต็อกไม่ถูกตัด

> ยังไม่ได้เชื่อม payment gateway การเลือกวิธีชำระเงินเป็นเพียงการบันทึกความต้องการ ทางร้านส่ง QR ให้ลูกค้าเองหลังยืนยันคำสั่งซื้อ

---

## เริ่มต้นใช้งาน

### สิ่งที่ต้องมี
- Node.js 18.17 ขึ้นไป
- PostgreSQL (ติดตั้งเอง หรือใช้บริการเช่น Supabase / Neon)
- บัญชี [Cloudinary](https://cloudinary.com/) สำหรับอัปโหลดรูปสินค้า

### ขั้นตอน

```bash
# 1. Clone โปรเจกต์
git clone https://github.com/Pisit-auu/kabshop.git
cd kabshop

# 2. ติดตั้ง dependencies (postinstall จะรัน prisma generate ให้อัตโนมัติ)
npm install

# 3. สร้างไฟล์ .env (ดูหัวข้อ Environment Variables)

# 4. สร้างตารางในฐานข้อมูลตาม migration
npx prisma migrate deploy

# 5. รัน development server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

### สร้างแอดมินคนแรก

1. สมัครสมาชิกตามปกติที่หน้า `/user/register`
2. เปิด Prisma Studio ด้วย `npx prisma studio`
3. แก้ฟิลด์ `role` ของผู้ใช้นั้นในตาราง `User` จาก `member` เป็น `admin`
4. ออกจากระบบแล้วล็อกอินใหม่ จะเข้าหน้า `/admin` ได้

---

## Environment Variables

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์:

```env
# PostgreSQL (ถ้าใช้ connection pooler ให้ใส่ URL ของ pooler ที่นี่)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/kabshop"
# Connection ตรงสำหรับ prisma migrate (ถ้าไม่ได้ใช้ pooler ใส่ค่าเดียวกับ DATABASE_URL)
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/kabshop"

# NextAuth
NEXTAUTH_SECRET="random-secret-string"   # สร้างได้ด้วย: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

| ตัวแปร | จำเป็น | คำอธิบาย |
|--------|:------:|----------|
| `DATABASE_URL` | ✅ | Connection string ของ PostgreSQL |
| `DIRECT_URL` | ✅ | Connection ตรงสำหรับ Prisma migrate |
| `NEXTAUTH_SECRET` | ✅ | คีย์เข้ารหัส JWT session |
| `NEXTAUTH_URL` | ✅ (production) | URL หลักของเว็บ |
| `CLOUDINARY_CLOUD_NAME` | ✅ | ชื่อ cloud ของ Cloudinary |
| `CLOUDINARY_API_KEY` | ✅ | API key ของ Cloudinary |
| `CLOUDINARY_API_SECRET` | ✅ | API secret ของ Cloudinary |

> **อย่า commit ไฟล์ `.env`** ไฟล์นี้อยู่ใน `.gitignore` แล้ว

---

## Scripts

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `npm run dev` | รัน development server |
| `npm run build` | build สำหรับ production |
| `npm run start` | รัน production server (ต้อง build ก่อน) |
| `npm run lint` | ตรวจโค้ดด้วย ESLint |
| `npx prisma studio` | เปิด GUI ดู/แก้ข้อมูลในฐานข้อมูล |
| `npx prisma migrate dev` | สร้างและรัน migration ระหว่างพัฒนา |

---

## หน้าเว็บ (Routes)

| เส้นทาง | สิทธิ์ | คำอธิบาย |
|---------|--------|----------|
| `/` | ทุกคน | หน้าแรก รายการสินค้า ค้นหา กรองหมวดหมู่ |
| `/product/[id]` | ทุกคน | รายละเอียดสินค้า + เพิ่มลงตะกร้า |
| `/user/register` | ทุกคน | สมัครสมาชิก |
| `/user/login` | ทุกคน | เข้าสู่ระบบ |
| `/cart` | สมาชิก | ตะกร้าสินค้า |
| `/checkout` | สมาชิก | ยืนยันที่อยู่และเลือกวิธีชำระเงิน |
| `/bill` | สมาชิก | ใบเสร็จคำสั่งซื้อ |
| `/user/profile/information` | สมาชิก | แก้ไขข้อมูลส่วนตัวและที่อยู่จัดส่ง |
| `/user/profile/all` | สมาชิก | ประวัติคำสั่งซื้อ |
| `/admin` | แอดมิน | แดชบอร์ด: สินค้า หมวดหมู่ ผู้ใช้ คำสั่งซื้อ กราฟยอดขาย |
| `/admin/create` | แอดมิน | เพิ่มสินค้า |
| `/admin/edit/[id]` | แอดมิน | แก้ไขสินค้า |
| `/admin/createcategory` | แอดมิน | เพิ่มหมวดหมู่ |
| `/admin/editcategory/[id]` | แอดมิน | แก้ไขหมวดหมู่ |
| `/home`, `/products/[id]` | — | path เดิม redirect ไปหน้าใหม่ |

---

## API Endpoints

ทุก endpoint อยู่ใต้ `/api` รับ/ส่ง JSON และตอบ error ในรูปแบบ `{ "error": "ข้อความ" }`

### สินค้า
| Method | Path | สิทธิ์ | คำอธิบาย |
|--------|------|--------|----------|
| GET | `/api?search=&category=&sort=asc\|desc` | ทุกคน | รายการสินค้า ค้นหาด้วยชื่อ กรองหมวดหมู่ และเรียงตามวันที่ |
| POST | `/api` | แอดมิน | เพิ่มสินค้า |
| GET | `/api/posts/[id]` | ทุกคน | รายละเอียดสินค้า |
| PUT / DELETE | `/api/posts/[id]` | แอดมิน | แก้ไข / ลบสินค้า |

### หมวดหมู่
| Method | Path | สิทธิ์ | คำอธิบาย |
|--------|------|--------|----------|
| GET | `/api/categories` | ทุกคน | รายการหมวดหมู่ |
| POST | `/api/categories` | แอดมิน | เพิ่มหมวดหมู่ |
| GET | `/api/categories/[id]` | ทุกคน | ข้อมูลหมวดหมู่ |
| PUT / DELETE | `/api/categories/[id]` | แอดมิน | แก้ไข / ลบหมวดหมู่ |

### ตะกร้าและการสั่งซื้อ
| Method | Path | สิทธิ์ | คำอธิบาย |
|--------|------|--------|----------|
| GET / POST | `/api/cart` | สมาชิก | ดูตะกร้า / เพิ่มสินค้าลงตะกร้า |
| GET / PUT / DELETE | `/api/cart/[id]` | สมาชิก | อ่าน / ปรับจำนวน / ลบรายการในตะกร้า |
| POST | `/api/checkout` | สมาชิก | สั่งซื้อ (body: `{ "paymentMethod": "Qr" \| "Cash" }`) |
| GET | `/api/getorder` | สมาชิก | คำสั่งซื้อทั้งหมดของผู้ใช้ปัจจุบัน |
| GET | `/api/order/[orderId]` | เจ้าของคำสั่งซื้อ / แอดมิน | รายละเอียดคำสั่งซื้อตามเลขคำสั่งซื้อ |
| GET | `/api/order` | แอดมิน | คำสั่งซื้อทั้งหมด |
| GET | `/api/sales-data` | แอดมิน | ข้อมูลยอดขายรายสินค้าสำหรับกราฟ |

### ผู้ใช้และการยืนยันตัวตน
| Method | Path | สิทธิ์ | คำอธิบาย |
|--------|------|--------|----------|
| GET / POST | `/api/auth/[...nextauth]` | — | NextAuth (login / session / logout) |
| POST | `/api/auth/signup` | ทุกคน | สมัครสมาชิก (อีเมล, รหัสผ่าน 8–72 ตัวอักษร, ชื่อ) |
| GET | `/api/me` | ทุกคน | ผู้ใช้ปัจจุบัน สิทธิ์แอดมิน และจำนวนรายการในตะกร้า (`{ user: null }` ถ้ายังไม่ล็อกอิน) |
| GET / PUT | `/api/user/[email]` | เจ้าของบัญชี / แอดมิน | อ่าน / แก้ไขข้อมูลผู้ใช้ (ใช้อีเมลเป็น id) |
| GET | `/api/user` | แอดมิน | รายชื่อผู้ใช้ทั้งหมด |

### อัปโหลดรูป
| Method | Path | สิทธิ์ | คำอธิบาย |
|--------|------|--------|----------|
| POST | `/api/uploadimg` | แอดมิน | อัปโหลดรูปสินค้าขึ้น Cloudinary |

---

## ความปลอดภัย

- **ตรวจสิทธิ์ฝั่งเซิร์ฟเวอร์ทุก API** ที่แก้ไขข้อมูลหรืออ่านข้อมูลส่วนตัว ผ่าน `requireUser()` / `requireAdmin()`
- **ตัวตนผู้ใช้มาจาก session เท่านั้น** ไม่รับ `userId` หรือ `email` จาก request body
- **ตรวจความเป็นเจ้าของ** ข้อมูลผู้ใช้และคำสั่งซื้อ อ่านได้เฉพาะเจ้าของหรือแอดมิน
- **ตรวจข้อมูลขาเข้า** ด้วย `intOrFail()` / `textOrFail()` จำกัดชนิดข้อมูล ช่วงตัวเลข และความยาวข้อความ
- **ราคาและสต็อกคำนวณจากฐานข้อมูล** ตอน checkout ไม่เชื่อค่าจาก client และใช้ transaction กันการแย่งซื้อสินค้าชิ้นสุดท้ายพร้อมกัน
- **รหัสผ่านเก็บแบบ bcrypt hash** และ API สมัครสมาชิกไม่ส่งข้อมูลผู้ใช้กลับ

---

## การ Deploy

โปรเจกต์ deploy บน **Vercel** ได้โดยตรง

1. Import repo เข้า Vercel
2. ตั้ง Environment Variables ทั้งหมดในหัวข้อด้านบน (`NEXTAUTH_URL` เป็นโดเมนจริง)
3. Vercel จะรัน `npm install` (ซึ่งรัน `prisma generate`) และ `next build` ให้อัตโนมัติ
4. รัน migration กับฐานข้อมูล production ด้วย `npx prisma migrate deploy` (จากเครื่อง local ที่ตั้ง `DATABASE_URL`/`DIRECT_URL` เป็นค่า production)

`schema.prisma` ตั้ง `binaryTargets = ["native", "debian-openssl-3.0.x"]` ไว้แล้ว Prisma Client จึงใช้ได้ทั้งบนเครื่องพัฒนา WSL และ Linux server

---

## ระบบดีไซน์

UI ใช้แนวทาง **modern e-commerce** แบบมาตรฐาน ไม่สร้างธีมเฉพาะตัว

- พื้นหลังโทนกลางอุ่น การ์ดสินค้าสีขาว ปุ่มหลักสีเกือบดำ (`#16161a`)
- ใช้สีเฉพาะกับราคา/ความเร่งด่วน และสถานะคำสั่งซื้อ
- รายละเอียด token สี ตัวอักษร และหลักการออกแบบอยู่ใน [`DESIGN.md`](DESIGN.md)
- บริบทผู้ใช้ เป้าหมาย และข้อจำกัดของผลิตภัณฑ์อยู่ใน [`PRODUCT.md`](PRODUCT.md)

---

## ข้อจำกัดที่ทราบ

- **คำสั่งซื้อยังไม่มีสถานะ** (เช่น รอชำระ / จัดส่งแล้ว) ทุกคำสั่งซื้อถือว่าเสร็จสมบูรณ์
- **ยังไม่มี payment gateway** การชำระเงินด้วย QR ทำนอกระบบ
- **`Post.Sales` เก็บยอดขายเป็นบาท** ไม่ใช่จำนวนชิ้นที่ขายได้
- **ค่าส่งคงที่ ฿36** กำหนดไว้ในโค้ด (`SHIPPING_COST` ใน `src/app/api/checkout/route.ts`)
- **ภาษาใน UI** หน้าร้านเป็นภาษาไทย แต่บาง label ในหลังร้านยังเป็นภาษาอังกฤษ
