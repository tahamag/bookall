"use client"
import { Loader } from 'lucide-react';
import { useState } from 'react';
import Navbar from "@/components/AdminPanel/Navbar";
import Sidebar from "@/components/AdminPanel/Sidebar";
import Providers from '@/utils/SessionProvider';

const Layout = ({children}:{ children: React.ReactNode })=>{
    const [isLoading, setIsLoading] = useState(false);
   
    return (
        <>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <Providers>
            {children}
            </Providers>
          </main>
        </div>
      </div>
         {isLoading && <Loader/> }
        
        </>
    )
}
export default Layout;