"use client"

import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
 
export function SignOut() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()

  // Return early if still loading the session
  if (status === "loading") {
    return <div className="flex justify-center p-4">Loading...</div>
  }

  // If not authenticated, show unauthorized message
  if (!session?.user) {
    // Redirect after showing message
    setTimeout(() => {
      window.location.href = '/sign-in'
    }, 2000)

    return (
      <div className="h-[100vh] w-full flex items-center justify-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 bg-destructive/10 border border-destructive rounded-lg shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-destructive border-t-transparent" />
              <p className="text-center font-medium text-destructive">
                You are not authorized to view this page
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to sign in...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Get user initials for avatar
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U"
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      // Use signOut from next-auth/react directly
      await signOut({ redirect: true, callbackUrl: '/' })
      toast.success("You have been signed out successfully")
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Failed to sign out. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="space-y-4">
        <Card className="p-4">
          <CardContent className="p-0 flex items-center gap-4">
            <Avatar>
              <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
              <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{session.user.name || "User"}</p>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          onClick={handleSignOut}
          type="button" 
          variant="destructive" 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </>
  )
}

