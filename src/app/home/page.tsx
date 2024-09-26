'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import NavbarUser from "../components/navbaruser";
import Homepro from "../components/product";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user?.email) {
      // Fetch user role based on email
      const fetchUserRole = async () => {
        try {
          const response = await axios.get(`/api/user/${session.user.email}`);
          setRole(response.data.role); // Assuming the API returns a `role` field
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      };
      fetchUserRole();
    }
  }, [router, status, session?.user?.email]);

  if (status === 'loading' || role === null) return <div>Loading...</div>;

  return (
    status === 'authenticated' && session.user && (
      <div className="min-h-screen items-center justify-start">
        <NavbarUser />
        <Homepro />
      </div>
    )
  );
}
