import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  category_id: string;
  type: string;
  date: string;
  note: string;
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    type: "income",
    category_id: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [userId, setUserId] = useState<string | null>(null); // Store authenticated user's ID

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (userData?.user) {
        setUserId(userData.user.id); // Set the authenticated user's ID dynamically
      } else if (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId(); // Fetch user ID on component mount
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId); // Fetch transactions only for the current user

        if (error) {
          console.error("Error fetching transactions:", error);
        } else if (data) {
          setTransactions(data);
        }
      }
    };

    fetchTransactions();
  }, [userId]); // Fetch transactions after userId is set

  const handleAddTransaction = async () => {
    if (!userId) {
      console.error("User ID not found. Cannot add transaction.");
      return;
    }

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: userId, // Insert the dynamic user_id
          amount: parseFloat(newTransaction.amount),
          category_id: newTransaction.category_id,
          type: newTransaction.type,
          date: newTransaction.date,
          note: newTransaction.note,
        },
      ])
      .select(); // Fetch and return the newly inserted data

    if (error) {
      console.error("Error adding transaction:", error);
    } else if (data) {
      setTransactions((prev) => [data[0], ...prev]);
      setNewTransaction({
        amount: "",
        type: "income",
        category_id: "",
        date: new Date().toISOString().split("T")[0],
        note: "",
      });
    }
  };

  return (
    <div>
      <h1>Transactions</h1>

      {transactions.length === 0 ? (
        <p>No transactions found. Add your first transaction below!</p>
      ) : (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              {transaction.type}: ${transaction.amount} – {transaction.note}
            </li>
          ))}
        </ul>
      )}

      <div>
        <h2>Add Transaction</h2>
        <input
          type="text"
          placeholder="Amount"
          value={newTransaction.amount}
          onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
        />
        <select
          value={newTransaction.type}
          onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Category ID"
          value={newTransaction.category_id}
          onChange={(e) => setNewTransaction({ ...newTransaction, category_id: e.target.value })}
        />
        <input
          type="date"
          value={newTransaction.date}
          onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Note"
          value={newTransaction.note}
          onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
        />
        <button onClick={handleAddTransaction}>Add Transaction</button>
      </div>
    </div>
  );
};

export default TransactionsPage;
