import type { Metadata } from "next";
import { Dosis } from "next/font/google";
import "./globals.css";

const dosis = Dosis({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MORG",
  description: "Main page for MORG - Music Organizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dosis.className} flex w-full max-h-screen h-screen bg-zinc-300  `} >
        
        {children}
        </body>
    </html>
  );
}
