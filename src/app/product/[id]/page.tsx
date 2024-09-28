'use client'
import Link from "next/link";
import NavbarUser from "../../components/navbaruser";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Product({ params }: { params: { id: string } }) {
  const [post, setPosts] = useState([]);
  const { id } = params;
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [postId, setpostid] = useState('');
  const [content, setContent] = useState('');
  const [value, setValue] = useState(0); // จำนวนสินค้าที่มีอยู่
  const [img, setIMG] = useState('');
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<string | null>(null); // Change type to string to hold user id
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');

  const fetchPost = async (id: string) => {
    try {
      const res = await axios.get(`/api/posts/${id}`);
      setPosts(res.data);
      setTitle(res.data.title);
      setValue(res.data.quantity);
      setContent(res.data.content);
      setIMG(res.data.img);
      setpostid(res.data.id);
      setPrice(res.data.price);
      
      const response = await axios.get(`/api/user/${session?.user?.email}`);
      setUserData(response.data.id); // Assuming response.data.id is the user ID
    } catch (error) {
      console.error(error);
    }
  };

  const handleaddcart = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        if (userData && postId) {
            const response = await axios.post('/api/cart', {
                userId: userData,
                postId,
                quantity,
            });

            if (response.status === 200) {
                alert('Item added to cart successfully');
            } else {
                alert('Failed to add item to cart');
            }
        } else {
            alert('User data or post ID is missing');
        }
    } catch (error) {
        console.log('error', error);
        alert('Something went wrong');
    }
};
const handlebuy = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  try {
      if (userData && postId) {
          const response = await axios.post('/api/cart', {
              userId: userData,
              postId,
              quantity,
          });

          if (response.status === 200) {
            router.push('/checkout');
          } else {
              alert('Failed to add item to cart');
          }
      } else {
          alert('User data or post ID is missing');
      }
  } catch (error) {
      console.log('error', error);
      alert('Something went wrong');
  }
};
  

  useEffect(() => {
    if (id && session) {
      fetchPost(id);
    }
  }, [id, session]);

  const incrementQuantity = () => {
    setQuantity(prevQuantity => {
      if (prevQuantity < value) {
        return prevQuantity + 1;
      } else {
        return prevQuantity; // ไม่เพิ่มถ้าจำนวนถึงขีดจำกัดแล้ว
      }
    });
  };

  const decrementQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  return (
    <div>
      <NavbarUser />
      <div className="bg-blue-100 min-h-screen">
        <div className="ml-4 mr-4">
          <div className="p-4 flex justify-center items-start">

          </div>

          <div className="bg-white h-[700px] mx-28 my-8 p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-[600px]">
                    <img className="w-[500px] h-auto mx-4" src={img} alt="Product Image" />
                </div>
              </div>

              <div className="space-y-4 pt-20 pr-20">
                <div className="text-2xl font-bold border-b-2 border-black pb-2">{title}</div>
                <div className="text-lg font-semibold">รายละเอียดสินค้า :</div>
                <div className="text-gray-700 leading-relaxed">
                </div>
                <div className="border-2 border-black h-[200px] p-4 bg-gray-100 rounded-lg">
                  {content}
                </div>
                <div className="text-orange-500 text-2xl 	"> ฿ {price}.00</div>
                {value > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={decrementQuantity}
                          className="text-4xl px-4 py-2 bg-gray-200 rounded-md"
                        >
                          -
                        </button>
                        <input
                          className="text-center text-4xl border-2 border-black rounded-md mx-2 w-20"
                          type="number"
                          value={quantity}
                          readOnly
                        />
                        <button 
                          onClick={incrementQuantity}
                          className="text-4xl px-4 py-2 bg-gray-200 rounded-md"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="pl-4">{value} items remaining</div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <form onSubmit={handleaddcart}>
                          <button 
                            type="submit"
                            className="w-full border-2 border-black text-xl rounded-lg py-2 bg-yellow-300 hover:bg-yellow-400"
                          >
                            Add to Cart
                          </button>
                        </form>
                      </div>
                      <div>
                      <form onSubmit={handlebuy}>
                        <button className="w-full border-2 border-black text-xl rounded-lg py-2 bg-green-300 hover:bg-green-400">
                          Buy
                        </button>
                        </form>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-red-500 text-xl font-bold">Out of Stock</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}