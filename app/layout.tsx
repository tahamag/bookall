import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import SessionProvider from "@/utils/SessionProvider";
import "./globals.css";


export const metadata: Metadata = {
  title: "BookAll",
  description: "Book anything and everything you need",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
