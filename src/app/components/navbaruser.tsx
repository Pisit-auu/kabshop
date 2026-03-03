'use client'
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function NavbarUser() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (status === "authenticated" && session?.user?.email) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`/api/user/${session.user.email}`);
          setUserData(res.data);
          setRole(res.data.role);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [status, session?.user?.email]);

  if (loading) {
    return (
      <div className="h-20 flex items-center justify-center bg-sky-600 text-white">
        Loading...
      </div>
    );
  }

  return (
    status === "authenticated" && (
      <>
        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-sky-600 shadow-lg border-b border-blue-900">
          <div className="relative max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

            {/* Menu Button */}
            <button onClick={() => setIsMenuOpen(true)}>
              <Image src="/menu.png" alt="menu" width={32} height={32} />
            </button>

            {/* Logo */}
            <Link
              href="/home"
              className="absolute left-1/2 -translate-x-1/2 group"
            >
              <Image
                src="/KAB.png"
                alt="logo"
                width={70}
                height={70}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </Link>

            {/* Right Section */}
            <div className="flex items-center space-x-5 text-white">
              <Link
                href="/user/profile/information"
                className="flex items-center space-x-2 hover:opacity-80 transition"
              >
                <Image src="/user.png" alt="user" width={28} height={28} />
                <span className="font-semibold">
                  {userData?.name || "User"}
                </span>
              </Link>

              <Link href="/cart" className="hover:scale-110 transition">
                <Image src="/cart.png" alt="cart" width={28} height={28} />
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hover:scale-110 transition"
              >
                <Image src="/logout.png" alt="logout" width={28} height={28} />
              </button>
            </div>
          </div>
        </nav>

        {/* Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-5 bg-sky-600 text-white flex justify-between items-center">
            <span className="font-semibold text-lg">
              {userData?.name}
            </span>
            <button onClick={() => setIsMenuOpen(false)}>✖</button>
          </div>

          <div className="p-5 space-y-4 text-gray-700">
            <Link href="/home" className="block hover:text-sky-600 font-medium">
              Home
            </Link>

            <Link
              href="/user/profile/all"
              className="block hover:text-sky-600 font-medium"
            >
              Purchase History
            </Link>

            {role === "admin" && (
              <Link
                href="/admin"
                className="block hover:text-sky-600 font-medium"
              >
                Admin page
              </Link>
            )}
          </div>
        </div>
      </>
    )
  );
}