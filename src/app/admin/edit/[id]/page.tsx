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
  const [title, setTitle] = useState('');
  const [img, setIMG] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [quantity, setQuantity] = useState<number | string>('');
  const [price, setPrice] = useState<number | string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = params;

  // Fetch post data
  const fetchPost = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/posts/${id}`);
      setTitle(res.data.title);
      setIMG(res.data.img);
      setQuantity(res.data.quantity);
      setPrice(res.data.price);
      setContent(res.data.content);
      setCategoryId(res.data.categoryId);
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
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/categories`);
      setCategories(response.data);
    } catch (error) {
      setError('Failed to fetch categories');
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost(id);
      fetchCategories();
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
      await axios.put(`/api/posts/${id}`, {
        title,
        content,
        price: Number(price),
        img,
        quantity: Number(quantity),
        categoryId,
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
                    <div className="text-lg font-semibold">Title</div>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="mt-1 block h-10 w-full rounded-md border-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="text-lg font-semibold">Price</div>
                  <input
                    type="number"
                    name="Price"
                    id="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="mt-1 block h-10 w-full rounded-md border-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <div className="text-lg font-semibold">Quantity</div>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="mt-1 block h-10 w-full rounded-md border-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <div className="text-lg font-semibold">Image</div>
                  <input
                    type="text"
                    name="img"
                    id="img"
                    value={img}
                    onChange={(e) => setIMG(e.target.value)}
                    required
                    className="mt-1 block h-10 w-full rounded-md border-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="border-b-2 border-gray-300 pb-4">
                  <div className="h-20">
                    <div className="text-lg font-semibold">Category</div>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  <div className="h-40">
                    <div className="text-lg font-semibold mt-4">Content</div>
                    <textarea
                      name="content"
                      id="content"
                      required
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="h-full mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    ></textarea>
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
