import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import "@/styles/globals.css";
import "@/styles/tailwind.css";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TemplatePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);

      if (!session) {
        router.replace("/");
      }
    };

    checkSession();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  const userAvatar = "/avatars/001.png";
  const userName = "John Doe";

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            </div>

            <Avatar className="cursor-pointer hover:opacity-80 transition">
              <AvatarImage src={userAvatar} alt="User Avatar" />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* 👇🏽 Replace this section with your custom content */}
            <div className="bg-muted/50 h-96 rounded-xl flex items-center justify-center text-muted-foreground text-lg">
              Your content goes here
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
