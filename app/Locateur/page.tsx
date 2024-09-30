"use client"
import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/component/sideBar";

const dashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    console.log("id :",session.user.id);
    console.log("name :",session.user.name);
    console.log("email :",session.user.email);
    console.log("rental :",session.user.rental);
  }
/*
  const { data: session , status : sessionStatus } = useSession();
  if (sessionStatus === 'authenticated') {
    const userId = session.user.name;
    const userEmail = session.user.email;
  }else
    router.replace("/Locateur/Login");*/
  return (
    <div>
      <SideBar></SideBar>
    </div>
  )
}

export default dashboard