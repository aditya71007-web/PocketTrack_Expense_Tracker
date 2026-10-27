import { useCallback, useEffect, useMemo, useState } from "react";
import ConfirmDialog from "./components/ConfirmDialog";
import ExpenseChart from "./components/ExpenseChart";
import FilterBar from "./components/FilterBar";
import Header from "./components/Header";
import SummaryCard from "./components/SummaryCard";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import type { FilterType, Transaction, TransactionInput } from "./types/transaction";
import { ALL_CATEGORIES } from "./utils/categories";
import {
  filterTransactions,
  getCategoryTotals,
  getTotals,
  sortNewestFirst,
} from "./utils/calculations";
import { downloadCsv } from "./utils/csv";
import { createId, formatINR } from "./utils/format";
import { loadTransactions, saveTransactions } from "./utils/storage";

export default function App() {

  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);
  const [message, setMessage] = useState<string | null>(null);


  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);


  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [message]);


  const totals = useMemo(() => getTotals(transactions), [transactions]);
  const categoryTotals = useMemo(() => getCategoryTotals(transactions), [transactions]);

  const visibleTransactions = useMemo(
    () =>
      sortNewestFirst(
        filterTransactions(transactions, { searchTerm, filterType, filterCategory }),
      ),
    [transactions, searchTerm, filterType, filterCategory],
  );


  const filterCategories = useMemo(() => {
    const used = transactions.map((t) => t.category);
    return Array.from(new Set([...ALL_CATEGORIES, ...used])).sort();
  }, [transactions]);

  const hasActiveFilters =
    searchTerm.trim() !== "" || filterType !== "all" || filterCategory !== "all";


  function openAddForm() {
    setMessage(null); 
    setEditingTransaction(null);
    setFormOpen(true);
  }

  function openEditForm(transaction: Transaction) {
    setMessage(null);
    setEditingTransaction(transaction);
    setFormOpen(true);
  }

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingTransaction(null);
  }, []);

  function handleSubmit(input: TransactionInput) {
    if (editingTransaction) {
    
      const id = editingTransaction.id;
      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...input, id } : t)));
      setMessage("Transaction updated.");
    } else {
      setTransactions((prev) => [{ ...input, id: createId() }, ...prev]);
      setMessage("Transaction added.");
    }
    closeForm();
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setPendingDelete(null);
    setMessage("Transaction deleted.");
  }

  function clearFilters() {
    setSearchTerm("");
    setFilterType("all");
    setFilterCategory("all");
  }

  function handleExport() {
    downloadCsv(sortNewestFirst(transactions));
    setMessage("CSV downloaded.");
  }


  return (
    <div className="min-h-screen">
      <Header onAdd={openAddForm} onExport={handleExport} canExport={transactions.length > 0} />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total balance"
            tone="balance"
            value={formatINR(totals.balance)}
            hint={totals.balance < 0 ? "You have spent more than you earned" : "Income minus expenses"}
          />
          <SummaryCard label="Total income" tone="income" value={formatINR(totals.income)} />
          <SummaryCard label="Total expenses" tone="expense" value={formatINR(totals.expenses)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
         
          <section
            aria-labelledby="transactions-heading"
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2"
          >
            <div className="flex items-baseline justify-between">
              <h2 id="transactions-heading" className="text-lg font-bold">
                Transactions
              </h2>
              <p className="text-sm text-slate-500" aria-live="polite">
                {hasActiveFilters
                  ? `${visibleTransactions.length} of ${transactions.length} shown`
                  : `${transactions.length} total`}
              </p>
            </div>

            {transactions.length > 0 && (
              <FilterBar
                searchTerm={searchTerm}
                filterType={filterType}
                filterCategory={filterCategory}
                categories={filterCategories}
                onSearchChange={setSearchTerm}
                onTypeChange={setFilterType}
                onCategoryChange={setFilterCategory}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            )}

            <TransactionList
              transactions={visibleTransactions}
              totalCount={transactions.length}
              onEdit={openEditForm}
              onDelete={setPendingDelete}
              onAdd={openAddForm}
              onClearFilters={clearFilters}
            />
          </section>

          
          <section
            aria-labelledby="chart-heading"
            className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 id="chart-heading" className="mb-4 text-lg font-bold">
              Spending by category
            </h2>
            <ExpenseChart data={categoryTotals} />
          </section>
        </div>

        <p className="pb-4 text-center text-xs text-slate-500">
          Data is stored only in this browser (localStorage). It is not synced across devices.
        </p>
      </main>

      
      {formOpen && (
        <TransactionForm
          editing={editingTransaction}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete transaction?"
          message={`“${pendingDelete.title}” (${formatINR(pendingDelete.amount)}) will be removed. This can't be undone.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      
      {message && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-lg"
        >
          {message}
        </div>
      )}
    </div>
  );
}
