// Help page: displays FAQs and support information

"use client";

import '@/styles/globals.css';
import { ThemeProvider } from "@/components/ui/themes";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/app-sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const userAvatar = "/avatars/001.png";
const userName = "John Doe";

export default function Help() {
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

          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
                {/* Add your help content here */}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
