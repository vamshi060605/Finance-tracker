import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { transactionSchema, type TransactionInput } from "@/lib/validation";
import { handleError } from "@/lib/errors";
import { z } from "zod";

interface ExpenseFormProps {
  category: 'needs' | 'wants' | 'savings';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExpenseForm({ category, isOpen, onClose, onSuccess }: ExpenseFormProps) {
  const [expense, setExpense] = useState<TransactionInput>({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    category: category as 'needs' | 'wants' | 'savings'
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TransactionInput, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = transactionSchema.parse(expense);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { error } = await supabase
        .from('transactions')
        .insert([{
          description: validated.description,
          amount: Number(validated.amount),
          type: validated.type,
          category: validated.category,
          date: validated.date,
          user_id: session.user.id
        }]);

      if (error) throw error;
      
      toast.success("Expense added successfully");
      onSuccess();
      onClose();
      
      setExpense({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category: category as 'needs' | 'wants' | 'savings'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors);
        return;
      }
      const { message } = handleError(error);
      toast.error(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New {category.charAt(0).toUpperCase() + category.slice(1)} Expense</DialogTitle>
          <DialogDescription>Enter the expense details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Name</Label>
              <input
                id="description"
                value={expense.description}
                onChange={(e) => setExpense({...expense, description: e.target.value})}
                className="col-span-3 border rounded px-3 py-2"
                required
              />
              {errors.description && <p className="text-red-500 text-sm col-span-4">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount (₹)</Label>
              <input
                id="amount"
                type="number"
                value={expense.amount}
                onChange={(e) => setExpense({...expense, amount: e.target.value})}
                className="col-span-3 border rounded px-3 py-2"
                required
              />
              {errors.amount && <p className="text-red-500 text-sm col-span-4">{errors.amount}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Date</Label>
              <input
                id="date"
                type="date"
                value={expense.date}
                onChange={(e) => setExpense({...expense, date: e.target.value})}
                className="col-span-3 border rounded px-3 py-2"
                required
              />
              {errors.date && <p className="text-red-500 text-sm col-span-4">{errors.date}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
