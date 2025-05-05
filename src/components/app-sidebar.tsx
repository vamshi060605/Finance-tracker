import * as React from "react"
import { signOut } from "@/lib/auth" // Changed from @/lib/hooks/auth
import { getUserProfile } from "@/lib/profile"
import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { supabase } from "@/lib/supabase"
import { title } from "process"
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
} from "@/components/ui/alert-dialog"

const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {title: "Dashboard ",url: "/dashboard", isActive: false},
        {title: "Transactions",url: "/transactions", isActive: false},
      ],
    },
    {
      title: "Budgeting",
      url: "#",
      items: [
        {title: "Budget",url: "/budget", isActive: false},
        {title: "Needs",url: "/needs", isActive: false},
        {title: "Wants",url: "/wants", isActive: false},
        {title: "savings/debt/investment",url: "/savings", isActive: false},
      ],
    },
    {
      title: "Settings",
      url: "#",
      items: [
        {title: "Analytics",url: "/analytics", isActive: false},
        {title: "Settings",url: "/settings", isActive: false},
      ],
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        {/* Footer Section */}
        <div className="mt-auto border-t px-4 py-3 text-sm text-muted-foreground">
          <div className="space-y-2">
            <a href="/help" className="block hover:underline">
              Help
            </a>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="block w-full text-left text-red-600 hover:underline"
                >
                  Logout
                </button>
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
                  <AlertDialogAction onClick={signOut}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
