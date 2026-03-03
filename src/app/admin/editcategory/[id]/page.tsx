'use client';

import { useSession } from "next-auth/react";
import NavbarGlobal from "../../../components/navbarglobal";
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { ChevronLeft, Tag, Save, Loader2 } from "lucide-react";

export default function EditCategory({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // ดึงข้อมูลหมวดหมู่และสิทธิ์ผู้ใช้
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const categoryRes = await axios.get(`/api/categories/${id}`);
      setName(categoryRes.data.name);

      if (session?.user?.email) {
        const userRes = await axios.get(`/api/user/${session.user.email}`);
        setRole(userRes.data.role || null);
      }
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ตรวจสอบสิทธิ์การเข้าถึง
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/home');
    if (status === 'authenticated' && role && role !== 'admin') router.push('/home');
  }, [status, role, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await axios.put(`/api/categories/${id}`, { name });
      router.push('/admin');
    } catch (err) {
      setError('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่');
      setIsSaving(false);
    }
  };

  // แสดงผลตอนกำลังโหลดข้อมูลครั้งแรก
  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <NavbarGlobal />
      
      <div className="max-w-2xl mx-auto px-4 mt-12">
        {/* ปุ่มย้อนกลับ */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 font-medium"
        >
          <ChevronLeft size={20} />
          กลับหน้าจัดการ
        </button>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
          {/* ส่วนหัว (Header) */}
          <div className="bg-blue-600 p-8 text-white relative overflow-hidden">
             <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                   <Tag size={28} />
                </div>
                <div>
                   <h1 className="text-2xl font-bold">แก้ไขหมวดหมู่</h1>
                   <p className="text-blue-100 text-sm opacity-80">แก้ไขชื่อหมวดหมู่ที่แสดงบนหน้าเว็บ</p>
                </div>
             </div>
             {/* ตกแต่งพื้นหลังเล็กน้อย */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          </div>

          {/* ฟอร์มแก้ไข */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">
                ชื่อหมวดหมู่สินค้า
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ระบุชื่อหมวดหมู่..."
                required
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg shadow-inner"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSaving || !name.trim()}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:bg-gray-300 disabled:shadow-none"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>กำลังบันทึก...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>บันทึกการเปลี่ยนแปลง</span>
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