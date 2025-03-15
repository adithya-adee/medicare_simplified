"use client"
import { SessionProvider } from "next-auth/react";
import { SignOut } from "./sign-out";

export default function Home() {
  return (
    <SessionProvider>
      <SignOut/>
    </SessionProvider>
  );
}
