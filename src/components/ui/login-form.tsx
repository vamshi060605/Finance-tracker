import { useRouter } from "next/router";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/lib/auth"; // Add signup logic
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link"; // Use Link for Next.js routing

export function LoginForm({ className = "" }) {
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For signup only
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      router.push("/dashboard"); // Redirect after login
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      setLoading(true);

      if (isSignup) {
        // Signup flow
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await signUpWithEmail(email, password);
      } else {
        // Login flow
        await signInWithEmail(email, password);
      }

      router.push("/dashboard"); // Redirect to dashboard after success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{isSignup ? "Create an Account" : "Welcome Back"}</CardTitle>
          <CardDescription>{isSignup ? "Sign up with Google or email" : "Login with your Google account"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
                  {isSignup ? "Sign up with Google" : "Login with Google"}
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Mymail@example.com" required />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {!isSignup && (
                      <Link href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                        Forgot your password?
                      </Link>
                    )}
                  </div>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {isSignup && (
                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  </div>
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (isSignup ? "Signing up..." : "Logging in...") : isSignup ? "Sign Up" : "Login"}
                </Button>
              </div>
              <div className="text-center text-sm">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <span onClick={() => setIsSignup(false)} className="underline underline-offset-4 cursor-pointer">
                      Login
                    </span>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <span onClick={() => setIsSignup(true)} className="underline underline-offset-4 cursor-pointer">
                      Sign up
                    </span>
                  </>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs">
        By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}
