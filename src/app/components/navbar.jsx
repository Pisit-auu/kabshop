import Link from "next/link";


export default function Navbar() {

  return (
    // bg-blue-700
    <div className="bg-sky-600 h-32 items-center shadow-xl z-50 border-b-2 border-blue-950	">
      <div className="grid grid-cols-3 h-full items-center">
        <div className="justify-self-start ml-6">
          {/* สามารถเพิ่มไอคอนเมนูได้ที่นี่ถ้าต้องการ */}
        </div>

        <div className="justify-self-center">
          <Link href="/">
            <img className="h-20 w-auto" src="/KAB.png" alt="Logo" />
          </Link>
        </div>

{/* border-solid	border-2 */}
{/* <Link href="/user/login" className="text-white hover:text-gray-200 transition duration-300 ">
            Login
</Link> */}
        <div className="justify-self-end mr-6 flex items-center space-x-4">
            <Link href="/user/login" className="text-white text-bold hover:text-gray-200 transition duration-300 text-lg">
              Login
            </Link>


          <Link href="/user/register" className="text-white hover:text-gray-200 transition duration-300 text-lg">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
