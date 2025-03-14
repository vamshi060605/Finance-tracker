import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signInWithEmail, signUpWithEmail, signInWithGoogle, getCurrentUser } from "@/lib/auth";
import styles from "@/styles/auth.module.css";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // Add auth loading state
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        router.push("/dashboard"); // Redirect to dashboard if user is already logged in
      }
      setAuthLoading(false); // Set auth loading to false after checking user
    }
    checkUser();
  }, [router]);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("An unknown error occurred.");
    }
    setLoading(false);
  }

  async function handleSignUp() {
    setLoading(true);
    setError(null);
    try {
      await signUpWithEmail(email, password);
      alert("Account created! Please check your email.");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("An unknown error occurred.");
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.push("/dashboard"); // Redirect after Google login
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("An unknown error occurred.");
    }
    setLoading(false);
  }

  if (authLoading) {
    return <p>Loading...</p>; // Show loading indicator while checking user
  }

  return (
    <div className={styles.container}>
      <h1>Welcome Back</h1>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.inputGroup}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button onClick={handleLogin} disabled={loading} className={styles.button}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <button onClick={handleSignUp} disabled={loading} className={styles.buttonSecondary}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>

      <div className={styles.divider}>or</div>

      <button onClick={handleGoogleLogin} disabled={loading} className={styles.googleButton}>
        {loading ? "Processing..." : "Login with Google"}
      </button>
    </div>
  );
}