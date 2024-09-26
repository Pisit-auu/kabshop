'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar";
import Link from "next/link";
import NavbarUser from "../../../components/navbaruser";

export default function ChangePassword() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } 
  }, [router, status]);
  return (
    <div className="">
      <NavbarUser></NavbarUser>
      <div className="p-8">
      <div className="grid grid-cols-6 gap-5 p-8">
        {/* Sidebar */}
       
          <Sidebar></Sidebar>
        
        {/* Main Content */}
        <div className="col-span-4 bg-white shadow-md rounded-lg p-8">
          {/* Header */}
          <div className="border-b-2 border-gray-300 mb-8 pb-4">
            <h2 className="text-2xl font-bold">Change Password</h2>
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <label htmlFor="new-password" className="text-lg w-48">New Password</label>
              <input
                id="new-password"
                className="bg-gray-100 px-2 py-1 rounded-lg hover:bg-gray-200 w-1/2"
                type="password"
                placeholder="New password"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="confirm-password" className="text-lg w-48">Confirm Password</label>
              <input
                id="confirm-password"
                className="bg-gray-100 px-2 py-1 rounded-lg hover:bg-gray-200 w-1/2"
                type="password"
                placeholder="Confirm password"
              />
            </div>

            <div className="flex justify-end mt-6">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      </div>

      </div>

    </div>
  );
}
