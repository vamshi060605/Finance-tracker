import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js"; // Import Session type
import "@/styles/tailwind.css"; 
import "@/styles/globals.css";  
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"  
import Link from "next/link"

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null); // ✅ Fixed typing
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);

      if (!session) {
        router.replace("/"); // Redirect to login if no session
      }
    };

    checkSession();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  const userAvatar = session?.user?.user_metadata?.avatar_url || "/default-avatar.png"; 
  const userName = session?.user?.user_metadata?.full_name || "User";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b px-4">
          {/* Left Side: Sidebar Toggle */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          </div>

          {/* Right Side: Avatar (Clickable) */}
          <Link href="/profile">
            <Avatar className="cursor-pointer hover:opacity-80 transition">
              <AvatarImage src={userAvatar} alt="User Avatar" />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
        </header>


        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
