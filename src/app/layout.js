import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import SessionProvider from './components/SessionProvider';
const inter = Inter({ subsets: ["latin"] });
import { getServerSession } from "next-auth"; 
export const metadata = {
  title: "KABSHOP",
  description: "KABSHOP ONLINE",
};

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
