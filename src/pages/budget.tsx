"use client";
import { ThemeProvider } from "@/components/ui/themes"
import '@/styles/globals.css';
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/app-sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
// Import other UI components as needed

const userAvatar = "/avatars/001.png"; // Replace with dynamic value (e.g., from global state or session)
const userName = "John Doe"; // Replace with dynamic value

export default function budget() {
  const [state, setState] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Add your fetch logic here
    };
    fetchData();
  }, []);

  const handleAction = async () => {
    // Handle specific action here
  };

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
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              
            </Card>

            <Card>

            </Card>
            <Card>
              
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ThemeProvider>
  );
}
