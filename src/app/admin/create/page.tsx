'use client';

import { useSession } from "next-auth/react";
import NavbarGlobal from "../../components/navbarglobal";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { LayoutGrid as GridIcon, PackagePlus, ChevronLeft, Image as ImageIcon, BadgeDollarSign, Info } from "lucide-react";
interface Category {
  id: number;
  name: string;
}

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [img, setIMG] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [quantity, setQuantity] = useState<number | string>('');
  const [price, setPrice] = useState<number | string>('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  
  const { data: session, status } = useSession();
  const router = useRouter();
  // เพิ่ม State สำหรับจัดการสถานะการอัปโหลด (ถ้ายังไม่ได้เพิ่ม)
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // นำลอจิกของคุณมาประยุกต์ใช้กับการเลือกไฟล์ (onChange)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploadingImage(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        // ยิงไปที่ API ของคุณตามโค้ดที่ให้มา
        const res = await axios.post('/api/uploadimg', formData);

        if (res.data?.url) {
          setIMG(res.data.url); // อัปเดต State img เพื่อแสดงรูป Preview
        } else {
          console.error('No URL returned from the server');
          alert('อัปโหลดสำเร็จ แต่ไม่พบ URL ของรูปภาพจากเซิร์ฟเวอร์');
        }
      } catch (error: unknown) {
        // Type guard แบบที่คุณเขียนมา เยี่ยมมากครับ!
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          alert(`เกิดข้อผิดพลาดในการอัปโหลด: ${error.message}`);
        } else {
          console.error('Unknown error occurred', error);
          alert('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการอัปโหลดรูปภาพ');
        }
      } finally {
        setIsUploadingImage(false);
      }
    };
  useEffect(() => {
    const initPage = async () => {
      try {
        const catRes = await axios.get(`/api/categories`);
        setCategories(catRes.data);
        
        if (session?.user?.email) {
          const userRes = await axios.get(`/api/user/${session.user.email}`);
          setRole(userRes.data.role || null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    initPage();
  }, [session]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/home');
    if (status === 'authenticated' && role && role !== 'admin') router.push('/home');
  }, [status, role, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validation
    if (!categoryId) return alert("กรุณาเลือกหมวดหมู่สินค้า");
    if (Number(price) < 0 || Number(quantity) < 0) {
      return alert("ราคาและจำนวนสินค้าต้องไม่ติดลบ");
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(`/api`, {
        title,
        content,
        price: Number(price),
        img,
        quantity: Number(quantity),
        categoryId: Number(categoryId),
      });
      setSuccess('เพิ่มสินค้าลงในสต็อกเรียบร้อยแล้ว!');
      setTimeout(() => router.push('/admin'), 1500);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || !role) return <div className="flex h-screen items-center justify-center font-bold">Checking access...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <NavbarGlobal />
      
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition mb-6">
          <ChevronLeft size={20} /> ย้อนกลับ
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white">
            <div className="flex items-center gap-3">
              <PackagePlus size={32} />
              <h1 className="text-3xl font-extrabold">เพิ่มสินค้าใหม่</h1>
            </div>
            <p className="text-blue-100 mt-2">กรอกรายละเอียดสินค้าให้ครบถ้วนเพื่อเริ่มการขาย</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {success && <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 animate-bounce text-center font-bold">{success}</div>}
            {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center font-bold">{error}</div>}

            {/* ส่วนที่ 1: ข้อมูลสินค้า */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                <Info size={20} className="text-blue-600" /> ข้อมูลพื้นฐาน
              </h2>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">ชื่อสินค้า</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น รองเท้าผ้าใบสีขาว"
                  required
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">รายละเอียดสินค้า</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="รายละเอียด คุณสมบัติสินค้า..."
                  required
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>
{/* ส่วนที่ 2: ราคาและคลังสินค้า */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                  <BadgeDollarSign size={20} className="text-green-600" /> การตั้งราคา
                </h2>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">฿</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="ราคาขาย"
                    required
                    className="w-full p-3 pl-8 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                  <GridIcon size={20} className="text-orange-600" /> สต็อกและหมวดหมู่
                </h2>
                {/* แก้ไขตรงนี้: 
                  1. เปลี่ยน flex เป็น grid grid-cols-1 sm:grid-cols-2 
                  2. เปลี่ยน flex-1 ใน input และ select เป็น w-full
                */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="จำนวนในคลัง"
                    required
                    className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

         {/* ส่วนที่ 3: รูปภาพ */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                <ImageIcon size={20} className="text-purple-600" /> รูปภาพสินค้า
              </h2>
              
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="w-full p-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                
                {/* แสดงข้อความแจ้งเตือนตอนกำลังอัปโหลด */}
                {isUploadingImage && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium animate-pulse">กำลังอัปโหลดรูปภาพ...</p>
                  </div>
                )}
              </div>

              {/* แสดง Preview รูปภาพ */}
              {img && !isUploadingImage && (
                <div className="mt-4 p-2 border-2 border-dashed border-gray-300 rounded-xl w-40 h-40 relative group overflow-hidden bg-gray-50">
                  <img 
                    src={img} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg shadow-sm transition duration-300 group-hover:scale-110" 
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/400?text=Invalid+Image")} 
                  />
                  {/* ปุ่มลบรูปภาพ */}
                  <button
                    type="button"
                    onClick={() => setIMG('')}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-red-600"
                    title="ลบรูปภาพ"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:bg-gray-400 active:scale-95"
            >
              {loading ? "กำลังบันทึกข้อมูล..." : "บันทึกและขึ้นขายทันที"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}