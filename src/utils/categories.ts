import type { TransactionType } from "../types/transaction";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Rent",
  "Bills",
  "Shopping",
  "Health",
  "Entertainment",
  "Education",
  "Other",
];

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Allowance",
  "Gift",
  "Investment",
  "Other",
];

export function categoriesFor(type: TransactionType): string[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export const ALL_CATEGORIES = Array.from(
  new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]),
).sort();
