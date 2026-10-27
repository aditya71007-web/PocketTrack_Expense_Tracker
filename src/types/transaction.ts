export type TransactionType = "income" | "expense";

export type FilterType = "all" | TransactionType;

export interface Transaction {
  id: string;
  title: string;
  amount: number; 
  type: TransactionType;
  category: string;
  date: string; 
}


export type TransactionInput = Omit<Transaction, "id">;
