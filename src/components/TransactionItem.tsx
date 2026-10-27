import type { Transaction } from "../types/transaction";
import { formatDate, formatINR } from "../utils/format";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const isIncome = transaction.type === "income";

  return (
    <li
      data-testid="transaction-item"
      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold ${
            isIncome ? "bg-teal-100 text-teal-700" : "bg-orange-100 text-orange-700"
          }`}
        >
          {isIncome ? "↑" : "↓"}
        </span>
        <div className="min-w-0">
          <p className="break-words font-medium">{transaction.title}</p>
          <p className="text-sm text-slate-500">
            {transaction.category} · {formatDate(transaction.date)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <p className={`font-semibold ${isIncome ? "text-teal-700" : "text-orange-700"}`}>
          <span className="sr-only">{isIncome ? "Income: " : "Expense: "}</span>
          {isIncome ? "+" : "−"}
          {formatINR(transaction.amount)}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(transaction)}
            aria-label={`Edit ${transaction.title}`}
            className="rounded-md px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(transaction)}
            aria-label={`Delete ${transaction.title}`}
            className="rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
