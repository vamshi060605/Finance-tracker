"use client";

import '@/styles/globals.css';
import { useEffect, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AppSidebar } from '@/components/app-sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { ThemeProvider } from '@/components/ui/themes';

const userAvatar = "/avatars/001.png";
const userName = "John Doe";

type Transaction = {
  id: number;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  description?: string;
};

export default function TransactionsPage() {
  const dummyData: Transaction[] = [
    { id: 1, name: "Groceries", amount: 120, type: "expense", date: "2025-04-22" ,description: "Weekly grocery shopping at local market",},
    { id: 2, name: "Salary", amount: 5000, type: "income", date: "2025-04-20" ,description: "Salary for the month",},
  ];

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  useEffect(() => {
    setTransactions(dummyData);
  }, []);

  const columns: ColumnDef<Transaction>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'amount', header: 'Amount' },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'date', header: 'Date' },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: { row: Row<Transaction> }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => {
                setSelectedTransaction(row.original);
                setViewSheetOpen(true);
              }}
            >
              View Transaction
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedTransaction(row.original);
                setEditSheetOpen(true);
              }}
            >
              Modify Transaction
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log("Delete", row.original);
              }}
              className="text-red-600 focus:text-red-700"
            >
              Delete Transaction
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Last 20 transactions</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map(row => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Transaction</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription>Fill in the details to log a new transaction.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <input  placeholder="Groceries,Salary,Shopping" id="name" type="text" className="col-span-3 border rounded px-3 py-2 w-full" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">Amount</Label>
                    <input placeholder="Amount"id="amount" type="number" className="col-span-3 border rounded px-3 py-2 w-full" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                    <select id="category" className="col-span-3 border rounded px-3 py-2 w-full">
                      <option value="">Select</option>
                      <option value="food">Food</option>
                      <option value="transport">Transport</option>
                      <option value="salary">Salary</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Type</Label>
                    <div className="col-span-3 flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="type" value="income" defaultChecked />
                        <span>Income</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="type" value="expense" />
                        <span>Expense</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <input id="date" type="date" className="col-span-3 border rounded px-3 py-2 w-full"
                      defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">Description</Label>
                    <textarea id="notes" rows={3} className="col-span-3 border rounded px-3 py-2 w-full" placeholder="Add any notes here..."></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button onClick={() => console.log("Save clicked")}>Save</Button>
                  <Button variant="ghost">Cancel</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        {/* View Transaction Sheet */}
        <Sheet open={viewSheetOpen} onOpenChange={setViewSheetOpen}>
          <SheetContent className="p-4">
            <SheetHeader>
              <SheetTitle>Transaction Details</SheetTitle>
              <SheetDescription>View details of the transaction.</SheetDescription>
            </SheetHeader>
            <SheetDescription>
            {selectedTransaction && (
              <div className="space-y-2 mt-4">
                <p><strong>Name:</strong> {selectedTransaction.name}</p>
                <p><strong>Amount:</strong> ${selectedTransaction.amount}</p>
                <p><strong>Type:</strong> {selectedTransaction.type}</p>
                <p><strong>Date:</strong> {selectedTransaction.date}</p>
                <p><strong>Description:</strong> {selectedTransaction.description || "No description provided."}</p>
              </div>
            )}
            </SheetDescription>
          </SheetContent>
        </Sheet>

        {/* Modify Transaction Sheet */}
        <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
          <SheetContent className="p-4">
            <SheetHeader>
              <SheetTitle>Edit Transaction</SheetTitle>
              <SheetDescription>Make changes to the transaction.</SheetDescription>
            </SheetHeader>
            {selectedTransaction && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Name</Label>
                  <input
                    type="text"
                    defaultValue={selectedTransaction.name}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <Label>Amount</Label>
                  <input
                    type="number"
                    defaultValue={selectedTransaction.amount}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <input
                    type="date"
                    defaultValue={selectedTransaction.date}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <textarea
                    defaultValue={selectedTransaction.description}
                    rows={3}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      // TODO: update transaction logic
                      console.log("Save updated transaction");
                    }}
                  >
                    Save
                  </Button>
                  <Button variant="ghost" onClick={() => setEditSheetOpen(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
    </ThemeProvider>
  );
}
