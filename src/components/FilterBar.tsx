import type { FilterType } from "../types/transaction";

interface FilterBarProps {
  searchTerm: string;
  filterType: FilterType;
  filterCategory: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onTypeChange: (value: FilterType) => void;
  onCategoryChange: (value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

const typeOptions: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/30";

export default function FilterBar({
  searchTerm,
  filterType,
  filterCategory,
  categories,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onClear,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="search" className="mb-1 block text-xs font-medium text-slate-600">
            Search
          </label>
          <input
            id="search"
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Title or category"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="filter-category" className="mb-1 block text-xs font-medium text-slate-600">
            Category
          </label>
          <select
            id="filter-category"
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={inputClass}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label="Filter by type" className="inline-flex rounded-lg bg-slate-100 p-1">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filterType === option.value}
              onClick={() => onTypeChange(option.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                filterType === option.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-teal-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
