"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Hotel", href: "/hotels" },
  { name: "Apartment", href: "/apartments" },
  { name: "Car", href: "/cars" },
  { name: "About", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export function Navrbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [user, setUser] = useState({ name: "" });

  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.user) {
      setUser({ name: session.user.name || "" });
    }
  }, [sessionStatus, session]);

  const handleLogin = () => {
    localStorage.setItem("redirectPath", router.asPath);
    router.push("/auth");
  };

  const handleLogout = () => {
    // Implement your logout logic here
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Logo</span>
            </Link>
          </div>

          {/* Centered Nav Items - Hidden on mobile */}
          <div className="hidden md:flex items-center justify-center flex-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons or User Menu - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            {sessionStatus === "authenticated" ? (
              <>
                <Link href="/cart">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <User className="h-5 w-5" />
                      <span>{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => router.push("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push("/orders")}>
                      Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleLogin}>
                  Login
                </Button>
                <Button onClick={() => router.push("/register")}>
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-bold text-gray-800">Menu</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 space-y-2">
                    {sessionStatus === "authenticated" ? (
                      <>
                        <Link href="/cart">
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center space-x-2"
                          >
                            <ShoppingCart className="h-5 w-5" />
                            <span>Cart</span>
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Log out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            handleLogin();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Login
                        </Button>
                        <Button
                          className="w-full"
                          onClick={() => {
                            router.push("/register");
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Register
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
