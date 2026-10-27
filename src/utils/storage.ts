import type { Transaction } from "../types/transaction";

export const STORAGE_KEY = "pockettrack-transactions";

function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.title === "string" &&
    typeof v.amount === "number" &&
    Number.isFinite(v.amount) &&
    (v.type === "income" || v.type === "expense") &&
    typeof v.category === "string" &&
    typeof v.date === "string"
  );
}


export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isTransaction) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(items: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
}
