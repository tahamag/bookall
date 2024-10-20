import type { Metadata } from "next";
import "./globals.css";
import { Navrbar } from "@/components/component/navbar";

export const metadata: Metadata = {
  title: "BookAll",
  description: "Book anything and everything you need",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
