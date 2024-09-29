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
  const [title, setTitle] = useState('');
  const [img, setIMG] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [quantity, setQuantity] = useState<number | string>('');
  const [price, setPrice] = useState<number | string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/categories`);
      setCategories(response.data);
    } catch (error) {
      setError('Failed to fetch categories');
      console.error(error);
    }
  };

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
    fetchCategories();
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
      if(Number(price) < 0 || Number(quantity)<0 ){
          alert("Price or quantity is greater than 0.")
          return
      }
      await axios.post(`/api`, {
        title,
        content,
        price: Number(price),
        img,
        quantity: Number(quantity),
        categoryId,
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
        <div className="p-5 min-h-screen bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 ">
            <header className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Create New Product</h2>
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
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="Price" className="block text-lg font-semibold text-gray-700">Price</label>
                    <input
                      type="number"
                      name="Price"
                      id="Price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block text-lg font-semibold text-gray-700">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="img" className="block text-lg font-semibold text-gray-700">Image URL</label>
                    <input
                      type="text"
                      name="img"
                      id="img"
                      value={img}
                      onChange={(e) => setIMG(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="border-b-2 border-gray-300 pb-4">
                  <div>
                    <label htmlFor="category" className="block text-lg font-semibold text-gray-700">Category</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="border-b-2 border-gray-300 pb-4">
                  <div>
                    <label htmlFor="content" className="block text-lg font-semibold text-gray-700">Details</label>
                    <textarea
                      name="content"
                      id="content"
                      required
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Create New Product'}
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
