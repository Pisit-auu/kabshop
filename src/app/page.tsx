'use client'
import Link from "next/link";
import Navbar from "./components/navbar";
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Homepro from "./components/products"
export default function Home() {

  return (
    
    <div className="min-h-screen ">
      {/* bg-gray-100 text-gray-900 */}
      <Navbar  />
      <Homepro />
    </div>
  );
}
