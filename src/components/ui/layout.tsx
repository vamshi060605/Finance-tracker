import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "next-themes"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex">
        {/* Sidebar component should be included inside SidebarProvider */}
        <main className="flex-1 p-4 lg:ml-64">{children}</main>
      </div>
    </SidebarProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>
}

export default Layout
