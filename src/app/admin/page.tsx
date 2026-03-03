'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavbarGlobal from "../components/navbarglobal";
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Edit3, Trash2, Plus, Search, TrendingUp, Users } from "lucide-react"; // แนะนำให้ลง lucide-react

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Infostock() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // States
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [topBuyer, setTopBuyer] = useState({ name: '-', amount: 0 });
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('desc');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  // รวมฟังก์ชันดึงข้อมูลทั้งหมด
  const initAdminData = useCallback(async () => {
    try {
      const query = new URLSearchParams({ category, search, sort }).toString();
      
      // ดึงข้อมูลพร้อมกันแบบ Parallel เพื่อความเร็ว
      const [resPosts, resCats, resTopBuy] = await Promise.all([
        axios.get(`/api?${query}`),
        axios.get(`/api/categories`),
        axios.get(`/api/user`)
      ]);

      setPosts(resPosts.data);
      setCategories(resCats.data);
      setSalesData(resPosts.data); // ใช้ข้อมูลจาก posts มาทำกราฟยอดขาย
      if(resTopBuy.data) {
        setTopBuyer({ name: resTopBuy.data.name, amount: resTopBuy.data.purchaseamount });
      }
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลได้');
    }
  }, [category, search, sort]);

  // ตรวจสอบสิทธิ์ Admin
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/home');
    if (status === 'authenticated' && session?.user?.email) {
      axios.get(`/api/user/${session.user.email}`).then(res => {
        if (res.data.role !== 'admin') router.push('/home');
        else {
          setRole('admin');
          initAdminData();
        }
      });
    }
  }, [status, session, initAdminData, router]);

  // ฟังก์ชันลบ (ลบแล้วอัปเดต State ทันที ไม่ต้องรีโหลดหน้า)
  const handleDelete = async (type, id) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) return;
    try {
      await axios.delete(`/api/${type}/${id}`);
      alert('ลบข้อมูลเรียบร้อย');
      initAdminData(); // Refresh ข้อมูลใน state
    } catch (error) {
      alert('เกิดข้อผิดพลาด');
    }
  };

  const chartData = {
    labels: salesData.map(item => item.title),
    datasets: [
      {
        label: 'ยอดขาย (ชิ้น)',
        data: salesData.map(item => item.Sales || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  if (status === 'loading' || (status === 'authenticated' && !role)) {
    return <div className="flex h-screen items-center justify-center">กำลังตรวจสอบสิทธิ์...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <NavbarGlobal />
      
      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* ส่วน Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-full text-blue-600">
              <Users size={32} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Top Buyer (ลูกค้าอันดับ 1)</p>
              <h3 className="text-xl font-bold text-gray-800">{topBuyer.name}</h3>
              <p className="text-blue-600 font-semibold">ยอดซื้อสะสม: ฿{topBuyer.amount?.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 flex items-center gap-4">
            <div className="p-4 bg-green-50 rounded-full text-green-600">
              <TrendingUp size={32} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Products</p>
              <h3 className="text-xl font-bold text-gray-800">{posts.length} รายการ</h3>
              <p className="text-green-600 font-semibold">In Stock & Active</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ฝั่งซ้าย: จัดการสินค้า */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                  Inventory Management
                </h2>
                <Link href="/admin/create">
                  <button className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                    <Plus size={18} /> Add Product
                  </button>
                </Link>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search product name..."
                  />
                </div>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
                <button onClick={initAdminData} className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm hover:bg-black transition">
                  Apply
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-400 text-sm uppercase border-b">
                      <th className="pb-4 font-medium">Product Name</th>
                      <th className="pb-4 font-medium text-center">Category</th>
                      <th className="pb-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 transition">
                        <td className="py-4 font-medium text-gray-800">{post.title}</td>
                        <td className="py-4 text-center">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs italic">
                            {post.category?.name}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-3">
                          <Link href={`/admin/edit/${post.id}`} className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                            <Edit3 size={16} /> Edit
                          </Link>
                          <button onClick={() => handleDelete('posts', post.id)} className="text-red-500 hover:text-red-700 inline-flex items-center gap-1">
                            <Trash2 size={16} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ส่วน Graph ยอดขาย */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
               <h2 className="text-xl font-bold mb-6">Sales Performance</h2>
               <div className="h-[300px]">
                 <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
               </div>
            </div>
          </div>

          {/* ฝั่งขวา: จัดการ Category */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg">Categories</h2>
                <Link href="/admin/createcategory">
                  <Plus size={20} className="text-blue-600 cursor-pointer" />
                </Link>
              </div>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group">
                    <span className="font-medium text-gray-700">{cat.name}</span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/editcategory/${cat.id}`}>
                        <Edit3 size={16} className="text-gray-400 hover:text-blue-600" />
                      </Link>
                      <button onClick={() => handleDelete('categories', cat.id)}>
                        <Trash2 size={16} className="text-gray-400 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}