"use client"

import type React from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, ShieldAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { loginAdmin } from "../actions"

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)

      const result = await loginAdmin(formData)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      // Success - redirect to admin dashboard
      // Use window.location instead of router.push to ensure cookies are sent
      window.location.href = "/admin/dashboard"
    } catch (err) {
      console.error('Login error:', err)
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // Calculate password strength for UI feedback
  const getPasswordStrength = () => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    return strength
  }

  const passwordStrength = getPasswordStrength()

  return (
    <>
      {/* SEO: Prevent indexing of admin pages */}
      <meta name="robots" content="noindex,nofollow" />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-blue-600 text-white p-3 rounded-lg">
                <ShieldAlert className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">SK AutoSphere Admin</CardTitle>
            <CardDescription className="text-center">Secure Portal – Authorized Use Only</CardDescription>
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <Lock className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Use <strong>admin@test.com</strong> / <strong>pass458</strong>
              </AlertDescription>
            </Alert>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email / Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="admin@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {password && (
                  <div className="space-y-1">
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${passwordStrength < 50 ? "bg-red-500" : passwordStrength < 75 ? "bg-amber-500" : "bg-green-500"
                          }`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      Password strength: {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Medium" : "Strong"}
                    </p>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => alert("Demo mode: Password recovery not available")}
                >
                  Forgot password?
                </button>
              </div>


              <div className="pt-4 border-t">
                <p className="text-xs text-center text-slate-500">
                  Production system – Connected to Supabase backend with full authentication.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
