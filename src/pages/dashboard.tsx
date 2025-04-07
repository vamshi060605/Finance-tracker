import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import "@/styles/tailwind.css";
import "@/styles/globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  // Sample chart data for Pie Chart (static for now)
  const chartData = [
    { browser: "Chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "Safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "Firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "Edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "Other", visitors: 90, fill: "var(--color-other)" },
  ];

  // Sample recent transactions table data (replace with fetched data later)
  const invoices = [
    { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
    { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
    { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
    { invoice: "INV004", paymentStatus: "Paid", totalAmount: "$450.00", paymentMethod: "Credit Card" },
    { invoice: "INV005", paymentStatus: "Paid", totalAmount: "$550.00", paymentMethod: "PayPal" },
    { invoice: "INV006", paymentStatus: "Pending", totalAmount: "$200.00", paymentMethod: "Bank Transfer" },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          </div>

          <Link href="/profile">
            <Avatar className="cursor-pointer hover:opacity-80 transition">
              <AvatarImage src={userAvatar} alt="User Avatar" />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Pie Chart Card */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Pie Chart - Allocation of income</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart width={250} height={250}>
                  <Pie data={chartData} dataKey="visitors" nameKey="browser" fill="#8884d8" />
                </PieChart>
              </CardContent>
            </Card>

            {/* Placeholder for another graph or card */}
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>

          {/* Recent Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                      <TableCell>{invoice.invoice}</TableCell>
                      <TableCell>{invoice.paymentStatus}</TableCell>
                      <TableCell>{invoice.paymentMethod}</TableCell>
                      <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>

          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
