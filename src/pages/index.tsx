// Login page: shows login form and redirects if already authenticated

import { useEffect } from "react";
import { useRouter } from "next/router";
import { LoginForm } from "@/components/ui/login-form"
import "@/styles/globals.css"
import "@/styles/tailwind.css"
import { checkAuthAndRedirect } from "@/lib/auth";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    checkAuthAndRedirect(router, false);
  }, [router]);

  return (
    // Main UI: login form centered on the page
    <div className="flex min-h-screen items-center justify-center bg-background">
      <LoginForm />
    </div>
  )
}
