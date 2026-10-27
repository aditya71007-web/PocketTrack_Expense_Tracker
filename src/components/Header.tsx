interface HeaderProps {
  onAdd: () => void;
  onExport: () => void;
  canExport: boolean;
}

export default function Header({ onAdd, onExport, canExport }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white"
          >
            ₹
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight">PocketTrack</h1>
            <p className="text-xs text-slate-500">Personal expense tracker</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            disabled={!canExport}
            className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-block"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={onAdd}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            + Add transaction
          </button>
        </div>
      </div>
    </header>
  );
}
