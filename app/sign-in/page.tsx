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
import PasswordInput from "./password-input"

const SIGNIN_ERROR_URL = "/error" // Placeholder URL, replace with actual error URL

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Medicare Simplified
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            action={async (formData) => {
              "use server"
              try {
                await signIn("credentials", formData)
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-xs text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <PasswordInput />
            </div>
            
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {Object.values(providerMap).map((provider) => (
              <form
                key={provider.id}
                action={async () => {
                  "use server"
                  try {
                    await signIn(provider.id, {
                      redirectTo: props.searchParams?.callbackUrl ?? "",
                    })
                  } catch (error) {
                    if (error instanceof AuthError) {
                      return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
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
                  <span>Sign in with {provider.name}</span>
                </Button>
              </form>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/sign-up" className="text-primary font-medium hover:underline">
              Create an account
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}