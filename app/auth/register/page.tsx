import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createSupabaseServerActionClient,
  getCurrentUser,
} from "@/lib/auth/supabase-auth-server";
import { createClient } from "@supabase/supabase-js";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error: errorParam, success: successParam } = await searchParams;
  const user = await getCurrentUser();

  // If already logged in, redirect to dashboard
  if (user) {
    redirect("/dealer/dashboard");
  }

  async function register(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const fullName = formData.get("fullName") as string;
    const businessName = formData.get("businessName") as string;
    const role = (formData.get("role") as string) || "dealer";

    // Validation
    if (!email || !password || !fullName) {
      redirect("/auth/register?error=missing_fields");
    }

    if (password !== confirmPassword) {
      redirect("/auth/register?error=password_mismatch");
    }

    if (password.length < 8) {
      redirect("/auth/register?error=password_too_short");
    }

    try {
      const supabase = await createSupabaseServerActionClient();

      // 1. Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
          },
        },
      );

      if (signUpError) {
        console.error("Signup error:", signUpError);
        redirect(
          `/auth/register?error=${encodeURIComponent(signUpError.message)}`,
        );
      }

      if (!authData.user) {
        redirect("/auth/register?error=signup_failed");
      }

      // 2. If role is dealer, create dealer profile using Admin Client (bypassing RLS)
      if (role === "dealer" && businessName) {
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SECRET_KEY!,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          },
        );

        const { error: dealerError } = await supabaseAdmin
          .from("dealers")
          .insert({
            user_id: authData.user.id,
            business_name: businessName,
            verified: false,
            rating: 0,
            review_count: 0,
            active_listings: 0,
            sold_vehicles: 0,
          } as any);

        if (dealerError) {
          console.error("Error creating dealer profile:", dealerError);
          // Don't fail registration if dealer profile creation fails, but log it
        }
      }

      // 3. Redirect to success page
      redirect("/auth/register?success=true");
    } catch (error) {
      console.error("Registration error:", error);
      redirect("/auth/register?error=unexpected_error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Join SK AutoSphere as a dealer or buyer
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successParam === "true" ? (
            <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>Registration successful!</strong>
                <br />
                Please check your email to verify your account, then{" "}
                <Link href="/auth/login" className="underline font-medium">
                  sign in
                </Link>
                .
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {errorParam && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errorParam === "missing_fields" &&
                      "Please fill in all required fields"}
                    {errorParam === "password_mismatch" &&
                      "Passwords do not match"}
                    {errorParam === "password_too_short" &&
                      "Password must be at least 8 characters"}
                    {errorParam === "signup_failed" &&
                      "Failed to create account. Please try again."}
                    {errorParam === "unexpected_error" &&
                      "An unexpected error occurred. Please try again."}
                    {![
                      "missing_fields",
                      "password_mismatch",
                      "password_too_short",
                      "signup_failed",
                      "unexpected_error",
                    ].includes(errorParam) && decodeURIComponent(errorParam)}
                  </AlertDescription>
                </Alert>
              )}

              <form action={register} className="space-y-4">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role">I want to</Label>
                  <select
                    id="role"
                    name="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue="dealer"
                  >
                    <option value="dealer">Sell vehicles (Dealer)</option>
                    <option value="buyer">Buy vehicles (Buyer)</option>
                  </select>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    autoComplete="name"
                  />
                </div>

                {/* Business Name (for dealers) */}
                <div className="space-y-2">
                  <Label htmlFor="businessName">
                    Business Name (Optional for dealers)
                  </Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    type="text"
                    placeholder="Your Auto Export Co."
                    autoComplete="organization"
                  />
                  <p className="text-xs text-slate-500">
                    You can update this later in your profile
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="dealer@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    minLength={8}
                  />
                  <p className="text-xs text-slate-500">
                    Must be at least 8 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    minLength={8}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
