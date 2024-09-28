import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import SessionProvider from './components/SessionProvider';
import {Poppins} from 'next/font/google';/*font*/
const inter = Inter({ subsets: ["latin"] });

import { getServerSession } from "next-auth"; 
export const metadata = {
  title: "KABSHOP",
  description: "KABSHOP ONLINE",
};
//font
const poppins_font = Poppins({
  subsets:['latin'],
  weight: ['300','400','500','600','700','800','900'],
  variable: '--font-poppins'

});

export default async function RootLayout({ children }) {
  const session = await getServerSession()
  return (
    <html lang="en">

      <body className={inter.className}>
        
    
        <SessionProvider session={session}>{children}</SessionProvider>
         
        
        </body>

    </html>
  );
}
