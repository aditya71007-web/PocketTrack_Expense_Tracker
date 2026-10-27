import type { CategoryTotal } from "../utils/calculations";
import { formatINR } from "../utils/format";

interface ExpenseChartProps {
  data: CategoryTotal[];
}

export default function ExpenseChart({ data }: ExpenseChartProps) {
  const total = data.reduce((sum, item) => sum + item.total, 0);
  const max = data.length > 0 ? data[0].total : 0;

  if (data.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-500">
        Expense categories will appear here once you add an expense.
      </p>
    );
  }

  return (
    <ul className="space-y-4" aria-label="Spending by category">
      {data.map((item) => {
        const percent = total > 0 ? Math.round((item.total / total) * 100) : 0;
        const width = max > 0 ? (item.total / max) * 100 : 0;
        return (
          <li key={item.category}>
            <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
              <span className="font-medium">{item.category}</span>
              <span className="text-slate-600">
                {formatINR(item.total)} · {percent}%
              </span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-full bg-slate-100"
              role="img"
              aria-label={`${item.category}: ${percent}% of expenses`}
            >
              <div
                className="h-full rounded-full bg-orange-500"
                style={{ width: `${width}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
