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
  }, [status, session?.user?.email, router]);

  if (loading) {
    return (
      <div className="h-20 flex items-center justify-center bg-sky-600 text-white font-medium">
        Loading...
      </div>
    );
  }

  return (
    status === "authenticated" && (
      <>
        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-sky-600 shadow-lg border-b border-blue-900">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

            {/* Left: Menu Button */}
            <div className="flex-1 flex justify-start">
              <button onClick={() => setIsMenuOpen(true)} className="hover:opacity-80 transition">
                <Image src="/menu.png" alt="menu" width={32} height={32} />
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex-shrink-0">
              <Link href="/home" className="group flex items-center">
                <Image
                  src="/KAB.png"
                  alt="logo"
                  width={70}
                  height={70}
                  className="transition-transform duration-300 group-hover:scale-110 w-[60px] h-[60px] sm:w-[70px] sm:h-[70px]"
                />
              </Link>
            </div>

            {/* Right Section: Desktop (ซ่อนในมือถือ) */}
            <div className="flex-1 hidden sm:flex items-center justify-end space-x-5 text-white">
              <Link
                href="/user/profile/information"
                className="flex items-center space-x-2 hover:opacity-80 transition"
              >
                <Image src="/user.png" alt="user" width={28} height={28} />
                <span className="font-semibold">{userData?.name || "User"}</span>
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

            {/* Right Spacer for Mobile (เพื่อให้โลโก้อยู่กลางจริงๆ ในมือถือ) */}
            <div className="flex-1 sm:hidden"></div>
          </div>
        </nav>

        {/* Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Sidebar Header */}
          <div className="p-6 bg-sky-600 text-white flex justify-between items-center">
            <div className="flex items-center space-x-3">
               <Image src="/user.png" alt="user" width={32} height={32} className="brightness-200" />
               <span className="font-bold text-lg truncate w-40">{userData?.name}</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="text-2xl hover:rotate-90 transition-transform">
              ✕
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="p-4 flex flex-col h-[calc(100%-88px)] justify-between">
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase px-3 pb-2">Main Menu</p>
              <Link href="/home" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 rounded-lg hover:bg-sky-50 text-gray-700 font-medium transition">
                Home
              </Link>
              <Link href="/user/profile/all" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 rounded-lg hover:bg-sky-50 text-gray-700 font-medium transition">
                Purchase History
              </Link>
              {role === "admin" && (
                <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 rounded-lg bg-amber-50 text-amber-700 font-bold transition">
                  Admin Dashboard
                </Link>
              )}
            </div>

            {/* Mobile Only Links (แสดงเฉพาะใน Sidebar เมื่อจอเล็ก) */}
            <div className="sm:hidden border-t pt-4 space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase px-3 pb-2">Account</p>
              <Link href="/user/profile/information" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 rounded-lg hover:bg-sky-50 text-gray-700 transition">
                My Profile
              </Link>
              <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 rounded-lg hover:bg-sky-50 text-gray-700 transition">
                My Cart
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left flex items-center px-3 py-3 rounded-lg hover:bg-red-50 text-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </>
    )
  );
}