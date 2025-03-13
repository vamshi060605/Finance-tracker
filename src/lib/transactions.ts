import { supabase } from "./supabase";

//getting transactions from the database
export async function getTransactions() {
    const { data, error } = await supabase.from("transactions").select("*");
  
    if (error) {
      console.error("Error fetching transactions:", error.message);
      return [];
    }

    return data;
  }
  
  //Adding a transaction to the database
export async function addTransaction(user_id: string, amount: number, category: string) {
    const { data, error } = await supabase.from("transactions").insert([
      { user_id, amount, category }
    ]);
  
    if (error) {
      console.error("Error inserting transaction:", error.message);
      return null;
    }
  
    return data;
  }
  
  //Updating a transaction in the database
export async function updateTransaction(id: string, amount: number) {
    const { data, error } = await supabase
      .from("transactions")
      .update({ amount })
      .eq("id", id);
  
    if (error) {
      console.error("Error updating transaction:", error.message);
      return null;
    }
  
    return data;
  }
  
  //Deleting a transaction from the database
export async function deleteTransaction(id: string) {
    const { data, error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);
  
    if (error) {
      console.error("Error deleting transaction:", error.message);
      return null;
    }
  
    return data;
  }
  