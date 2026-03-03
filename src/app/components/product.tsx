'use client'
import Link from "next/link";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from "next/image"

export default function Homepro() {
    const [posts, setPosts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams({ category: selectedCategory, search }).toString();
            const res = await axios.get(`/api?${query}`);
            setPosts(res.data);
        } catch (err) {
            setError('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
        } catch {
            setError('Failed to fetch categories');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory, search]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`px-5 py-2 rounded-full font-medium transition-all
                            ${selectedCategory === cat.name 
                                ? 'bg-sky-600 text-white shadow-md' 
                                : 'bg-white border border-gray-300 hover:bg-sky-100'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="flex justify-center mb-10">
                    <div className="relative w-full max-w-xl">
                        <input
                            className="w-full border border-gray-300 px-5 py-3 rounded-full shadow-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="absolute right-4 top-3 text-gray-400">🔍</div>
                    </div>
                </div>

                {/* Products */}
                {loading ? (
                    <div className="text-center text-gray-500 animate-pulse">
                        Loading products...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
                                >
                                    <Link href={`/product/${post.id}`}>
                                        <div className="relative h-48 bg-gray-100">
                                            <Image
                                                src={post.img || '/default-image.jpg'}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        <div className="p-4">
                                            <h3 className="text-sm font-semibold line-clamp-2 mb-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-sky-600 font-bold text-lg">
                                                ฿{post.price}.00
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">
                                No products found
                            </p>
                        )}
                    </div>
                )}

                {error && <p className="text-red-500 mt-6 text-center">{error}</p>}
            </div>
        </div>
    );
}