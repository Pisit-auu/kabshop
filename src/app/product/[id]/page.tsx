'use client'
import NavbarUser from "../../components/navbaruser";
import { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image"
import { ShoppingCart, CreditCard, Plus, Minus, Package, AlertCircle } from "lucide-react";

export default function Product({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  // Product States
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [stock, setStock] = useState(0); 
  const [img, setIMG] = useState('');
  const [postId, setPostId] = useState('');
  const [price, setPrice] = useState('');
  
  // UI States
  const [userData, setUserData] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/posts/${id}`);
      setTitle(res.data.title);
      setStock(res.data.quantity);
      setContent(res.data.content);
      setIMG(res.data.img);
      setPostId(res.data.id);
      setPrice(res.data.price);
      
      if (session?.user?.email) {
        const response = await axios.get(`/api/user/${session.user.email}`);
        setUserData(response.data.id);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  }, [id, session]);

  useEffect(() => {
    if (id) fetchPost();
  }, [fetchPost]);

  const handleAction = async (type: 'cart' | 'buy') => {
    if (status === "unauthenticated") {
      alert("กรุณาเข้าสู่ระบบก่อนทำรายการ");
      return router.push("/login");
    }

    if (!userData || !postId) return;

    try {
      const response = await axios.post('/api/cart', {
        userId: userData,
        postId,
        quantity,
      });

      if (response.status === 200) {
        if (type === 'buy') {
          router.push('/cart'); // หรือไปที่ /checkout ตาม flow ของคุณ
        } else {
          alert('เพิ่มสินค้าลงรถเข็นแล้ว');
        }
      }
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
    }
  };

  const incrementQuantity = () => {
    if (quantity < stock) setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarUser />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            
            {/* Left: Product Image */}
            <div className="bg-gray-50 p-8 flex items-center justify-center min-h-[500px]">
              <div className="relative w-full h-full max-h-[500px] hover:scale-105 transition-transform duration-500">
                {img ? (
                  <Image
                    src={img} 
                    alt={title}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Package size={64} />
                    <p>ไม่มีรูปภาพสินค้า</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{title}</h1>
                  <p className="text-3xl font-bold text-orange-500 italic">
                    ฿{Number(price).toLocaleString()}.00
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <AlertCircle size={18} className="text-blue-500" /> รายละเอียดสินค้า
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-600 leading-relaxed min-h-[120px]">
                    {content || "ไม่มีข้อมูลรายละเอียดสินค้า"}
                  </div>
                </div>

                {stock > 0 ? (
                  <div className="space-y-6 pt-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center border-2 border-gray-200 rounded-2xl p-1 bg-white shadow-sm">
                        <button 
                          onClick={decrementQuantity}
                          className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                        >
                          <Minus size={20} />
                        </button>
                        <input
                          className="w-16 text-center text-xl font-bold bg-transparent outline-none"
                          type="number"
                          value={quantity}
                          readOnly
                        />
                        <button 
                          onClick={incrementQuantity}
                          className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                      <span className="text-gray-500 font-medium">
                        คลังสินค้า: <span className="text-gray-900">{stock} ชิ้น</span>
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleAction('cart')}
                        className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-yellow-100"
                      >
                        <ShoppingCart size={22} />
                        ใส่รถเข็น
                      </button>
                      <button 
                        onClick={() => handleAction('buy')}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-blue-100"
                      >
                        <CreditCard size={22} />
                        ซื้อเลย
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center gap-3 font-bold text-xl">
                    <AlertCircle /> สินค้าหมดชั่วคราว
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}