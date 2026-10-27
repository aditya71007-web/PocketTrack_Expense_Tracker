import type { Transaction } from "../types/transaction";

function escapeCell(value: string): string {
  
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function transactionsToCsv(transactions: Transaction[]): string {
  const header = ["Date", "Title", "Type", "Category", "Amount"];
  const rows = transactions.map((t) =>
    [t.date, t.title, t.type, t.category, t.amount.toFixed(2)].map(escapeCell).join(","),
  );
  return [header.join(","), ...rows].join("\r\n");
}

export function downloadCsv(transactions: Transaction[], filename = "pockettrack.csv") {
  const blob = new Blob([transactionsToCsv(transactions)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
