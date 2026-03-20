import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '../../lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    // รับข้อมูลจาก formData()
    const formData = await req.formData();
    const file = formData.get('file');

    // ตรวจสอบว่าเป็น File หรือไม่
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded or invalid file type' }, { status: 400 });
    }

    // แปลง Blob เป็น Buffer (ใช้ stream เพื่อป้องกันปัญหาจาก experimental feature)
    const buffer = Buffer.from(await file.arrayBuffer());

    // สร้าง base64 string สำหรับอัปโหลด
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    // อัปโหลดภาพไปที่ Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'uploads',
    });

    // ส่ง URL ของไฟล์ที่อัปโหลดกลับไป
    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/*
export async function DELETE(req: NextRequest) {
  try {
    const { public_id } = await req.json(); // รับข้อมูล public_id จาก body ของ request

    if (!public_id) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    // ลบไฟล์จาก Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      return NextResponse.json({ message: 'File deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}*/