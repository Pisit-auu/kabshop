import Link from "next/link";
import Image from 'next/image';

export default function NavbarGlobal() {
    // const [color, setColor] = useState('#');
    return (
  

        <div className="bg-sky-600 h-32  shadow-xl z-50 border-b-2 border-blue-950 flex justify-center items-center" >
            <div className="w-32 flex justify-center">
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
