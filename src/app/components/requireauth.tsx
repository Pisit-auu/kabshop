"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Masthead from "./masthead";
import { PageLoading } from "./press";
import { useMe } from "./me";

/**
 * Gate for member pages. Sends an unauthenticated reader to the sign-in form
 * carrying where they were headed, so they land back on it afterwards.
 */
export default function RequireAuth({
  children,
  admin = false,
}: {
  children: React.ReactNode;
  admin?: boolean;
}) {
  const { status } = useSession();
  const { me, loading } = useMe();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/user/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  useEffect(() => {
    if (admin && !loading && me && me.role !== "admin") router.replace("/");
  }, [admin, loading, me, router]);

  if (status !== "authenticated" || loading || !me || (admin && me.role !== "admin")) {
    return (
      <div className="min-h-screen">
        <Masthead />
        <PageLoading label={admin ? "กำลังตรวจสอบสิทธิ์" : "กำลังเปิดหน้า"} />
      </div>
    );
  }

  return <>{children}</>;
}
