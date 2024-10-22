"use client";
import { Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from "@/components/AdminPanel/Navbar";
import Sidebar from "@/components/AdminPanel/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/Admin/login";

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        if (!isLoginPage) {
          router.replace("/Admin/login");
        }
      }
      setIsLoading(false);
    } else if (status === "unauthenticated") {
      if (!isLoginPage) {
        router.replace("/Admin/login");
      }
      setIsLoading(false);
    }
  }, [status, session, router, isLoginPage]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin" /></div>;
  }

  if (status === "authenticated" && session?.user?.role !== "admin" && !isLoginPage) {
    return (
      <section className='py-24'>
        <div className='container'>
          <h1 className='text-2xl font-bold mb-4'>
            You are not authorized to view this page.
          </h1>
          <Link href='/Admin/login' passHref>
            <Button variant="link">
              Return to Login
            </Button> 
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {!isLoginPage ? (
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
              {children}
            </main>
          </div>
        </div>
      ) : (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      )}
    </>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <LayoutContent>{children}</LayoutContent>
    </SessionProvider>
  );
};

export default Layout;