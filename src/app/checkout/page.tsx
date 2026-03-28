'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import NavbarUser from '../components/navbaruser';
import Image from "next/image";
import { MapPin, CreditCard, ShoppingBag, Truck, ChevronRight, AlertCircle, Loader2 } from "lucide-react";

interface CartItem {
  id: number;
  value: number;
  post: {
    id: number;
    title: string;
    price: number;
    img: string;
    quantity: number;
    Sales: number;
  };
}

export default function Checkout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [userData, setUserData] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const shippingCost = 36;

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/user/${session?.user?.email}`);
      const data = response.data;

      // ตรวจสอบข้อมูลโปรไฟล์ที่จำเป็น
      const isProfileIncomplete = !data.address || !data.phone || !data.name;
      
      if (isProfileIncomplete) {
        alert("กรุณากรอกข้อมูลที่อยู่และเบอร์โทรศัพท์ให้ครบถ้วนก่อนสั่งซื้อ");
        router.push('/user/profile/information');
        return;
      }

      setUserData(data);
      setCartItems(Array.isArray(data.cart) ? data.cart : []);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  }, [session, router]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
    if (status === 'authenticated') fetchUserData();
  }, [status, fetchUserData, router]);

  // คำนวณราคารวมทั้งหมด
  const subTotal = cartItems.reduce((total, item) => total + (item.value * item.post.price), 0);
  const finalTotal = subTotal + shippingCost;

  const handleCheckout = async () => {
    if (!paymentMethod) return alert("กรุณาเลือกวิธีการชำระเงิน");
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderId = Math.floor(100000 + Math.random() * 900000).toString();
      
      const items = cartItems.map(item => ({
        postId: item.post.id,
        quantity: item.value,
        totalPrice: item.value * item.post.price,
      }));

      // 1. สร้าง Order
      await axios.post('/api/order', {
        userId: Number(userData.id),
        orderId,
        Username : userData.email,
        items,
      });
      await axios.put(`/api/user/${session?.user?.email}`, {
        purchaseamount: (userData.purchaseamount || 0) + finalTotal
      });

      // 2. อัปเดตสต็อกสินค้า และ ลบสินค้าจากตะกร้า
      await Promise.all(cartItems.map(async (item) => {
        const itemTotal = item.value * item.post.price;
        await axios.put(`/api/posts/${item.post.id}`, {
          quantity: item.post.quantity - item.value,
          Sales: (item.post.Sales || 0) + itemTotal // แก้ไข Logic ตรงนี้ให้ถูกต้อง
        });
        await axios.delete(`/api/cart/${item.id}`);
      }));

      router.push(`/bill?orderId=${orderId}`);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่');
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <NavbarUser />

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="text-blue-600" /> ทำรายการสั่งซื้อ
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ส่วนซ้าย: ข้อมูลการจัดส่งและสินค้า */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ที่อยู่จัดส่ง */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                  <MapPin className="text-red-500" size={22} /> ที่อยู่จัดส่ง
                </h2>
                <button onClick={() => router.push('/user/profile/information')} className="text-blue-600 text-sm font-medium hover:underline">
                  แก้ไขที่อยู่
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="font-bold text-gray-900">{userData?.name}</p>
                <p className="text-gray-600 mt-1">{userData?.phone}</p>
                <p className="text-gray-600 mt-1">{userData?.address}</p>
              </div>
            </div>

            {/* รายการสินค้า */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Truck className="text-blue-500" size={22} /> รายการสินค้าของคุณ
              </h2>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={item.post.img} alt={item.post.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-gray-900 line-clamp-1">{item.post.title}</h3>
                      <p className="text-gray-500 text-sm">จำนวน: {item.value} ชิ้น</p>
                      <p className="text-blue-600 font-bold mt-1">฿{item.post.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right flex flex-col justify-center">
                      <p className="text-gray-400 text-xs uppercase tracking-tighter">รวม</p>
                      <p className="font-bold text-gray-900">฿{(item.value * item.post.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ส่วนขวา: วิธีการชำระเงินและสรุปยอด */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* เลือกวิธีชำระเงิน */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <CreditCard className="text-purple-500" size={22} /> วิธีการชำระเงิน
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'Qr' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}>
                  <input type="radio" name="pay" value="Qr" onChange={() => setPaymentMethod('Qr')} className="hidden" />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'Qr' ? 'border-blue-600' : 'border-gray-300'}`}>
                    {paymentMethod === 'Qr' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </div>
                  <span className="font-bold text-gray-700">QR Promptpay</span>
                </label>

                <label className={`flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'Cash' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}>
                  <input type="radio" name="pay" value="Cash" onChange={() => setPaymentMethod('Cash')} className="hidden" />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'Cash' ? 'border-blue-600' : 'border-gray-300'}`}>
                    {paymentMethod === 'Cash' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </div>
                  <span className="font-bold text-gray-700">ชำระเงินปลายทาง</span>
                </label>
              </div>
            </div>

            {/* สรุปยอดสั่งซื้อ */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-blue-50">
              <h2 className="text-xl font-bold mb-6 text-gray-800">สรุปคำสั่งซื้อ</h2>
              <div className="space-y-4 border-b pb-6 text-gray-600">
                <div className="flex justify-between font-medium">
                  <span>ยอดรวมสินค้า</span>
                  <span>฿{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>ค่าจัดส่ง</span>
                  <span>฿{shippingCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center my-6">
                <span className="text-lg font-bold text-gray-900">ยอดชำระสุทธิ</span>
                <span className="text-3xl font-black text-blue-600 font-mono">
                  ฿{finalTotal.toLocaleString()}
                </span>
              </div>

              <button
                disabled={isSubmitting || !paymentMethod}
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-blue-200 disabled:bg-gray-300 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>ยืนยันสั่งซื้อสินค้า <ChevronRight size={20} /></>
                )}
              </button>

              <p className="text-center text-gray-400 text-xs mt-4 italic">
                * ตรวจสอบความถูกต้องก่อนกดชำระเงิน
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}