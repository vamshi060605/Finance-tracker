// Savings page: displays savings transactions, total spent, and allows adding new expenses

"use client";

import '@/styles/globals.css';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/app-sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ExpenseForm } from "@/components/expense-form";

interface NeedsTransaction {
  // Transaction type for savings category
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: string; // Added type property to distinguish between expense and income
}

export default function Savings() {
  // State for transactions, totals, loading, and add expense dialog
  const [transactions, setTransactions] = useState<NeedsTransaction[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Refresh data after adding a new expense
  const refreshData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('category', 'savings')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });

      if (data) {
        setTransactions(data);
        
        // Calculate total income and expenses separately
        const totalIncome = data
          .filter(tx => tx.type === 'income')
          .reduce((sum, tx) => sum + tx.amount, 0);
        
        const totalExpenses = data
          .filter(tx => tx.type === 'expense')
          .reduce((sum, tx) => sum + tx.amount, 0);

        // Set the balance as income minus expenses
        setTotalSpent(totalIncome - totalExpenses);
      }
    }
  };

  useEffect(() => {
    // Fetch savings transactions and calculate totals
    const fetchNeedsTransactions = async () => {
      await refreshData();
      setLoading(false);
    };

    fetchNeedsTransactions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    // Main UI: header, summary card, transactions table, and add expense form
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
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </header>

          <main className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Savings</h1>
              <Button onClick={() => setIsAddExpenseOpen(true)}>Add Expense</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Savings Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</div>
                <p className="text-muted-foreground">Total spent on needs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Needs Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell>{tx.category}</TableCell>
                        <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                        <TableCell>{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</TableCell>
                        <TableCell className="text-right">₹{tx.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <ExpenseForm 
              category="savings"
              isOpen={isAddExpenseOpen}
              onClose={() => setIsAddExpenseOpen(false)}
              onSuccess={refreshData}
            />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
