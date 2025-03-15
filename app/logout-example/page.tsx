import { SignOut } from "../sign-out"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LogoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b px-4 py-3 flex items-center justify-between bg-card">
        <h1 className="text-xl font-semibold">Medicare Simplified</h1>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              View your profile information and sign out options.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="rounded-lg border p-4">
              <h3 className="text-md font-medium mb-2">Your Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Below is your account information and sign out option.
              </p>
              <SignOut />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 