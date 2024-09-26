'use client'
import Link from "next/link";
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Homepro() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        try {
            const query = new URLSearchParams({ category: selectedCategory, search }).toString();
            const url = `/api?${query}`;
            console.log('Fetching posts with URL:', url);
            const res = await axios.get(url);
            console.log('Posts data:', res.data); // Check the response data structure
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to fetch posts');
        }
    };
    

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch categories');
        }
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        fetchPosts(); 
    };

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, [selectedCategory, search]);

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="container mx-auto p-6">
                <div className="flex flex-wrap justify-center items-center space-x-4 mb-6">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategorySelect(cat.name)} 
                            className={`text-lg font-semibold px-4 py-2 rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg ${
                                selectedCategory === cat.name ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                    <input
                        className="flex-grow bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Link href="/">
                        <img src="/search.png" alt="Search" className="w-10 h-10 ml-4"/>
                    </Link>
                </div>

<div className="h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
    {posts.length > 0 ? (
        posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link href={`/products/${post.id}`}>
                    <img 
                        className="h-60 w-full object-contain" 
                        src={post.img || '/default-image.jpg'} 
                        alt={post.title} 
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                        <p className="text-gray-600">฿{post.price}.00</p>
                    </div>
                </Link>
            </div>
        ))
    ) : (
        <p className="text-gray-600">No posts found</p>
    )}
</div>

                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
}
