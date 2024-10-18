"use client";

import Link from "next/link";
import { Home, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sideBar = () => {
  const router = useRouter();
  const [idCLient, setIdCLient] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const { data: session, status: sessionStatus } = useSession();
  useEffect(() => {
    // Your code here will only run once, after the initial render and DOM mutations
    if (sessionStatus === "authenticated") {
      if (session?.user?.id) {
        setIdCLient(session.user.id);
        setName(session.user.name);
        setEmail(session.user.email);
      }
    } else if (sessionStatus === "unauthenticated")
      router.replace("/Locateur/Login");
  }, [sessionStatus]);

  return (
    <div className="flex h-screen w-64 flex-col justify-between bg-gray-800 text-white">
      <div>
        <div className="p-4">
          <Link href="/Locateur" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Locateur page</span>
          </Link>
        </div>
        <nav className="space-y-2 px-4">
          <Link
            href="/"
            className="flex items-center space-x-2 rounded-lg px-2 py-1.5 hover:bg-gray-700"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link
            href="/Locateur/Add"
            className="flex items-center space-x-2 rounded-lg px-2 py-1.5 hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M14 4h6v6h-6z" />
              <path d="M4 14h6v6H4z" />
              <path d="M17 17L7 7" />
            </svg>
            <span>Rental</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center space-x-2 rounded-lg px-2 py-1.5 hover:bg-gray-700"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start space-x-2 px-2 hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M4 21v-4a8 8 0 1 1 16 0v4" />
              </svg>
              <span>{name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            pdownMenuContent
            className="w-56"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span onClick={() => signOut()}>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default sideBar;
