'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import NavbarUser from "../components/navbaruser";
import Image from "next/image"
import { Trash2, Minus, Plus, ShoppingBag, MapPin } from "lucide-react"; // แนะนำให้ลง lucide-react

interface CartItem {
    id: number;
    postId: number;
    value: number;
    post: {
        id: number;
        title: string;
        price: number;
        img: string;
        quantity: number;
    };
}

export default function Cart() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    // States
    const [userData, setUserData] = useState<any>(null);
    const [address, setAddress] = useState('');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState<number | null>(null);

    // คำนวณราคาทั้งหมด (ใช้ useMemo เพื่อประสิทธิภาพ)
    const { totalPrice, totalQty } = useMemo(() => {
        return cartItems.reduce((acc, item) => ({
            totalPrice: acc.totalPrice + (item.value * (item.post?.price ?? 0)),
            totalQty: acc.totalQty + item.value
        }), { totalPrice: 0, totalQty: 0 });
    }, [cartItems]);

    const shippingCost = cartItems.length > 0 ? 36 : 0;

    
    const fetchAllData = async () => {
        if (!session?.user?.email) return;
        try {
            const res = await axios.get(`/api/user/${session.user.email}`);
            setUserData(res.data);
            setAddress(res.data.address || ''); // แก้ Warning null
            setCartItems(Array.isArray(res.data.cart) ? res.data.cart : []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantity = async (id: number, newQty: number) => {
        setIsUpdating(id);
        try {
            if (newQty <= 0) {
                await axios.delete(`/api/cart/${id}`);
            } else {
                await axios.put(`/api/cart/${id}`, { value: newQty });
            }
            await fetchAllData(); // Refresh ข้อมูลหลังแก้
        } catch (err) {
            alert("ไม่สามารถอัปเดตจำนวนสินค้าได้");
        } finally {
            setIsUpdating(null);
        }
    };

    const saveAddress = async () => {
        try {
            await axios.put(`/api/user/${session?.user?.email}`, { address });
            setIsEditing(false);
        } catch (err) {
            alert("บันทึกที่อยู่ล้มเหลว");
        }
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) return alert("กรุณาเลือกสินค้าก่อนชำระเงิน");
        router.push('/checkout');
    };

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/');
        if (status === 'authenticated') fetchAllData();
    }, [status]);

    if (loading) return <div className="flex h-screen items-center justify-center font-bold">กำลังโหลดตะกร้าสินค้า...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <NavbarUser />

            <div className="max-w-6xl mx-auto px-4 mt-8">
                <div className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
                    <ShoppingBag className="text-blue-600" />
                    <h1>ตะกร้าสินค้า ({cartItems.length})</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ฝั่งซ้าย: รายการสินค้า */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md">
                                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border">
                                        <Image src={item.post.img} alt={item.post.title} fill className="object-cover" />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-gray-800 line-clamp-1">{item.post.title}</h3>
                                            <button 
                                                onClick={() => handleQuantity(item.id, 0)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            <div className="text-blue-600 font-bold text-lg">฿{item.post.price.toLocaleString()}</div>
                                            
                                            {/* ปุ่มเพิ่ม-ลด */}
                                            <div className="flex items-center border rounded-lg bg-gray-50">
                                                <button 
                                                    disabled={item.value <= 1 || isUpdating === item.id}
                                                    onClick={() => handleQuantity(item.id, item.value - 1)}
                                                    className="p-1 px-2 hover:text-blue-600 disabled:opacity-30"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-8 text-center font-medium text-sm">
                                                    {isUpdating === item.id ? "..." : item.value}
                                                </span>
                                                <button 
                                                    disabled={item.value >= item.post.quantity || isUpdating === item.id}
                                                    onClick={() => handleQuantity(item.id, item.value + 1)}
                                                    className="p-1 px-2 hover:text-blue-600 disabled:opacity-30"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1 italic">คลังคงเหลือ: {item.post.quantity}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed">
                                <p className="text-gray-400">ไม่มีสินค้าในตะกร้า</p>
                                <button onClick={() => router.push('/home')} className="mt-4 text-blue-600 font-semibold underline">กลับไปเลือกซื้อสินค้า</button>
                            </div>
                        )}
                    </div>

                    {/* ฝั่งขวา: สรุปยอดและการจัดส่ง */}
                    <div className="space-y-6">
                        {/* ที่อยู่จัดส่ง */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 font-bold mb-4 text-gray-800">
                                <MapPin size={18} className="text-red-500" />
                                <h3>ที่อยู่จัดส่ง</h3>
                            </div>
                            
                            {isEditing ? (
                                <div className="space-y-2">
                                    <textarea 
                                        value={address} 
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={saveAddress} className="flex-1 bg-blue-600 text-white py-1 rounded-lg text-xs">บันทึก</button>
                                        <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 py-1 rounded-lg text-xs">ยกเลิก</button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-600 leading-relaxed italic">
                                        {address || "ยังไม่ได้ระบุที่อยู่..."}
                                    </p>
                                    <button onClick={() => setIsEditing(true)} className="mt-2 text-xs text-blue-600 font-semibold hover:underline">
                                        แก้ไขที่อยู่
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* สรุปยอดเงิน */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">สรุปคำสั่งซื้อ</h3>
                            <div className="space-y-3 text-sm text-gray-500 pb-4 border-b">
                                <div className="flex justify-between">
                                    <span>ราคาสินค้า ({totalQty} ชิ้น)</span>
                                    <span>฿{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>ค่าจัดส่ง</span>
                                    <span>฿{shippingCost.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <span className="font-bold text-gray-800">ยอดชำระสุทธิ</span>
                                <span className="text-2xl font-bold text-blue-600">฿{(totalPrice + shippingCost).toLocaleString()}</span>
                            </div>

                            <form onSubmit={handleCheckout}>
                                <button 
                                    type="submit"
                                    disabled={cartItems.length === 0}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:bg-gray-300 disabled:shadow-none"
                                >
                                    ไปที่หน้าชำระเงิน
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}