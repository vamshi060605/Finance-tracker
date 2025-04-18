import * as React from "react"
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

const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {title: "Dashboard ",url: "/dashboard", isActive: false},
        {title: "Transactions",url: "/transactions", isActive: false},
        {title: "Budget",url: "/budget", isActive: false},
        {title: "Savings Goals",url: "/savings-goals", isActive: false},
        {title: "Investment Tracking",url: "/investment-tracking", isActive: false},
        {title: "Expense Forecasting",url: "/expense-forecasting", isActive: false},
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
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
