import { beforeEach, describe, expect, it } from "vitest";
import type { Transaction } from "../types/transaction";
import {
  filterTransactions,
  getCategoryTotals,
  getTotals,
  sortNewestFirst,
} from "./calculations";
import { loadTransactions, saveTransactions, STORAGE_KEY } from "./storage";
import { toTransactionInput, validateForm, type FormValues } from "./validation";

const sample: Transaction[] = [
  { id: "1", title: "Salary", amount: 50000, type: "income", category: "Salary", date: "2026-10-01" },
  { id: "2", title: "Groceries", amount: 1500.5, type: "expense", category: "Food", date: "2026-10-03" },
  { id: "3", title: "Metro card", amount: 500, type: "expense", category: "Transport", date: "2026-10-05" },
  { id: "4", title: "Lunch", amount: 250, type: "expense", category: "Food", date: "2026-10-05" },
];

describe("getTotals", () => {
  it("calculates income, expenses and balance", () => {
    const t = getTotals(sample);
    expect(t.income).toBe(50000);
    expect(t.expenses).toBe(2250.5);
    expect(t.balance).toBe(47749.5);
  });

  it("returns zeros for an empty list", () => {
    expect(getTotals([])).toEqual({ income: 0, expenses: 0, balance: 0 });
  });

  it("updates after adding and deleting", () => {
    const added: Transaction[] = [
      ...sample,
      { id: "5", title: "Gift", amount: 1000, type: "income", category: "Gift", date: "2026-10-06" },
    ];
    expect(getTotals(added).balance).toBe(48749.5);
    expect(getTotals(added.filter((t) => t.id !== "2")).balance).toBe(50250);
  });
});

describe("getCategoryTotals", () => {
  it("sums expenses per category, largest first, ignoring income", () => {
    expect(getCategoryTotals(sample)).toEqual([
      { category: "Food", total: 1750.5 },
      { category: "Transport", total: 500 },
    ]);
  });
});

describe("filterTransactions", () => {
  const base = { searchTerm: "", filterType: "all" as const, filterCategory: "all" };

  it("returns everything with default filters", () => {
    expect(filterTransactions(sample, base)).toHaveLength(4);
  });

  it("filters by type", () => {
    expect(filterTransactions(sample, { ...base, filterType: "income" })).toHaveLength(1);
    expect(filterTransactions(sample, { ...base, filterType: "expense" })).toHaveLength(3);
  });

  it("searches title and category, case-insensitively", () => {
    expect(filterTransactions(sample, { ...base, searchTerm: "GROC" }).map((t) => t.id)).toEqual(["2"]);
    expect(filterTransactions(sample, { ...base, searchTerm: "food" }).map((t) => t.id)).toEqual(["2", "4"]);
  });

  it("combines search, type and category", () => {
    const result = filterTransactions(sample, {
      searchTerm: "lunch",
      filterType: "expense",
      filterCategory: "Food",
    });
    expect(result.map((t) => t.id)).toEqual(["4"]);
    expect(
      filterTransactions(sample, { searchTerm: "lunch", filterType: "income", filterCategory: "all" }),
    ).toHaveLength(0);
  });
});

describe("sortNewestFirst", () => {
  it("sorts by date descending without mutating the input", () => {
    const copy = [...sample];
    const sorted = sortNewestFirst(sample);
    expect(sorted.map((t) => t.id)).toEqual(["3", "4", "2", "1"]);
    expect(sample).toEqual(copy);
  });
});

describe("validateForm", () => {
  const valid: FormValues = {
    title: "Coffee",
    amount: "120",
    type: "expense",
    category: "Food",
    date: "2026-10-27",
  };

  it("accepts valid input", () => {
    expect(validateForm(valid)).toEqual({});
  });

  it("rejects blank title", () => {
    expect(validateForm({ ...valid, title: "   " }).title).toBeDefined();
  });

  it.each(["", "0", "-5", "abc", "Infinity"])("rejects amount %j", (amount) => {
    expect(validateForm({ ...valid, amount }).amount).toBeDefined();
  });

  it("rejects missing category and invalid dates", () => {
    expect(validateForm({ ...valid, category: "" }).category).toBeDefined();
    expect(validateForm({ ...valid, date: "" }).date).toBeDefined();
    expect(validateForm({ ...valid, date: "2026-02-31" }).date).toBeDefined();
  });

  it("converts form values to a typed transaction", () => {
    expect(toTransactionInput({ ...valid, title: "  Coffee ", amount: "120.456" })).toEqual({
      title: "Coffee",
      amount: 120.46,
      type: "expense",
      category: "Food",
      date: "2026-10-27",
    });
  });
});

describe("storage", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    globalThis.localStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
      key: () => null,
      length: 0,
    } as Storage;
  });

  it("returns [] when nothing is saved", () => {
    expect(loadTransactions()).toEqual([]);
  });

  it("round-trips transactions", () => {
    saveTransactions(sample);
    expect(loadTransactions()).toEqual(sample);
  });

  it("survives corrupt JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadTransactions()).toEqual([]);
  });

  it("drops malformed entries", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([sample[0], { id: 5 }, "x"]));
    expect(loadTransactions()).toEqual([sample[0]]);
  });
});
