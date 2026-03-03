'use client';

import { useSession } from "next-auth/react";
import NavbarGlobal from "../../../components/navbarglobal";
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, ImageIcon, LayoutGrid, BadgeDollarSign, FileText, AlertCircle } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

export default function Edit({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  // Form States
  const [title, setTitle] = useState('');
  const [img, setIMG] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [quantity, setQuantity] = useState<number | string>('');
  const [price, setPrice] = useState<number | string>('');

  // Status States
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // ดึงข้อมูลทั้งหมดที่จำเป็น
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [postRes, catRes] = await Promise.all([
        axios.get(`/api/posts/${id}`),
        axios.get(`/api/categories`)
      ]);

      const post = postRes.data;
      setTitle(post.title);
      setIMG(post.img);
      setQuantity(post.quantity);
      setPrice(post.price);
      setContent(post.content);
      setCategoryId(post.categoryId);
      setCategories(catRes.data);

      if (session?.user?.email) {
        const userRes = await axios.get(`/api/user/${session.user.email}`);
        setRole(userRes.data.role || null);
      }
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Security Check
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/home');
    if (status === 'authenticated' && role && role !== 'admin') router.push('/home');
  }, [status, role, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Number(price) < 0 || Number(quantity) < 0) return alert("ราคาและจำนวนห้ามติดลบ");

    setIsSaving(true);
    try {
      await axios.put(`/api/posts/${id}`, {
        title,
        content,
        price: Number(price),
        img,
        quantity: Number(quantity),
        categoryId: Number(categoryId),
      });
      router.push('/admin');
    } catch (err) {
      setError('บันทึกข้อมูลไม่สำเร็จ');
      setIsSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center space-y-4 bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">กำลังดึงข้อมูลสินค้า...</p>
      </div>
    );
  }

  if (error && !isSaving) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-sm">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">ลองใหม่อีกครั้ง</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <NavbarGlobal />
      
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition mb-6 font-medium">
          <ChevronLeft size={20} /> กลับหน้าจัดการ
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
               แก้ไขข้อมูลสินค้า
            </h1>
            <p className="text-blue-100 mt-2 opacity-90">ID สินค้า: #{id}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* ส่วนที่ 1: Basic Info */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-sm">
                <FileText size={18} /> ข้อมูลทั่วไป
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อสินค้า (Title)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">รายละเอียดสินค้า</label>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </section>

            {/* ส่วนที่ 2: Pricing & Stock */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
               <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <BadgeDollarSign size={18} className="text-green-600" /> ราคาขาย
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-400 font-bold">฿</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-4 pl-10 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <LayoutGrid size={18} className="text-orange-600" /> จำนวนสต็อก
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
               </div>
            </section>

            {/* ส่วนที่ 3: Media & Category */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <ImageIcon size={18} className="text-purple-600" /> รูปภาพ (URL)
                  </label>
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => setIMG(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none mb-4"
                    required
                  />
                  {img && (
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 p-2">
                       <img src={img} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    </div>
                  )}
               </div>
               <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <LayoutGrid size={18} className="text-blue-600" /> หมวดหมู่สินค้า
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white h-[58px]"
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="bg-blue-50 p-4 rounded-2xl text-xs text-blue-600 leading-relaxed border border-blue-100 italic">
                    * การเปลี่ยนหมวดหมู่จะส่งผลต่อการกรองสินค้าในหน้าหลักของลูกค้าทันที
                  </div>
               </div>
            </section>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-100 active:scale-95 disabled:bg-gray-400"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    บันทึกข้อมูล...
                  </div>
                ) : (
                  <>
                    <Save size={24} />
                    <span>อัปเดตข้อมูลสินค้า</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}