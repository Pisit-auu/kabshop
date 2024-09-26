'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import NavbarUser from '../components/navbaruser';

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

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) {
    return '฿0.00'; // หรือคืนค่าอื่นที่เหมาะสม
  }
  return `฿${amount.toFixed(2)}`;
};

export default function Bill() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await axios.get(`/api/order/${orderId}`);
      console.log('Order data fetched:', response.data); // ตรวจสอบข้อมูลที่ได้รับ
      setOrderData(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      const orderId = new URLSearchParams(window.location.search).get('orderId');
      if (orderId) {
        fetchOrderDetails(orderId);
      } else {
        router.push('/'); // Redirect if no orderId is found
      }
    }
  }, [router, status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (!orderData) {
    return <div>Error loading order data</div>;
  }

  const { orderId, createdAt, items = [] } = orderData;
  const shippingCost = 36;
  const totalPrice = items.reduce((total, item) => total + item.totalPrice, 0);
  const formatDate = (dateString: string) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  return (
    status === 'authenticated' && session.user && (
      <div className="min-h-screen bg-blue-50">
        <NavbarUser />
        <div className="flex justify-center items-center p-8">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
            <div className="bg-blue-300 text-800 text-center py-5 rounded-t-2xl">
              <h1 className="text-3xl text-white font-bold">Your Payment is Success</h1>
            </div>

            <div className="flex flex-col justify-center items-center py-8 px-6">
              <div className="bg-green-50 rounded-lg shadow-inner p-8 text-center">
                <h2 className="text-xl font-semibold mb-6 ">Tracking ID: {orderId}</h2>
                <p className="text-lg mb-2">Order Date: {formatDate(createdAt)}</p>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <p key={index} className="text-lg mb-2">
                      {item.title} - {item.quantity} x {formatCurrency(item.totalPrice / item.quantity)} = {formatCurrency(item.totalPrice)}
                    </p>
                  ))
                ) : (
                  <p className="text-lg mb-4">No items in order</p>
                )}
                <p className="text-lg mb-2">Total Price: {formatCurrency(totalPrice)}</p>
                <p className="text-lg mb-2">Shipping Cost: {formatCurrency(shippingCost)}</p>
                <p className="text-lg font-bold mt-8 ">Grand Total: {formatCurrency(totalPrice + shippingCost)}</p>
                
                <p className="flex justify-center text-xl mt-0 mb-1">Thanks for your perchase </p>
            
              </div>
            </div>

            <div className="flex justify-center pb-10">
              <Link href="/home">
                <button className="bg-green-300 hover:bg-green-400 text-white font-medium px-6 py-3 mt-0 rounded-xl transition duration-300">
                  Back to Home
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    )
  );
}
