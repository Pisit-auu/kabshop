'use client'
import axios from "axios";
import Link from "next/link";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/api/auth/signup', {
                email,
                password
            });
            router.push('/user/login');
        } catch (error) {
            console.log('Error:', error);
            alert('Duplicate username.');
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg p-10 bg-white shadow-md rounded-lg">
                <div className="flex justify-center mb-4">
                    <Link href="/">
                        <img className="w-36 h-36" src="/KAB.png" alt="Logo" />
                    </Link>
                </div>

                <h1 className="text-5xl font-bold text-center mb-10">R E G I S T E R</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-xl mb-1" htmlFor="email">Username</label>
                        <input
                            id="email"
                            className="w-full text-3xl p-3 w-full h-10 bg-gray-200 rounded-lg"
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-xl mb-1 " htmlFor="password">Password</label>
                        <input
                            id="password"
                            className="w-full text-3xl p-3 bg-gray-200 w-full h-10 rounded-lg"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-center mb-8">
                        <button
                            className="text-xl rounded-lg bg-indigo-800 w-full h-10 text-white hover:bg-indigo-700 transition duration-300"
                            type="submit"
                        >
                            Register
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text">
                            If you have an account{" "}
                            <Link className="text-blue-700 hover:text-blue-900" href="/user/login">Login</Link>{" "}
                            here.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
