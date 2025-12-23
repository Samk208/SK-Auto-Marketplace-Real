import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSupabaseServerActionClient, getCurrentUser } from "@/lib/auth/supabase-auth-server"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>
}) {
  const { error: errorParam, redirect: redirectParam } = await searchParams
  const user = await getCurrentUser()

  // If already logged in, redirect to dashboard
  if (user) {
    redirect(redirectParam || "/dealer/dashboard")
  }

  async function login(formData: FormData) {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const redirectTo = formData.get("redirect") as string

    if (!email || !password) {
      redirect("/auth/login?error=missing_credentials")
    }

    const supabase = await createSupabaseServerActionClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
    }

    // Successful login - redirect to dashboard or specified page
    redirect(redirectTo || "/dealer/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in to SK AutoSphere</CardTitle>
          <CardDescription>Enter your email and password to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {errorParam && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorParam === "missing_credentials"
                  ? "Please enter both email and password"
                  : decodeURIComponent(errorParam)}
              </AlertDescription>
            </Alert>
          )}

          <form action={login} className="space-y-4">
            <input type="hidden" name="redirect" value={redirectParam || ""} />

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="dealer@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            <p>Demo credentials:</p>
            <p className="font-mono text-xs mt-1">
              Email: dealer@test.com
              <br />
              Password: dealer123
            </p>
            <p className="mt-3">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}





