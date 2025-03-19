"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckAuthResponse } from "@/type/auth";

export default function AuthorizeUser({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await fetch("/api/check", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json() as CheckAuthResponse;
                
                if (!data.authorized) {
                    router.push('/user');
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Authorization check failed:", error);
                router.push('/user');
            }
        };

        checkAuthorization();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}