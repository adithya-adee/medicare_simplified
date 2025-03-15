import { redirect } from "next/navigation"
import { signIn, auth, providerMap } from "@/auth"
import { AuthError } from "next-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import PasswordInputWithConfirm from "./password-input-confirm"
import { User } from "@/type/interface"

export default async function SignUpPage() {
  const session = await auth()
  
  // Safely cast the user to our extended type
  const user = session?.user as User | undefined
  
  // Check if the user is authenticated (either via email or Google)
  const isAuthenticated = user !== undefined
  
  // If they're authenticated but don't have a customer profile yet
  const needsProfile = isAuthenticated && !user?.customer_id
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {needsProfile ? "Complete Your Profile" : "Create an Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {needsProfile 
              ? "Please provide some additional information to complete your registration"
              : "Join Medicare Simplified to access personalized healthcare solutions"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {needsProfile ? (
            // Step 2: User is authenticated, now collect additional information
            <form
              className="space-y-4"
              action="/api/register"
              method="POST"
            >
              <input type="hidden" name="auth_type" value={user?.provider || "email"} />
              <input type="hidden" name="email" value={user?.email || ""} />
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  defaultValue={user?.name || ""}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter your full address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone_no">Phone Number</Label>
                <Input
                  id="phone_no"
                  name="phone_no"
                  placeholder="Your contact number"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    placeholder="Pincode"
                    type="number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    placeholder="Age"
                    type="number"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" required>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full">
                Complete Registration
              </Button>
            </form>
          ) : (
            // Step 1: Initial authentication
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="google">Google</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-4">
                <form
                  className="space-y-4"
                  action={async (formData) => {
                    "use server"
                    
                    const email = formData.get("email") as string
                    const password = formData.get("password") as string
                    
                    try {
                      // First create the user in the auth system
                      await fetch("/api/auth/register", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                      })
                      
                      // Then sign them in
                      await signIn("credentials", {
                        email,
                        password,
                        redirect: true,
                        callbackUrl: "/sign-up", // Redirect back to sign-up to complete profile
                      })
                    } catch (error) {
                      console.error("Registration error:", error)
                      if (error instanceof AuthError) {
                        return redirect(`/error?error=${error.type}`)
                      }
                      throw error
                    }
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInputWithConfirm />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="google" className="space-y-4">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  Sign up with your Google account. You'll be able to provide additional details afterward.
                </div>
                
                <form
                  action={async () => {
                    "use server"
                    try {
                      await signIn("google", {
                        callbackUrl: "/sign-up" // Redirect back to sign-up to complete profile
                      })
                    } catch (error) {
                      if (error instanceof AuthError) {
                        return redirect(`/error?error=${error.type}`)
                      }
                      throw error
                    }
                  }}
                >
                  <Button 
                    type="submit" 
                    variant="outline" 
                    className="w-full"
                  >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Sign up with Google
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          {!needsProfile && (
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/sign-in" className="text-primary font-medium hover:underline">
                Sign in
              </a>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
