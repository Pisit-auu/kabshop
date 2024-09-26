'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from 'axios';

export default function Sidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchUserData = async () => {
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
    } else {
      fetchUserData();
    }
  }, [router, status]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="col-span-2 bg-white shadow-lg rounded-lg p-6">
      <div className="mb-6">
        <div className="text-2xl font-semibold text-gray-800 mb-4">{userData?.name}</div>
        <div className="text-lg font-medium text-gray-600 mb-4 ">My Account</div>
        <div className="space-y-3">
          <Link className="block text-gray-600 ml-4 hover:text-green-600 transition duration-300" href="/user/profile/information">- Information</Link>
        </div>
      </div>

      <div>
        <div className="text-lg font-medium text-gray-600 mb-4">My Purchases</div>
        <div className="space-y-3">
          <Link className="block text-gray-600  ml-4 hover:text-green-600 transition duration-300" href="/user/profile/all">- All Orders</Link>
        </div>
      </div>
    </div>
  );
}
