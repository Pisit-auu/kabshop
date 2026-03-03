import Link from "next/link";
import Image from "next/image";

export default function NavbarGlobal() {
  return (
    <div className="bg-sky-600 h-20 shadow-xl border-b-2 border-blue-950 flex items-center justify-center">
      <Link href="/home" className="flex items-center justify-center">
        <Image
          src="/KAB.png"
          alt="Logo"
          width={70}
          height={70}
          className="object-contain"
          priority
        />
      </Link>
    </div>
  );
}