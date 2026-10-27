interface SummaryCardProps {
  label: string;
  value: string;
  tone: "balance" | "income" | "expense";
  hint?: string;
}

const toneStyles = {
  balance: "text-slate-900",
  income: "text-teal-700",
  expense: "text-orange-700",
} as const;

const iconStyles = {
  balance: "bg-slate-100 text-slate-700",
  income: "bg-teal-100 text-teal-700",
  expense: "bg-orange-100 text-orange-700",
} as const;

const icons = {
  balance: "=",
  income: "↑",
  expense: "↓",
} as const;

export default function SummaryCard({ label, value, tone, hint }: SummaryCardProps) {
  return (
    <section
      aria-label={label}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-500">{label}</h2>
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 items-center justify-center rounded-full text-base font-bold ${iconStyles[tone]}`}
        >
          {icons[tone]}
        </span>
      </div>
      <p
        data-testid={`summary-${tone}`}
        className={`mt-3 break-words text-2xl font-bold sm:text-3xl ${toneStyles[tone]}`}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </section>
  );
}
