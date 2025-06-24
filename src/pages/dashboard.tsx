// Dashboard page: shows user summary, charts, and recent transactions

"use client";
import { useEffect, useState, useMemo } from "react";
import { ThemeProvider } from "next-themes";
import { AuthGuard } from "@/components/auth-guard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Tooltip } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@radix-ui/react-separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { supabase } from "@/lib/supabase";
import "@/styles/tailwind.css";
import "@/styles/globals.css";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface MonthlyAllocation {
  category: string;
  amount: number;
}

interface Profile {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyExpenses: number;
  savingsProgress: number;
}

export default function Dashboard() {
  // State and data fetching logic
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    transactions: Transaction[];
    allocation: MonthlyAllocation | null;
    profile: Profile | null;
  }>({
    transactions: [],
    allocation: null,
    profile: null
  });

  useEffect(() => {
    // Fetch dashboard data on mount
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [transactionsRes, allocationRes, profileRes] = await Promise.all([
          supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false })
            .limit(5),
          supabase
            .from('monthly_allocations')
            .select('*')
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
        ]);

        setData({
          transactions: transactionsRes.data || [],
          allocation: allocationRes.data,
          profile: profileRes.data
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    data.transactions.forEach((transaction) => {
      const category = transaction.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  }, [data.transactions]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center">{error}</div>;

  const totalAmount = data.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    // Main dashboard UI: header, summary cards, charts, and recent transactions
    <AuthGuard>
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
                <AvatarImage src={data.profile?.avatar || "/avatars/001.png"} alt={data.profile?.name || "User"} />
                <AvatarFallback>{data.profile?.name?.[0] ?? 'U'}</AvatarFallback>
              </Avatar>
            </header>

            <main className="flex-1 overflow-auto">
              <div className="container mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{(data.profile?.balance || 0).toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        Income - Expenses
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">₹{(data.profile?.totalIncome || 0).toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        All time income
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">₹{(data.profile?.totalExpenses || 0).toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        All time expenses
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{(data.profile?.monthlyExpenses || 0).toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        Last 30 days
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Expense Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PieChart width={400} height={300}>
                        <Pie 
                          data={chartData} 
                          dataKey="value" 
                          nameKey="name" 
                          label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                        />
                        <Tooltip />
                      </PieChart>
                    </CardContent>
                  </Card>

                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Savings Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4">
                        <div className="text-3xl font-bold">₹{(data.profile?.savingsProgress || 0).toLocaleString()}</div>
                        <div className="space-y-2">
                          {chartData.map(category => (
                            <div key={category.name} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0ea5e9' }} />
                              <span className="flex-1">{category.name}</span>
                              <span className="font-medium">₹{category.value.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-full">
                    <CardHeader>
                      <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>{transaction.category || '-'}</TableCell>
                              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">₹{transaction.amount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell colSpan={3}>Total Expenses</TableCell>
                            <TableCell className="text-right">₹{totalAmount}</TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </AuthGuard>
  );
}
