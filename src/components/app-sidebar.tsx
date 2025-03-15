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

const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {title: "Dashboard ",url: "/dashboard",},
        {title: "Transactions",url: "/transactions",},
        {title: "Budget",url: "/budget",},
        {title: "Savings Goals",url: "/savings-goals",},
        {title: "Investment Tracking",url: "/investment-tracking",},
        {title: "Expense Forecasting",url: "/expense-forecasting",},
        {title: "Settings",url: "/settings",},
      ],
    },
    {
      title: "Building Your Application",
      url: "#",
      items: [
        {title: "Routing",url: "#",},
        {title: "Data Fetching",url: "#",isActive: true,}
      ],
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{ name: string; avatar_url: string } | null>(null)
  
    React.useEffect(() => {
      async function fetchProfile() {
        const profile = await getUserProfile() // Fetch user data from Supabase
        setUser(profile)
      }
      fetchProfile()
    }, [])
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
