"use client";
import { ThemeProvider } from "@/components/ui/themes"
import '@/styles/globals.css';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/app-sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: 'needs' | 'wants' | 'savings';
  user_id: string;
}

const userAvatar = "/avatars/001.png";
const userName = "John Doe";

export default function Budget() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Budget states
  const [needsBudget, setNeedsBudget] = useState(0);
  const [wantsBudget, setWantsBudget] = useState(0);
  const [savingsBudget, setSavingsBudget] = useState(0);
  
  // Spent amounts
  const [needsSpent, setNeedsSpent] = useState(0);
  const [wantsSpent, setWantsSpent] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  
  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchBudgetData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        
        // Get current month's allocation
        const { data: allocation } = await supabase
          .from('monthly_allocations')
          .select('*')
          .eq('user_id', session.user.id)
          .gte('created_at', firstDayOfMonth.toISOString())
          .single();

        if (allocation) {
          setNeedsBudget(allocation.needs_budget);
          setWantsBudget(allocation.wants_budget);
          setSavingsBudget(allocation.savings_budget);
        }

        // Get current month's transactions
        const { data: transactionData } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', session.user.id)
          .gte('date', firstDayOfMonth.toISOString())
          .order('date', { ascending: false });

        if (transactionData) {
          setTransactions(transactionData);
          
          // Calculate spent amounts
          const needs = transactionData.filter(tx => tx.category === 'needs');
          const wants = transactionData.filter(tx => tx.category === 'wants');
          const savings = transactionData.filter(tx => tx.category === 'savings');

          setNeedsSpent(needs.reduce((sum, tx) => sum + tx.amount, 0));
          setWantsSpent(wants.reduce((sum, tx) => sum + tx.amount, 0));
          setSavingsBalance(savings.reduce((sum, tx) => sum + tx.amount, 0));
        }
      }

      setLoading(false);
    };

    fetchBudgetData();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

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

            <div className="container mx-auto p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Needs Budget Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Budget</span>
                        <span className="font-semibold">₹{needsBudget.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Spent</span>
                        <span className="font-semibold">₹{needsSpent.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining</span>
                        <span className="font-semibold">₹{(needsBudget - needsSpent).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent>
                    <div className="space-y-2">
                      {transactions.filter(tx => tx.category === 'needs').slice(0, 5).map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center">
                          <span>{tx.description}</span>
                          <span className="font-semibold">₹{tx.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Wants Budget Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Budget</span>
                        <span className="font-semibold">₹{wantsBudget.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Spent</span>
                        <span className="font-semibold">₹{wantsSpent.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining</span>
                        <span className="font-semibold">₹{(wantsBudget - wantsSpent).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent>
                    <div className="space-y-2">
                      {transactions.filter(tx => tx.category === 'wants').slice(0, 5).map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center">
                          <span>{tx.description}</span>
                          <span className="font-semibold">₹{tx.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              
                <Card>
                  <CardHeader>
                    <CardTitle>Savings Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Monthly Target</span>
                        <span className="font-semibold">₹{savingsBudget.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Balance</span>
                        <span className="font-semibold">₹{savingsBalance.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardContent>
                    <div className="space-y-2">
                      {transactions.filter(tx => tx.category === 'savings').slice(0, 5).map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center">
                          <span>{tx.description}</span>
                          <span className="font-semibold">₹{tx.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
    </ThemeProvider>
  );
}
