import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./global.css";

import AuthProvider from "@//providers/SessionProvider"; 
import { ToastProvider } from "@//providers/ToastProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medicare Simplified",
  description: "An Online Pharmacy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <ToastProvider />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
} 