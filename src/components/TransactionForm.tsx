import { useEffect, useRef, useState } from "react";
import type { Transaction, TransactionInput, TransactionType } from "../types/transaction";
import { categoriesFor } from "../utils/categories";
import { todayISO } from "../utils/format";
import {
  toTransactionInput,
  validateForm,
  type FormErrors,
  type FormValues,
} from "../utils/validation";

interface TransactionFormProps {

  editing: Transaction | null;
  onSubmit: (input: TransactionInput) => void;
  onCancel: () => void;
}

function initialValues(editing: Transaction | null): FormValues {
  if (editing) {
    return {
      title: editing.title,
      amount: String(editing.amount),
      type: editing.type,
      category: editing.category,
      date: editing.date,
    };
  }
  return { title: "", amount: "", type: "expense", category: "", date: todayISO() };
}

const inputClass =
  "w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2";

function fieldClass(hasError: boolean) {
  return `${inputClass} ${
    hasError
      ? "border-red-500 focus:ring-red-500/30"
      : "border-slate-300 focus:border-teal-600 focus:ring-teal-600/30"
  }`;
}

export default function TransactionForm({ editing, onSubmit, onCancel }: TransactionFormProps) {
  const [values, setValues] = useState<FormValues>(() => initialValues(editing));
  const [errors, setErrors] = useState<FormErrors>({});
  const titleRef = useRef<HTMLInputElement>(null);

  // Focus the first field and let Escape close the dialog.
  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const categories = categoriesFor(values.type);
  // When editing, keep an existing custom category selectable.
  const categoryOptions =
    values.category && !categories.includes(values.category)
      ? [values.category, ...categories]
      : categories;

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear the error for a field as soon as the user edits it.
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function changeType(type: TransactionType) {
    setValues((prev) => ({
      ...prev,
      type,
      // Reset the category if it doesn't exist for the new type.
      category: categoriesFor(type).includes(prev.category) ? prev.category : "",
    }));
    setErrors((prev) => ({ ...prev, type: undefined, category: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateForm(values);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    onSubmit(toTransactionInput(values));
  }

  const isEditing = editing !== null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
        className="max-h-[95vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="form-title" className="text-lg font-bold">
            {isEditing ? "Edit transaction" : "Add transaction"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close form"
            className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <fieldset>
            <legend className="mb-1 block text-sm font-medium text-slate-700">Type</legend>
            <div className="grid grid-cols-2 gap-2">
              {(["expense", "income"] as const).map((type) => (
                <label
                  key={type}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-600 ${
                    values.type === type
                      ? type === "income"
                        ? "border-teal-600 bg-teal-50 text-teal-800"
                        : "border-orange-600 bg-orange-50 text-orange-800"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={values.type === type}
                    onChange={() => changeType(type)}
                    className="sr-only"
                  />
                  <span aria-hidden="true">{type === "income" ? "↑" : "↓"}</span>
                  {type === "income" ? "Income" : "Expense"}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              id="title"
              ref={titleRef}
              type="text"
              value={values.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Groceries"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
              className={fieldClass(Boolean(errors.title))}
            />
            {errors.title && (
              <p id="title-error" role="alert" className="mt-1 text-xs text-red-600">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="mb-1 block text-sm font-medium text-slate-700">
              Amount (₹)
            </label>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={values.amount}
              onChange={(e) => update("amount", e.target.value)}
              placeholder="0.00"
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? "amount-error" : undefined}
              className={fieldClass(Boolean(errors.amount))}
            />
            {errors.amount && (
              <p id="amount-error" role="alert" className="mt-1 text-xs text-red-600">
                {errors.amount}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                id="category"
                value={values.category}
                onChange={(e) => update("category", e.target.value)}
                aria-invalid={Boolean(errors.category)}
                aria-describedby={errors.category ? "category-error" : undefined}
                className={fieldClass(Boolean(errors.category))}
              >
                <option value="">Select…</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p id="category-error" role="alert" className="mt-1 text-xs text-red-600">
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="date" className="mb-1 block text-sm font-medium text-slate-700">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={values.date}
                onChange={(e) => update("date", e.target.value)}
                aria-invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? "date-error" : undefined}
                className={fieldClass(Boolean(errors.date))}
              />
              {errors.date && (
                <p id="date-error" role="alert" className="mt-1 text-xs text-red-600">
                  {errors.date}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              {isEditing ? "Save changes" : "Add transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
