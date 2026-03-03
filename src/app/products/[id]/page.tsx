'use client'
import Link from "next/link";
import Navbar from "../../components/navbar";
import { useState, useEffect } from "react";
import axios from 'axios';
import Image from "next/image"
import { ShoppingCart, CreditCard, Plus, Minus, Package, AlertCircle } from "lucide-react";

export default function Product({ params }: { params: { id: string } }) {
  const { id } = params;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [img, setIMG] = useState('');
  const [value, setValue] = useState(0);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPost = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/posts/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
      setIMG(res.data.img);
      setPrice(res.data.price);
      setValue(res.data.quantity);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPost(id);
  }, [id]);

  const incrementQuantity = () => {
    if (quantity < value) setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* LEFT : IMAGE */}
            <div className="bg-gray-50 p-8 flex items-center justify-center min-h-[500px]">
              <div className="relative w-full h-[450px] hover:scale-105 transition-transform duration-500">
                {img ? (
                  <Image
                    src={img}
                    alt={title}
                    fill
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Package size={64} />
                    <p>ไม่มีรูปภาพสินค้า</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT : DETAIL */}
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <div className="space-y-6">

                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                    {title}
                  </h1>
                  <p className="text-3xl font-bold text-orange-500 italic">
                    ฿{Number(price).toLocaleString()}.00
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <AlertCircle size={18} className="text-blue-500" />
                    รายละเอียดสินค้า
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-600 leading-relaxed min-h-[120px]">
                    {content || "ไม่มีข้อมูลรายละเอียดสินค้า"}
                  </div>
                </div>

                {value > 0 ? (
                  <div className="space-y-6 pt-4">

                    {/* Quantity */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center border-2 border-gray-200 rounded-2xl p-1 bg-white shadow-sm">
                        <button
                          onClick={decrementQuantity}
                          className="p-3 hover:bg-gray-100 rounded-xl transition"
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
                          className="p-3 hover:bg-gray-100 rounded-xl transition"
                        >
                          <Plus size={20} />
                        </button>
                      </div>

                      <span className="text-gray-500 font-medium">
                        คลังสินค้า:
                        <span className="text-gray-900 ml-2">
                          {value} ชิ้น
                        </span>
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <Link href="/user/login">
                        <button className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-yellow-100 w-full">
                          <ShoppingCart size={22} />
                          ใส่รถเข็น
                        </button>
                      </Link>

                      <Link href="/user/login">
                        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-blue-100 w-full">
                          <CreditCard size={22} />
                          ซื้อเลย
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center gap-3 font-bold text-xl">
                    <AlertCircle />
                    สินค้าหมดชั่วคราว
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