import Link from "next/link";
import Image from 'next/image';

export default function NavbarGlobal() {
    return (
  

        <div className="bg-blue-600 h-20 flex justify-center items-center shadow-lg">
            <div className="w-32">
                <Link href="/home" passHref>
                    <Image
                        src="/KAB.png"
                        alt="Logo"
                        width={80} // ปรับขนาดตามที่ต้องการ
                        height={40} // ปรับขนาดตามที่ต้องการ
                        className="object-contain"
                    />
                </Link>
            </div>
        </div>
 
    );
}
