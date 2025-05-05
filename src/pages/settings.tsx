"use client";
import '@/styles/globals.css';
import { supabase } from "@/lib/supabase"; // adjust path if needed
import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage, avatarOptions } from "@/components/ui/avatar";
import { getCurrentUser, signOut } from "@/lib/auth";
import { getUserProfile, updateUserProfile, Profile } from "@/lib/profile";
import { useTheme, ThemeProvider } from "next-themes";
import { AppSidebar } from '@/components/app-sidebar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from 'next/router';
import { AuthGuard } from '@/components/auth-guard';
import { toast } from "sonner";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <Settings />
    </AuthGuard>
  );
}

function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]?.url || "");
  const [avatar, setAvatar] = useState(selectedAvatar);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        if (user) {
          const profile = await getUserProfile(user.id);
          if (profile) {
            setName(profile.full_name || "");
            setCurrency(profile.preferred_currency || "INR");
            setAvatar(profile.avatar || avatarOptions[0].url);
            setSelectedAvatar(profile.avatar || avatarOptions[0].url);
          }
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };

  const handleSave = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        const updates = {
          full_name: name,
          avatar: selectedAvatar,
          preferred_currency: currency
        };

        await updateUserProfile(user.id, updates);
        setAvatar(selectedAvatar);
        setProfile((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            ...updates
          };
        });
        setIsDialogOpen(false);
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
                <AvatarImage src={avatar} alt="User Avatar" />
                <AvatarFallback>{name ? name.charAt(0) : 'U'}</AvatarFallback>
              </Avatar>
              
            </header>

            <div className="container mx-auto max-w-2xl p-6 space-y-6">
              <Card className="text-center py-8 px-4 flex flex-col items-center gap-4">
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full object-cover border"
                />
                <h2 className="text-xl font-semibold">{name || 'User'}</h2>
              </Card>

              <Card className="py-6 px-4 space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-toggle">Theme</Label>
                  <Switch
                    id="theme-toggle"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </Card>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your profile information and preferences.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        id="currency"
                        type="text"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        placeholder="Currency (e.g., USD, INR)"
                      />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <img 
                            src={selectedAvatar} 
                            alt="Selected Avatar" 
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          Select Avatar
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Select Avatar</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="grid grid-cols-4 gap-2 p-2">
                          {avatarOptions.map((av) => (
                            <img
                              key={av.url}
                              src={av.url}
                              alt={av.name}
                              className={`w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-primary ${
                                selectedAvatar === av.url ? "ring-2 ring-primary" : ""
                              }`}
                              onClick={() => handleAvatarSelect(av.url)}
                            />
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button type="button" onClick={handleSave} className="w-full">Save</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex flex-col gap-2">
                <Button onClick={() => setIsDialogOpen(true)} className="w-full">
                  Edit Profile
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">Logout</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will be redirected to the login page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
    </ThemeProvider>
  );
}