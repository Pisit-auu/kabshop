'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarUser from '../components/navbaruser';

interface CartItem {
  id: number;
  value: number;
  post: {
    id: number;
    title: string;
    price: number;
    img: string;
    quantity: number;
    Sales:number;
  };
}

export default function Checkout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [address, setAddress] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items to your cart before checking out.');
      return;
    }
  
    try {
      // ตรวจสอบว่ามี userId
      if (!userId) {
        setError('User ID not found.');
        return;
      }
  
      // สร้าง orderId
      const orderId = Math.floor(Math.random() * 1000000).toString();
  
      // สร้างคำสั่งซื้อใหม่
      const items = cartItems.map(item => ({
        postId: item.post.id,
        quantity: item.value,
        totalPrice: item.value * item.post.price,
      }));
  
      // ส่งข้อมูล order ไปที่ API
      await axios.post('/api/order', {
        userId: Number(userId),
        orderId,
        items,
      });
      // อัปเดตจำนวนสินค้าในคลังและลบสินค้าจากตะกร้า
      await Promise.all(cartItems.map(async item => {
        await axios.put(`/api/posts/${item.post.id}`, {
          quantity: item.post.quantity - item.value,
          Sales:item.post.Sales+totalPrice
          
        });
        await axios.delete(`/api/cart/${item.id}`);
      }));
  
      // Redirect ไปที่หน้า bill พร้อมกับ orderId
      router.push(`/bill?orderId=${orderId}`);
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('An error occurred while processing your order.');
    }
  };
  

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/user/${session?.user?.email}`);
      const data = response.data;
      setUserData(data);
      setAddress(data.address);
      setUserId(data.id);

      if (Array.isArray(data.cart)) {
        setCartItems(data.cart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [router, status]);

  useEffect(() => {
    if (cartItems.length === 0 && !loading) {
      router.push('/cart');
    }
  }, [cartItems, router, loading]);

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.value * item.post.price);
  }, 0);
  const shippingCost = 36;

  return (
    status === 'authenticated' && session.user && (
      <div className="min-h-screen bg-gray-50">
        <NavbarUser />

        <div className="grid grid-cols-1 md:grid-cols-8 gap-8 p-8">
          <div className="col-span-1 md:col-span-6 bg-white shadow-lg rounded-lg p-6">
            <div className="mb-8">
              <div className="text-gray-700 text-sm mb-2">Delivery Address</div>
              <div className="text-gray-900 text-xl font-semibold">{address}</div>
            </div>

            <div className="mb-8">
              <div className="text-gray-700 text-sm mb-2">Order Summary</div>
              <div className="space-y-4">
                {cartItems.length > 0 ? (
                  cartItems.map(item => (
                    <div key={item.id} className="flex items-center border-b pb-4">
                      <img src={item.post.img} alt={item.post.title} className="w-16 h-16 object-cover mr-4 rounded-lg shadow-sm" />
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-gray-800">{item.post.title}</div>
                        <div className="text-gray-600 text-sm">Quantity: {item.value}</div>
                        <div className="text-gray-600 text-sm">Price: ฿{item.post.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600">No items in cart</div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 bg-white shadow-lg rounded-lg p-6">
            <div className="mb-8">
              <div className="text-gray-700 text-sm mb-2">Choose Payment Method</div>
              <label className="block mb-4">
                <input className="mr-2" type="radio" name="choosepay" value="Qr" onChange={() => setPaymentMethod('Qr')} /> QR Promptpay
              </label>
              <label className="block mb-4">
                <input className="mr-2" type="radio" name="choosepay" value="Cash" onChange={() => setPaymentMethod('Cash')} /> Cash on Delivery
              </label>
            </div>

            <div>
              <div className="text-lg font-semibold mb-4">Summary of Order Information</div>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700 text-sm">
                  <span>Sub Total | {cartItems.reduce((total, item) => total + item.value, 0)} items |</span>
                  <span>฿{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 text-sm">
                  <span>Shipping</span>
                  <span>฿{shippingCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 text-lg font-semibold">
                <span>Total Amount</span>
                <span className="text-green-500">฿{(totalPrice + shippingCost).toFixed(2)}</span>
              </div>

              <button
                className="bg-green-500 text-white py-2 px-4 mt-6 rounded-lg w-full transition duration-300 ease-in-out hover:bg-green-600"
                onClick={handleCheckout}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
