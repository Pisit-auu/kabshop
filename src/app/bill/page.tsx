'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import NavbarUser from '../components/navbaruser';
import { CheckCircle2, Calendar, Hash, Package, ArrowLeft, Download, Printer, Loader2 } from "lucide-react";

interface OrderItem {
  title: string;
  quantity: number;
  totalPrice: number;
}

interface OrderData {
  orderId: string;
  createdAt: string;
  items: OrderItem[];
}

export default function Bill() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get('orderId');

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  const fetchOrderDetails = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/order/${id}`);
      setOrderData(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      if (orderIdFromUrl) {
        fetchOrderDetails(orderIdFromUrl);
      } else {
        router.push('/home');
      }
    }
  }, [status, orderIdFromUrl, router, fetchOrderDetails]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <p className="text-red-500 font-bold text-xl mb-4">ไม่พบข้อมูลคำสั่งซื้อ</p>
           <Link href="/home" className="text-blue-600 flex items-center gap-2 justify-center">
             <ArrowLeft size={18} /> กลับสู่หน้าหลัก
           </Link>
        </div>
      </div>
    );
  }

  const { orderId, createdAt, items = [] } = orderData;
  const shippingCost = 36;
  const subTotal = items.reduce((total, item) => total + item.totalPrice, 0);
  const grandTotal = subTotal + shippingCost;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <NavbarUser />
      
      <div className="max-w-2xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 overflow-hidden border border-gray-100">
          
          {/* Header Success Section */}
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-10 text-white text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-md">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-3xl font-black mb-1">สั่งซื้อสำเร็จ!</h1>
            <p className="text-green-50 opacity-90 font-medium">ขอบคุณที่ใช้บริการกับเรา</p>
          </div>

          <div className="p-8 md:p-12">
            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                  <Hash size={12} /> หมายเลขคำสั่งซื้อ
                </p>
                <p className="font-mono font-bold text-gray-800 tracking-tighter">{orderId}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                  <Calendar size={12} /> วันที่สั่งซื้อ
                </p>
                <p className="font-bold text-gray-800 text-sm">{formatDate(createdAt)}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4 mb-8">
              <h3 className="text-gray-800 font-bold flex items-center gap-2 mb-4">
                <Package size={20} className="text-blue-500" /> รายการสินค้า
              </h3>
              <div className="divide-y divide-dashed divide-gray-200 border-y border-dashed py-4">
                {items.map((item, index) => (
                  <div key={index} className="py-3 flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <p className="font-bold text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">{formatCurrency(item.totalPrice)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-3 mb-10">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>ราคารวมสินค้า</span>
                <span>{formatCurrency(subTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>ค่าจัดส่ง</span>
                <span>{formatCurrency(shippingCost)}</span>
              </div>
              <div className="pt-4 mt-4 border-t-2 border-gray-100 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">ยอดชำระสุทธิ</span>
                <span className="text-3xl font-black text-green-600">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-3">
              <Link href="/home" className="w-full">
                <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-gray-200">
                  กลับสู่หน้าหลัก
                </button>
              </Link>
             
            </div>

            <p className="text-center text-gray-400 text-xs mt-10 italic">
               หากมีข้อสงสัยเกี่ยวกับคำสั่งซื้อ โปรดติดต่อฝ่ายบริการลูกค้าของเรา
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}