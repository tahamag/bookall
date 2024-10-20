'use client';
//import React, { useEffect } from 'react';
//import { useSession } from "next-auth/react";
//import { useRouter } from 'next/navigation';

export default function AdminPage() {
  /*
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      if (session?.user?.role === "admin") {
        router.replace("/Admin"); 
      }
    } else if (sessionStatus === "unauthenticated") {
      router.replace("/Admin/login"); 
    }
  }, [sessionStatus, session, router]);

  if (sessionStatus === "authenticated" && session?.user?.role !== "admin") {
    return (
      <section className='py-24'>
        <div className='container'>
          <h1 className='text-2xl font-bold'>
            You are not authorized to view this page.
          </h1>
        </div>
      </section>
    );
  }
*/
    
  return (
    <div> Home Page </div>
  )
}

