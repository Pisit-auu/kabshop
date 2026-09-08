import { NextRequest, NextResponse } from "next/server";
import cloudinary from "../../lib/cloudinary";
import { requireAdmin, fail, badRequest } from "../../lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

/** Admin only, typed and size-capped. This used to accept uploads from anyone. */
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) throw badRequest("ไม่พบไฟล์ที่อัปโหลด");
    if (!ALLOWED.has(file.type)) throw badRequest("รองรับเฉพาะไฟล์ JPG, PNG, WebP, AVIF และ GIF");
    if (file.size > MAX_BYTES) throw badRequest("ไฟล์ใหญ่เกิน 5 MB");

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploaded = await cloudinary.uploader.upload(base64Image, { folder: "uploads" });
    return NextResponse.json({ url: uploaded.secure_url });
  } catch (error) {
    return fail(error, "อัปโหลดรูปภาพไม่สำเร็จ");
  }
}
