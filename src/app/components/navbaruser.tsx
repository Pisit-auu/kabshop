import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';

export default function NavbarUser() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState(null); 
  const fetchPosts = async () => {
    if (!session?.user?.email) return; // Ensure email is available
    try {
      const response = await axios.get(`/api/user/${session.user.email}`);
      setUserData(response.data);
    } catch (error) {
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user?.email) {
      
      // Fetch user role based on email
      const fetchUserRole = async () => {
        try {
          const response = await axios.get(`/api/user/${session.user.email}`);
          setRole(response.data.role); // Assuming the API returns a `role` field
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      };
      fetchUserRole();
    }
  }, [router, status, session?.user?.email]);
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else {
      fetchPosts();
    }
  }, [router, status, session?.user?.email]); // Depend on email change

  const handleUpdate = async () => {
    // Your update logic here (e.g., form submission)
    // After successful update, refetch the user data
    await fetchPosts();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    status === 'authenticated' && session.user && (
      <div className="relative">
        <div className="grid grid-cols-3 bg-sky-600 h-32 items-center shadow-xl z-50 border-b-2 border-blue-950">
          <div className="flex justify-self-start ml-8">
            <button className="focus:outline-none" onClick={toggleMenu}>
              <img className="w-8 h-8" src="/menu.png" alt="menu" />
            </button>
          </div>

          <div className="justify-self-center">
            <Link href="/home">
              <img className="w-20 h-auto" src="/KAB.png" alt="Logo" />
            </Link>
          </div>

          <div className="flex justify-self-end items-center mr-8 space-x-4">
            <Link href="/user/profile/information">
              <img className="w-8 h-8" src="/user.png" alt="user" />
            </Link>

            <div className="text-white text-xl font-semibold">
              <Link href="/user/profile/information">{userData?.name || 'User'}</Link>
            </div>
            <Link href={`/cart`}>
              <img className="w-8 h-8" src="/cart.png" alt="cart" />
            </Link>

            <button onClick={() => signOut({ callbackUrl: '/' })}>
              <img className="w-8 h-8" src="/logout.png" alt="logout" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="absolute left-0 top-0 w-64 h-[500px] bg-white shadow-lg z-50 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-sky-600 text-white">
              <div className="text-xl font-semibold">
                <Link href="/user/profile/information">{userData?.name || 'User'}</Link>
              </div>
              <button className="hover:text-red-400" onClick={toggleMenu}>
                ✖
              </button>
            </div>

            <div className="p-4">
              <Link href="/home">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                  Home
                </div>
              </Link>
              <Link href="/user/profile/all">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                  Purchase history
                </div>
              </Link>
              {role === 'admin' && (
                    <Link href="/admin">
                <div className="text-blue-800 mb-4 hover:text-blue-800 cursor-pointer font-medium">
                  Sales
                </div>
              </Link>
            )}
            </div>
          </div>
        )}
      </div>
    )
  );
}
