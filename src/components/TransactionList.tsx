import type { Transaction } from "../types/transaction";
import TransactionItem from "./TransactionItem";

interface TransactionListProps {
  transactions: Transaction[];
  totalCount: number; 
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onAdd: () => void;
  onClearFilters: () => void;
}

export default function TransactionList({
  transactions,
  totalCount,
  onEdit,
  onDelete,
  onAdd,
  onClearFilters,
}: TransactionListProps) {

  if (totalCount === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
        <p className="text-lg font-semibold">No transactions yet</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
          Add your first income or expense to see your balance and spending breakdown.
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          + Add your first transaction
        </button>
      </div>
    );
  }


  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
        <p className="text-lg font-semibold">No matching transactions</p>
        <p className="mt-1 text-sm text-slate-500">
          Try a different search or clear the filters.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-200">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
