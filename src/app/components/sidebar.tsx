'use client';

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import axios from 'axios';
import { User, ShoppingBag, Settings, ChevronRight, Loader2 } from "lucide-react";

export default function Sidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname(); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const response = await axios.get(`/api/user/${session.user.email}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, fetchUserData, router]);

  const isActive = (path) => pathname === path;

  if (loading) return (
    <div className="col-span-12 md:col-span-3 lg:col-span-2 bg-white shadow-sm rounded-[2.5rem] p-10 flex justify-center items-center h-[400px]">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  return (
    <div className="col-span-12 md:col-span-3 lg:col-span-2 flex flex-col gap-6">
      <div className="bg-white shadow-xl shadow-blue-900/5 rounded-[2.5rem] p-8 border border-gray-100 min-h-[600px]">
        
        {/* User Profile - เพิ่ม Margin Bottom */}
        <div className="flex flex-col items-center text-center mb-12 pb-8 border-b border-gray-50">
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-200 mb-5 transform -rotate-3">
            {userData?.name ? userData.name.charAt(0).toUpperCase() : <User size={40} />}
          </div>
          <h2 className="text-2xl font-black text-gray-800 line-clamp-1 px-2">{userData?.name || 'User'}</h2>
          <p className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em] mt-2">สมาชิกทั่วไป</p>
        </div>

        {/* Menu Navigation - เพิ่ม Gap ระหว่างกลุ่มเมนู */}
        <nav className="space-y-10">
          
          {/* กลุ่ม: บัญชีของฉัน */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5 ml-4">บัญชีของฉัน</p>
            <div className="space-y-3">
              <Link 
                href="/user/profile/information" 
                className={`flex items-center justify-between py-4 px-5 rounded-2xl transition-all duration-300 group ${
                  isActive('/user/profile/information') 
                  ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-200' 
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Settings size={22} className={isActive('/user/profile/information') ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'} />
                  <span className="text-base">ข้อมูลส่วนตัว</span>
                </div>
                <ChevronRight size={18} className={isActive('/user/profile/information') ? 'opacity-100' : 'opacity-0'} />
              </Link>
            </div>
          </div>

          {/* กลุ่ม: การซื้อของฉัน */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5 ml-4">การซื้อของฉัน</p>
            <div className="space-y-3">
              <Link 
                href="/user/profile/all" 
                className={`flex items-center justify-between py-4 px-5 rounded-2xl transition-all duration-300 group ${
                  isActive('/user/profile/all') 
                  ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-200' 
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <ShoppingBag size={22} className={isActive('/user/profile/all') ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'} />
                  <span className="text-base">ประวัติสั่งซื้อ</span>
                </div>
                <ChevronRight size={18} className={isActive('/user/profile/all') ? 'opacity-100' : 'opacity-0'} />
              </Link>
            </div>
          </div>

        </nav>
      </div>

      {/* Version Info */}
      <div className="text-center pb-4">
      </div>
    </div>
  );
}