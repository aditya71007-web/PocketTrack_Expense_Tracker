import type { TransactionInput } from "../types/transaction";

export interface FormValues {
  title: string;
  amount: string; 
  type: "income" | "expense";
  category: string;
  date: string;
}

export type FormErrors = Partial<Record<keyof FormValues, string>>;

function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
  );
}

export function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.title.trim()) {
    errors.title = "Please enter a title.";
  } else if (values.title.trim().length > 60) {
    errors.title = "Title must be 60 characters or fewer.";
  }

  const amountText = values.amount.trim();
  const amount = Number(amountText);
  if (!amountText) {
    errors.amount = "Please enter an amount.";
  } else if (!Number.isFinite(amount)) {
    errors.amount = "Amount must be a valid number.";
  } else if (amount <= 0) {
    errors.amount = "Amount must be greater than zero.";
  } else if (amount > 1_000_000_000) {
    errors.amount = "Amount is too large.";
  }

  if (!values.category.trim()) {
    errors.category = "Please choose a category.";
  }

  if (!values.date) {
    errors.date = "Please pick a date.";
  } else if (!isValidISODate(values.date)) {
    errors.date = "Please enter a valid date.";
  }

  return errors;
}


export function toTransactionInput(values: FormValues): TransactionInput {
  return {
    title: values.title.trim(),
    amount: Math.round(Number(values.amount.trim()) * 100) / 100,
    type: values.type,
    category: values.category.trim(),
    date: values.date,
  };
}
