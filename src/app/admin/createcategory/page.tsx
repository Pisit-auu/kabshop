'use client';

import { useSession } from "next-auth/react";
import NavbarGlobal from "../../components/navbarglobal";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

export default function CreatePost() {
  const [name, setname] = useState('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch categories


  // Fetch user data and role
  const fetchUserData = async () => {
    try {
      if (session?.user?.email) {
        const userResponse = await axios.get(`/api/user/${session.user.email}`);
        setRole(userResponse.data.role || null);
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && role !== null) {
      if (role !== 'admin') {
        router.push('/home');
      }
    } else if (status === 'unauthenticated') {
      router.push('/home');
    }
  }, [status, role, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`/api/categories`, {
        name
      });
      setSuccess('Post created successfully!');
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (role === 'admin') {
    return (
      <div>
        <NavbarGlobal />
        <div className="p-8 min-h-screen bg-gray-100">
          <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <header className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Create New Post</h2>
            </header>
            {success && <div className="text-green-500 text-center py-4">{success}</div>}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 border-b-2 border-gray-300 pb-4">
                  <div>
                    <label htmlFor="title" className="block text-lg font-semibold text-gray-700">Name</label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                 
                  
                 
                  
                </div>
              
             
                
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Create Category'}
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
