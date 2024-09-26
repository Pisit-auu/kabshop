import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-blue-600 h-29 items-center shadow-lg z-50">
      <div className="grid grid-cols-3 h-full items-center">
        <div className="justify-self-start ml-6">
          {/* สามารถเพิ่มไอคอนเมนูได้ที่นี่ถ้าต้องการ */}
        </div>

        <div className="justify-self-center">
          <Link href="/">
            <img className="h-20 w-auto" src="/KAB.png" alt="Logo" />
          </Link>
        </div>

        <div className="justify-self-end mr-6 flex items-center space-x-4">
          <Link href="/user/login" className="text-white hover:text-gray-200 transition duration-300">
            Login
          </Link>
          <Link href="/user/register" className="text-white hover:text-gray-200 transition duration-300">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
