import type { Metadata } from "next";
import "./globals.css";
import { Navrbar } from "@/components/component/navbar";
import { Sliders } from "@/components/component/sliders";
import { HotelSection } from "@/components/component/hotel-section";
import { ApartementSection } from "@/components/component/apartement-section";
import { CarSection } from "@/components/component/car-section";
import { SearchSection } from "@/components/component/search-section";


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
