'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/sidebar';
import NavbarUser from '../../../components/navbaruser';
import { Package, Truck, ShoppingBag, Loader2 } from 'lucide-react';

interface OrderItem {
  postId: number;
  quantity: number;
  totalPrice: number;
  post: {
    title: string
    img: string;
  };
}

interface Order {
  orderId: string;
  createdAt: string;
  items: OrderItem[];
}

export default function All() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const totalOrderAmount = useMemo(() => {
    return orders.reduce((total, order) => {
      const orderTotal = order.items.reduce((sum, item) => sum + item.totalPrice, 36);
      return total + orderTotal;
    }, 0);
  }, [orders]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user?.id) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get('/api/getorder', {
            params: { userId: session.user.id },
          });
          setOrders(response.data);
        } catch (error) {
          console.error('Failed to fetch orders');
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [router, status, session?.user?.id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium tracking-tight">กำลังโหลดประวัติการซื้อ...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <NavbarUser />
      
      {/* ปรับ max-w เป็น 6xl เพื่อรองรับ Sidebar ที่กว้างขึ้น */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* ปรับ Grid เป็น 10 ส่วน (3:7) ให้เท่ากับหน้า Change Password */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          
          {/* Sidebar Area - กว้าง 3 ส่วน */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-8">
              <Sidebar />
            </div>
          </div>

          {/* Main Content Area - กว้าง 7 ส่วน */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-black text-gray-800 flex items-center justify-center sm:justify-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                    <ShoppingBag size={24} />
                  </div>
                  ประวัติสั่งซื้อ
                </h1>
                <p className="text-gray-400 text-sm mt-1 font-medium italic">รายการสินค้าที่คุณเคยสั่งซื้อทั้งหมด</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-4 rounded-[1.5rem] shadow-lg shadow-blue-200 text-center">
                <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest mb-1">ยอดซื้อสะสม</p>
                <p className="text-2xl font-black text-white">฿{totalOrderAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {orders.length > 0 ? (
                orders.map((order) => {
                  const itemsTotal = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
                  const grandTotal = itemsTotal + 36;

                  return (
                    <div key={order.orderId} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group/card">
                      
                      {/* Order Header */}
                      <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                             <Package size={18} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">ORDER ID</p>
                            <p className="text-sm font-bold text-gray-700 font-mono tracking-tight">{order.orderId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">วันที่สั่งซื้อ</p>
                          <p className="text-sm font-bold text-gray-600 bg-white px-3 py-1 rounded-lg border border-gray-100">
                             {new Date(order.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="px-8 divide-y divide-gray-50">
                        {order.items.map(item => (
                          <div key={item.postId} className="py-6 flex items-center gap-5 group/item">
                            <div className="relative w-20 h-20 flex-shrink-0">
                               <img
                                src={item.post.img || '/api/placeholder/80/80'}
                                alt={item.post.title}
                                className="w-full h-full object-cover rounded-2xl border border-gray-100 group-hover/item:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-gray-800 font-black truncate group-hover/item:text-blue-600 transition-colors text-lg">{item.post.title}</h3>
                              <p className="text-sm text-gray-400 font-bold mt-1">จำนวน: {item.quantity} ชิ้น</p>
                            </div>
                            <div className="text-right">
                               <p className="text-lg font-black text-gray-900 tracking-tight">฿{item.totalPrice.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer Summary */}
                      <div className="px-10 py-6 bg-gray-50/20 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-[11px] text-blue-500 font-black uppercase tracking-widest">
                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                           <Truck size={14} strokeWidth={3} /> รวมค่าส่งแล้ว
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">ยอดรวมสุทธิ</span>
                          <span className="text-3xl font-black text-gray-900 tracking-tighter">
                            ฿{grandTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-[3rem] p-24 text-center border-4 border-dashed border-gray-50 shadow-inner">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Package className="h-10 w-10 text-blue-200" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-800">ยังไม่มีรายการสั่งซื้อ</h3>
                  <p className="text-gray-400 mt-3 font-medium text-lg">รายการคำสั่งซื้อของคุณจะปรากฏที่นี่</p>
                  <button onClick={() => router.push('/home')} className="mt-10 bg-gray-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-95">
                    เริ่มช้อปปิ้งเลย
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}