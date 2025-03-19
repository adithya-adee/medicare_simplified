"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User,Customer } from "@/type/interface";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendLoginData = async () => {
    try {
      // Get required user data from session
      const { email, name, id } = session?.user || {};
      console.log(email, name, id);
      // Check if we have the necessary data
      if (!email) {
        console.error("Missing email in session data");
        return;
      }

      // Make POST request to our API endpoint with proper body
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: name || email.split("@")[0],
          id: id ?? email.replace(/[^a-zA-Z0-9]/g, "")
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful response (status 200 or 201)
        console.log("User login successful:", data);
        router.push("/dashboard");
      } else {
        // Handle error responses
        console.error("Login API error:", data.error);
        if (response.status === 409) {
          // Conflict with existing user
          router.push("/dashboard"); // Still redirect to dashboard for existing users
        } else {
          // For other errors, sign out user
          await signOut({ redirect: false });
        }
      }
    } catch (error) {
      console.error("Login API error:", error);
      await signOut({ redirect: true, callbackUrl: "/user" });
    } finally {
      setIsLoading(false);
    }
  };
  // Handle session data and API call
  useEffect(() => {
    setIsClient(true);

    if (status === "authenticated" && session?.user) {
      setIsLoading(true);
      sendLoginData();
    }
  }, [status, session, router]);

  // Render skeleton during SSR/hydration to prevent mismatch
  if (!isClient) {
    return <AuthSkeleton />;
  }

  // Show loading state when authenticating or during API call
  if (status === "loading" || isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="p-8 rounded-lg shadow-md bg-white">
        <h1 className="text-2xl font-bold text-center mb-0">Welcome To</h1>
        <p className="font-bold text-xl text-center text-gray-500 mb-5">Medicare Simplified</p>
        <Button 
          variant="outline" 
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2"
        >
          <GoogleIcon />
          Sign in with Google
        </Button>
        <p className="mt-5 text-md">Sign in or create account with one click</p>
      </div>
    </div>
  );
}

// Extracted components for better readability
function AuthSkeleton() {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="p-8 rounded-lg shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome</h1>
        <div className="w-full h-10 bg-gray-100 rounded"></div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="p-8 rounded-lg shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-0 text-center">Welcome To</h1>
        <p className="font-bold text-xl text-center text-gray-500 mb-5">Medicare Simplified</p>
        <div className="w-full h-10 animate-pulse bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
      />
    </svg>
  );
}