'use client';

import { useSession } from "next-auth/react";
import NavbarGlobal from "../../components/navbarglobal";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Tag } from "lucide-react"; // แนะนำให้ใช้ไอคอน

export default function CreateCategory() {
  const [name, setname] = useState('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  
  const { data: session, status } = useSession();
  const router = useRouter();

  // ตรวจสอบสิทธิ์ Admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (status === 'unauthenticated') {
        router.push('/home');
        return;
      }
      
      if (status === 'authenticated' && session?.user?.email) {
        try {
          const res = await axios.get(`/api/user/${session.user.email}`);
          if (res.data.role !== 'admin') {
            router.push('/home');
          } else {
            setRole('admin');
          }
        } catch (err) {
          setError('Failed to verify permissions');
        }
      }
    };
    checkAdmin();
  }, [status, session, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(`/api/categories`, { name });
      setSuccess('สร้างหมวดหมู่สำเร็จแล้ว!');
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (error) {
      setError('ไม่สามารถสร้างหมวดหมู่ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  // แสดง Loading ระหว่างรอเช็ค Session/Role
  if (status === 'loading' || (status === 'authenticated' && !role)) {
    return <div className="flex h-screen items-center justify-center font-semibold">กำลังตรวจสอบสิทธิ์...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarGlobal />
      
      <div className="p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          
          {/* ปุ่มย้อนกลับ */}
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-500 hover:text-gray-800 transition mb-6"
          >
            <ChevronLeft size={20} />
            <span>ย้อนกลับไปหน้าจัดการ</span>
          </button>

          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-blue-600 p-6">
              <div className="flex items-center gap-3 text-white">
                <Tag size={24} />
                <h2 className="text-2xl font-bold">เพิ่มหมวดหมู่สินค้าใหม่</h2>
              </div>
              <p className="text-blue-100 text-sm mt-1">ระบุชื่อหมวดหมู่ที่ต้องการเพิ่มในระบบสต็อกสินค้า</p>
            </div>

            <div className="p-8">
              {/* Alert Messages */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded-r-lg">
                  {success}
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    ชื่อหมวดหมู่ (Category Name)
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    placeholder="เช่น เครื่องเขียน,สมุด..."
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg shadow-sm"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading || !name}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:bg-gray-300 disabled:shadow-none"
                  >
                    {loading ? (
                      <span className="animate-pulse">กำลังบันทึกข้อมูล...</span>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>สร้างหมวดหมู่สินค้า</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-400 text-xs">
            Admin Panel Version 2.0 • จัดการข้อมูลหมวดหมู่สินค้า
          </div>
        </div>
      </div>
    </div>
  );
}