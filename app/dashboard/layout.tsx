"use client";

import { SessionProvider } from "next-auth/react";
import AuthorizeUser from "./authorise";
import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SessionProvider>
      <AuthorizeUser>
        <Navbar/>
        {children}
      </AuthorizeUser>
    </SessionProvider>
  );
}