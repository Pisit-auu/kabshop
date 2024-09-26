'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import NavbarUser from "../components/navbaruser";
import Link from "next/link";

interface CartItem {
    id: number;
    postId: number;
    value: number;
    post: {
        id: number;
        title: string;
        price: number;
        img: string;
        quantity: number; // เพิ่มจำนวนคงเหลือที่นี่
    };
}

export default function Cart() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [address, setAddress] = useState('');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState('');
    const handlecheckout = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.push('/checkout');
    };
    const fetchUserData = async () => {
        try {
            const userResponse = await axios.get(`/api/user/${session?.user?.email}`);
            setUserData(userResponse.data);
            setAddress(userResponse.data.address);
            setUserId(userResponse.data.id)

            const cartResponse = await axios.get(`/api/user/${session?.user?.email}`);
            if (Array.isArray(cartResponse.data.cart)) {
                setCartItems(cartResponse.data.cart);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            setError('Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };
   const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
        try {
            if (newQuantity <= 0) {
                // ถ้าจำนวนสินค้า <= 0 ให้ลบสินค้านั้นออกจากตะกร้า
                await axios.delete(`/api/cart/${cartItemId}`);
            } else {
                // อัปเดตจำนวนสินค้าที่มีในตะกร้า
                await axios.put(`/api/cart/${cartItemId}`, { value: newQuantity });
            }
            // ดึงรายการตะกร้าใหม่
            const cartResponse = await axios.get(`/api/user/${session?.user?.email}`);
            setCartItems(cartResponse.data.cart);
        } catch (error) {
            console.log('error', error);
            alert('Something went wrong');
        }
    };
    
    const saveAddress = async () => {
        try {
            await axios.put(`/api/user/${session?.user?.email}`, { address });
            setIsEditing(false);
        } catch (error) {
            setError('Failed to update address');
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        } else if (status === 'authenticated') {
            fetchUserData();
        }
    }, [router, status]);

    if (status === 'loading' || loading) {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return null;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // คำนวณราคาทั้งหมด
    const totalPrice = cartItems.reduce((total, item) => {
        const itemPrice = item.post?.price ?? 0; // ใช้ค่า 0 หาก item.post หรือ item.post.price เป็น undefined
        return total + (item.value * itemPrice);
    }, 0);
    const shippingCost = 36; // สามารถเพิ่มค่าจัดส่งที่นี่
    
    return (
        <div className="h-screen">
            <NavbarUser />

            <div className="grid grid-cols-8 gap-8 m-8">
                <div className="col-span-6 bg-gray-100 p-4">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <div key={item.id} className="border-b py-2">
                                <div className="flex items-center">
                                    <img src={item.post.img} alt={item.post.title} className="w-16 h-16 object-cover mr-4" />
                                    <div className="flex-1">
                                        <div className="text-lg font-semibold">{item.post.title}</div>
                                        <div className="text-gray-500">
                                            Quantity: 
                                            <button 
                                                onClick={() => handleQuantityChange(item.id, item.value - 1)}
                                                className="text-xl px-2"
                                                disabled={item.value <= 1} // ปุ่มลดจำนวนจะไม่ทำงานถ้าจำนวน = 1
                                            >
                                                -
                                            </button>
                                            {item.value}
                                            <button 
                                                onClick={() => handleQuantityChange(item.id, item.value + 1)}
                                                className="text-xl px-2"
                                                disabled={item.value >= item.post.quantity} // ปุ่มเพิ่มจำนวนจะไม่ทำงานถ้าจำนวน = จำนวนคงเหลือ
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-gray-500">Price: ${item.post.price.toFixed(2)}</div>
                                        <div>
                                            <button onClick={() => handleQuantityChange(item.id, 0)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-500">Stock: {item.post.quantity}</div> {/* แสดงจำนวนคงเหลือ */}
                            </div>
                        ))
                    ) : (
                        <div>No items in cart</div>
                    )}
                </div>

                <div className="col-span-2 bg-gray-100 p-4">
                    
                    <div className="grid grid-rows-3">
                        <div className="text-gray-500">Name: {userData?.name}</div>
                        <div className="row-span-1 text-gray-500">Address</div>

                        {isEditing ? (
                            <div className="row-span-2 ml-2 mt-2 text-sm">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="p-2 border rounded-md w-full"
                                />
                                <button
                                    className="mt-2 bg-blue-500 text-white p-2 rounded-md"
                                    onClick={saveAddress}
                                >
                                    Save
                                </button>
                                <button
                                    className="mt-2 bg-gray-500 text-white p-2 rounded-md ml-2"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="row-span-2 ml-2 mt-2 text-sm">
                                {address}
                                <button
                                    className="ml-2 text-blue-500"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="row-span-1 grid grid-rows-10 p-2">
                        <div className="text-lg">Order Summary</div>

                                                    <div className="row-span-3 grid grid-cols-2 grid-rows-2 mx-3">
                                <div className="text-gray-500 self-end text-sm">
                                    Sub Total | {cartItems.reduce((total, item) => total + item.value, 0)} items |
                                </div>
                                <div className="justify-self-end self-end text-sm">
                                    ฿{totalPrice.toFixed(2)}
                                </div>
                                <div className="text-gray-500 self-start text-sm">Shipping</div>
                                <div className="justify-self-end self-start text-sm">
                                    ฿{shippingCost.toFixed(2)}
                                </div>
                            </div>


                        <div className="row-span-4 grid grid-cols-2 grid-rows-2 mx-3">
                            <div className="justify-self-start self-end text-sm">sub Total Amount</div>
                            <div className="justify-self-end self-end text-gray-500 text-sm">
                                ฿{(totalPrice + shippingCost).toFixed(2)}
                            </div>
                        </div>
                        
                        <form onSubmit={handlecheckout}>
                        <button 
                            type="submit" 
                            className="row-span-3 rounded-lg text-center bg-green-300 p-2 rounded-md w-full">
                            Checkout
                        </button>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    );
}



       /* try {
            // ตรวจสอบว่ามีการสั่งซื้อที่มี userId นี้อยู่แล้วหรือไม่
            const existingOrderResponse = await axios.get(`/api/order/${userId}`);
            
            if (existingOrderResponse.data) {
                // หากมีการสั่งซื้ออยู่แล้ว ให้ทำการอัพเดตข้อมูล
                await axios.put(`/api/order/${userId}`, {
                    totalamount: totalPrice,
                    shipping: shippingCost,
                    priceall: totalPrice + shippingCost,
                });
            } else {
                // หากไม่มีการสั่งซื้อ ให้สร้างการสั่งซื้อใหม่
                await axios.post('/api/order', {
                    userId: Number(userId),
                    totalamount: totalPrice,
                    shipping: shippingCost,
                    priceall: totalPrice + shippingCost,
                });
            }
            router.push('/checkout');
        } catch (error) {
            console.log('error', error);
            alert('Something went wrong');
        }*/