'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/sidebar';
import NavbarUser from '../../../components/navbaruser';

interface OrderItem {
  postId: number;
  quantity: number;
  totalPrice: number;
  post: {
    title: string;
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
  const [error, setError] = useState<string | null>(null);
// คำนวณ order total ทั้งหมด
  const totalOrderAmount = orders.reduce((total, order) => {
    const orderTotal = order.items.reduce(
      (orderSum, item) => orderSum + item.totalPrice,
      36
    );
    return total + orderTotal;
  }, 0);
  
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user?.id) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get('/api/getorder', {
            params: { userId: session.user.id }, // Pass userId to API
          });
          setOrders(response.data);


        } catch (error) {
          setError('Failed to fetch orders');
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
      
    }
  }, [router, status, session?.user?.id]);

  useEffect(() => {
    if (orders.length > 0) {
      const totalOrderAmount = orders.reduce((total, order) => {
        const orderTotal = order.items.reduce(
          (orderSum, item) => orderSum + item.totalPrice,
          36
        );
        return total + orderTotal;
      }, 0);
  
      const addpurcheseuse = async () => {
        try {
          await axios.put(`/api/user/${session.user.email}`, {
            purchaseamount: totalOrderAmount
          });
        } catch (error) {
          setError('Something went wrong');
          console.log('error', error);
        }
      };
  
      addpurcheseuse();
    }
  }, [orders, session?.user?.email]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen">
      <NavbarUser />
      <div className="p-8">
        <div className="grid grid-cols-6 gap-5 p-8">
          {/* Sidebar */}
          <Sidebar />
          {/* Main Content */}
          <div className="col-span-4 bg-white rounded-lg shadow-lg p-8 ">
            <div className="border-b-2 border-gray-300 flex items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">All Orders :</h1> 
              <h1 className="text-2xl font-bold text-gray-800"> Total Order Amount: ฿{totalOrderAmount.toFixed(2)} </h1>
            </div>

            <div className="space-y-6">
              {orders.length > 0 ? (
                orders.map(order => {
                  // Calculate the total price for the order
                  const totalOrderPrice = order.items.reduce(
                    (total, item) => total + item.totalPrice,
                    0+36
                  );

                  return (
                    <div key={order.orderId} className="border rounded-lg bg-white shadow-md p-4">
                      <div className="text-lg font-semibold text-gray-700 mb-2">Order ID: {order.orderId}</div>
                      <p className="text-gray-600 mb-4">Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                      {order.items.map(item => (
                        <div key={item.postId} className="flex items-center border-t border-gray-200 pt-4 mt-4">
                          {item.post.img && (
                            <img
                              src={item.post.img}
                              alt={item.post.title}
                              className="w-20 h-20 object-cover rounded-md mr-4"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-lg font-medium text-gray-800">{item.post.title}</p>
                            <p className="text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-gray-600">Total Price: ฿{item.totalPrice.toFixed(2)}</p>
                            
                          </div>
                        </div>
                      ))}
                      <div className="mt-4 border-t pt-4">
                        <p className="text-gray-600">shipping : ฿36 </p>
                        <p className="text-lg font-semibold text-gray-800">Order Total: ฿{totalOrderPrice.toFixed(2)}</p>
                      </div>


                    </div>
                    
                  );
                })
              ) : (
                <div className="text-center text-gray-600">No orders found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
