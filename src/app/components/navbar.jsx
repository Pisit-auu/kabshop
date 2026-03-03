import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-sky-600/95 shadow-md border-b border-sky-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

        {/* Left Section: เมนูหรือ Hamburger */}
        <div className="flex-1 flex items-center justify-start">
          {/* Hamburger Menu (แสดงเฉพาะจอมือถือ/แท็บเล็ต) */}
          <button 
            type="button"
            className="p-2 -ml-2 text-white/90 hover:text-white hover:bg-sky-500 rounded-lg transition-colors focus:outline-none lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

 
        </div>

        {/* Center Section: Logo */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <Link href="/" className="group flex items-center">
            <div className="relative w-[70px] h-[70px] sm:w-[90px] sm:h-[90px]">
              <Image
                src="/KAB.png"
                alt="logo"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 70px, 90px"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Right Section: Login / Register */}
        <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-4">
          <Link
            href="/user/login"
            className="text-white/90 hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-sky-500 transition-colors text-sm sm:text-base"
          >
            Login
          </Link>

          <Link
            href="/user/register"
            className="text-white/90 hover:text-white font-medium px-3 py-2 rounded-lg hover:bg-sky-500 transition-colors text-sm sm:text-base"
          >
            Register
          </Link>
        </div>

      </div>
    </nav>
  );
}