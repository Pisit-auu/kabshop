'use client'
import Link from "next/link";
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password
            });

            if (result.error) {
                console.error(result.error);
                alert('Invalid username or password.');
                return false;
            }

            router.push('/home');
        } catch (error) {
            console.log('Error:', error);
            alert('Something went wrong. Please try again.');
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

                <h1 className="text-5xl font-bold text-center mb-8 ">L O G I N </h1>

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
                            Login
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text">
                            If you don't have an account{" "}
                            <Link className="text-blue-700 hover:text-blue-900" href="/user/register">sign up</Link>{" "}
                            here.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
