import * as React from "react";
import { LoginForm } from "@/components/ui/login-form";
import "@/styles/tailwind.css"; // Tailwind utilities
import "@/styles/globals.css";   // Your global styles
import { ThemeProvider } from "next-themes"; // Theme provider for dark mode support
export default function Home() {
  return (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>  
    <div className="flex justify-center items-center min-h-screen">
      <LoginForm />
    </div>
  </ThemeProvider>  
  );
}
