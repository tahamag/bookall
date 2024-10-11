"use client";

import Link from "next/link";
import { Home, Settings, HelpCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const sideBar = () => {
  return (
    <div className="flex h-screen w-64 flex-col justify-between bg-gray-800 text-white">
      <div>
        <div className="p-4">
          <Link href="/" className="flex items-center space-x-2">
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
          <Link
            href="/help"
            className="flex items-center space-x-2 rounded-lg px-2 py-1.5 hover:bg-gray-700"
          >
            <HelpCircle className="h-5 w-5" />
            <span>Help</span>
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
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="User avatar"
                className="h-8 w-8 rounded-full"
              />
              <span>John Doe</span>
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
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  john@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default sideBar;
