// Transactions page: manage, add, and delete all user transactions

"use client";

import '@/styles/globals.css';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ThemeProvider } from "@/components/ui/themes";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/app-sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { toast } from "sonner";

interface Transaction {
  // Transaction type for the transactions table
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: 'needs' | 'wants' | 'savings';
  date: string;
  user_id: string;
}

export default function TransactionsPage() {
  // State for transactions, loading, and selected transaction
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fetch all transactions for the user
  const fetchTransactions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('date', { ascending: false });

        if (error) throw error;
        setTransactions(data || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new transaction
  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      const newTransaction = {
        description: formData.get('description') as string,
        amount: parseFloat(formData.get('amount') as string),
        type: formData.get('type') as 'income' | 'expense',
        category: formData.get('category') as 'needs' | 'wants' | 'savings',
        date: formData.get('date') as string || new Date().toISOString().split('T')[0],
        user_id: session.user.id
      };

      const { error } = await supabase
        .from('transactions')
        .insert([newTransaction]);

      if (error) throw error;
      
      await fetchTransactions();
      form.reset();

      const dialogClose = document.querySelector('[data-state="open"]') as HTMLButtonElement;
      if (dialogClose) dialogClose.click();

      toast.success('Transaction added successfully');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = async (id: number) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    // Main UI: header, add transaction dialog, and transactions table
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

          <div className="p-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>Manage your transactions</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Transaction</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Transaction</DialogTitle>
                      <DialogDescription>Add a new transaction to your account.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddTransaction} className="space-y-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Name</Label>
                        <Input id="description" name="description" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input id="amount" name="amount" type="number" step="0.01" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <select id="type" name="type" className="col-span-3 p-2 border rounded" required>
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <select id="category" name="category" className="col-span-3 p-2 border rounded" required>
                          <option value="needs">Needs</option>
                          <option value="wants">Wants</option>
                          <option value="savings">Savings</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">Date</Label>
                        <Input 
                          id="date" 
                          name="date" 
                          type="date" 
                          className="col-span-3" 
                          required
                          defaultValue={new Date().toISOString().split('T')[0]} 
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input id="description" name="description" className="col-span-3" />
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Transaction</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{transaction.type}</TableCell>
                        <TableCell className="capitalize">{transaction.category}</TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedTransaction(transaction)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteTransaction(transaction.id)}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
