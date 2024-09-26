'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavbarGlobal from "../components/navbarglobal";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Infostock() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState('desc');
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();
  const [role, setRole] = useState('');
  const [userData, setUserData] = useState(null);
  const [usertop, setnametopbuy] = useState('');
  const [moneytop, setvaluetopbuy] = useState('');
  const [salesData, setSalesData] = useState([]);

  const fetchPosts = async () => {
    try {
      const query = new URLSearchParams({ category, search, sort }).toString();
      const res = await axios.get(`/api?${query}`);
      setPosts(res.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch posts');
    }
  };

  const fetchSales = async () => {
    try {
      const res = await axios.get(`/api`);
      setSalesData(res.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch sales data');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`/api/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch categories');
    }
  };

  const fetchtopbuy = async () => {
    try {
      const resuser = await axios.get(`/api/user`);
      setnametopbuy(resuser.data.name);
      setvaluetopbuy(resuser.data.purchaseamount);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch top buyer');
    }
  };

  const fetchUserData = async () => {
    try {
      if (session?.user?.email) {
        const userResponse = await axios.get(`/api/user/${session.user.email}`);
        setUserData(userResponse.data);
        setRole(userResponse.data.role);
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`/api/posts/${id}`);
      alert('Delete Successful!');
      fetchPosts();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Something went wrong');
    }
  };
  const deleteCat = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      alert('Delete Successful!');
      fetchPosts();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Something went wrong');
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      router.push('/home');
    }
  }, [status]);

  useEffect(() => {
    if (role === 'admin') {
      fetchPosts();
      fetchCategories();
      fetchtopbuy();
      fetchSales();
    } else if (role && role !== 'admin') {
      router.push('/home');
    }
  }, [role]);

  // Prepare data for the chart
  const chartData = {
    labels: salesData.map(item => item.title),
    datasets: [
      {
        label: 'Sales',
        data: salesData.map(item => item.Sales),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (status === 'loading' || (status === 'authenticated' && !role)) {
    return <div>Loading...</div>;
  }

  return (
    status === 'authenticated' && role === 'admin' ? (
      <div className="min-h-screen">
        <NavbarGlobal />
        <div className="p-8 min-h-screen bg-gray-100">
          <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Stock</h2>
              <Link href="/admin/create">
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out">
                  Add Product
                </button>
              </Link>
            </header>
            <div className="grid grid-cols-3 gap-4 border-b-2 border-gray-300 pb-4 mb-6">
              <input
                className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                aria-label="Search"
              />
              <div className="flex space-x-4">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Category"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Sort"
                >
                  <option value="desc">Latest</option>
                  <option value="asc">Oldest</option>
                </select>
                <button
                  onClick={fetchPosts}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                  aria-label="Apply Filters"
                >
                  Apply
                </button>
              </div>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="space-y-6">
              <div className="grid grid-cols-3 border-b-2 border-gray-300 pb-4">
                <div className="font-semibold">Name Product</div>
                <div className="font-semibold">CATEGORY</div>
                <div className="font-semibold">ACTION</div>
              </div>
              {posts.map((post) => (
                <div key={post.id} className="grid grid-cols-3 border-b-2 border-gray-300 pb-4">
                  <TableRow>{post.title}</TableRow>
                  <TableRow>{post.category.name}</TableRow>
                  <TableRow>
                    <Link className="text-indigo-600 hover:text-indigo-900 mr-4" href={`/admin/edit/${post.id}`}>
                      Edit
                    </Link>
                    <button onClick={() => deletePost(post.id)} className="text-red-600 hover:text-red-900">Delete  </button>
                  </TableRow>
                </div>
              ))}
            </div>
          </div>
          <div className="max-w-5xl mt-4 mx-auto bg-white shadow-md rounded-lg p-8">
          <div className="grid grid-cols-1 border-b-2 border-gray-300 pb-4">
          <header className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Categories</h2>
              <Link href="/admin/createcategory">
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out">
                  Add Category
                </button>
              </Link>
            </header>
            <div className="grid grid-cols-1 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="border border-gray-300 p-4 rounded-md flex justify-between items-center">
                  <div className="font-bold">{cat.name}</div>
                  <div className="space-x-4">
                    <Link className="text-indigo-600 hover:text-indigo-900" href={`/admin/editcategory/${cat.id}`}>
                      Edit
                    </Link>
                    <button onClick={() => deleteCat(cat.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
          </div>

          <div className="max-w-5xl mt-4 mx-auto bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold">The person who buys the most</h2>
            <h1 className="mt-4 font-bold">name: {usertop} amount: {moneytop} bath</h1>
          </div>
          <div className="max-w-5xl mt-4 mx-auto bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold">Graph of sales of each product</h2>
            <div className="mt-4">
              <Bar data={chartData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    beginAtZero: true,
                  },
                  y: {
                    beginAtZero: true,
                  }
                }
              }} />
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
} 

const TableRow = ({ children }) => (
  <div className="px-4 py-2 border border-gray-300">
    {children}
  </div>
);
