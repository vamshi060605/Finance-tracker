import * as React from "react";
import { LoginForm } from "@/components/ui/login-form";
import "@/styles/tailwind.css"; // Tailwind utilities
import "@/styles/globals.css";   // Your global styles

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoginForm />
    </div>
  );
}
