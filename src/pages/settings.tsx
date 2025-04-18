"use client";
import '@/styles/globals.css';
import { supabase } from "@/lib/supabase"; // adjust path if needed
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { avatarOptions } from "@/components/ui/avatar";
import { getCurrentUser, signOut } from "@/lib/auth";
import { getUserProfile } from "@/lib/profile";

export default function Settings() {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [theme, setTheme] = useState("light");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]?.url || "");
  const [avatar, setAvatar] = useState(selectedAvatar);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        const profile = await getUserProfile(user.id);
        if (profile) {
          setName(profile.name || "");
          setCurrency(profile.currency || "USD");

        }
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    const user = await getCurrentUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({
          name,
          avatar: selectedAvatar,
          currency,
          theme,
        })
        .eq("id", user.id);

      setAvatar(selectedAvatar); // reflect in UI
      setIsDialogOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/"; 
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          </div>
        </header>

        <div className="flex flex-col items-center p-6 gap-4">
          <Card className="w-full max-w-md text-center py-8 px-4 flex flex-col items-center gap-4">
            <img
              src={avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <h2 className="text-xl font-semibold">{name || 'User'}</h2>
          </Card>

          <Card className="w-full max-w-md py-6 px-4 space-y-6">
            <div className="flex flex-col gap-1">
              <Label>Preferred Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-split">Auto-Split Expenses</Label>
              {/* Future toggle */}
            </div>
          </Card>

          {/* Profile Editing Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Select Avatar</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Select Avatar</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={selectedAvatar}
                      onValueChange={(val) => setSelectedAvatar(val)}
                    >
                      {avatarOptions.map((av) => (
                        <DropdownMenuRadioItem key={av.url} value={av.url}>
                          {av.name}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button onClick={handleSave}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-4 flex justify-end pr-4">
          <Button onClick={() => setIsDialogOpen(true)}>Edit Profile</Button>
        </div>
        <div className="mt-2 flex justify-end pr-4">
            <Button variant="destructive" onClick={handleLogout}>
                Logout
            </Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}