import { useEffect, useState } from "react";
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from "../lib/transactions";
import styles from "../styles/transactions.module.css";

type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  category: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  async function handleAddTransaction() {
    try {
      await addTransaction("user123", amount, category);
      fetchTransactions(); // Refresh transactions
      setAmount(0);
      setCategory("");
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  }

  async function handleDeleteTransaction(id: string) {
    try {
      await deleteTransaction(id);
      fetchTransactions(); // Refresh transactions
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Transactions</h1>
      
      {/* Input for new transaction */}
      <div className={styles.form}>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Amount" />
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
        <button onClick={handleAddTransaction}>Add Transaction</button>
      </div>

      {/* Transaction List */}
      <ul className={styles.transactionList}>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.category}: ${t.amount}
            <button onClick={() => handleDeleteTransaction(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
