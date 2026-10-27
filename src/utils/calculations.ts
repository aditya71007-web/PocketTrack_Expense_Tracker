import type {
  FilterType,
  Transaction,
} from "../types/transaction";

export function getTotals(transactions: Transaction[]) {
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    income,
    expenses,
    balance: income - expenses,
  };
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export function getCategoryTotals(transactions: Transaction[]): CategoryTotal[] {
  const map = new Map<string, number>();
  for (const item of transactions) {
    if (item.type !== "expense") continue;
    map.set(item.category, (map.get(item.category) ?? 0) + item.amount);
  }
  return Array.from(map, ([category, total]) => ({ category, total })).sort(
    (a, b) => b.total - a.total,
  );
}

export interface Filters {
  searchTerm: string;
  filterType: FilterType;
  filterCategory: string; 
}


export function filterTransactions(
  transactions: Transaction[],
  { searchTerm, filterType, filterCategory }: Filters,
): Transaction[] {
  const term = searchTerm.trim().toLowerCase();
  return transactions.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (filterCategory !== "all" && item.category !== filterCategory) return false;
    if (term) {
      const haystack = `${item.title} ${item.category}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });
}


export function sortNewestFirst(transactions: Transaction[]): Transaction[] {
  return transactions
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      if (a.item.date !== b.item.date) {
        return a.item.date < b.item.date ? 1 : -1;
      }
      return a.index - b.index;
    })
    .map(({ item }) => item);
}
