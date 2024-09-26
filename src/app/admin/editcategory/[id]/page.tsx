'use client';
import { useSession } from "next-auth/react";
import NavbarGlobal from "../../../components/navbarglobal";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

export default function Edit({ params }: { params: { id: string } }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = params;

  // Fetch post data
  const fetchCategories = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/categories/${id}`);
      setName(res.data.name);
    } catch (error) {
      setError('Failed to fetch post data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data and role
  const fetchUserData = async () => {
    try {
      if (session?.user?.email) {
        const userResponse = await axios.get(`/api/user/${session.user.email}`);
        setRole(userResponse.data.role || null); // Explicitly set role or null
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  // Fetch categories data


  useEffect(() => {
    if (id) {
      fetchCategories(id);
    }
    fetchUserData();
  }, [id]);

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Role:', role);

    // Redirect if the user is not an admin
    if (status === 'authenticated' && role !== null) {
      if (role !== 'admin') {
        router.push('/home');
      }
    }else if(status=== 'unauthenticated'){
      router.push('/home');
    
    }
    
  }, [status, role, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/categories/${id}`, {
        name,
      });
      router.push('/admin');
    } catch (error) {
      setError('Something went wrong');
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (role === 'admin') {
    return (
      <div>
        <NavbarGlobal />
        <div className="p-8 min-h-screen bg-gray-100">
          <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit</h2>
            </header>
            <div className="space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="border-b-2 border-gray-300 pb-4">
                  <div className="h-20">
                    <div className="text-lg font-semibold">Name</div>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1 block h-10 w-full rounded-md border-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
             
                
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mt-12"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Edit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
