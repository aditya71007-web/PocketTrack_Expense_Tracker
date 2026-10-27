# PocketTrack — Expense Tracker

A responsive personal expense tracker built with **React + TypeScript + Vite** and styled entirely with **Tailwind CSS**. There is no backend and no external API: transactions are saved in your browser's `localStorage`.

## Features

- Dashboard with total balance, income and expenses (calculated automatically)
- Add, edit and delete transactions (delete asks for confirmation)
- Title, amount, type, category and date for every transaction
- Search by title/category, filter by type and category (filters combine)
- Form validation with clear messages (blank title, zero/negative/non-numeric amount, missing category, invalid date)
- Helpful empty states (no transactions yet / no matches for the filters)
- Spending-by-category bar chart (plain CSS, no chart library)
- Export transactions as CSV
- Persistent data via `localStorage`, safe against corrupt or missing data
- Responsive layout for mobile, tablet and desktop; keyboard-friendly and screen-reader labelled


## Project structure

```
src/
├── components/
│   ├── Header.tsx           # app name, Add + Export buttons
│   ├── SummaryCard.tsx      # one metric card (balance / income / expenses)
│   ├── TransactionForm.tsx  # add/edit modal form with validation
│   ├── TransactionList.tsx  # list + empty states
│   ├── TransactionItem.tsx  # one row with Edit / Delete
│   ├── FilterBar.tsx        # search, type and category filters
│   ├── ExpenseChart.tsx     # category bar chart
│   └── ConfirmDialog.tsx    # delete confirmation
├── types/transaction.ts     # Transaction type and related types
├── utils/
│   ├── calculations.ts      # totals, category totals, filtering, sorting
│   ├── validation.ts        # form validation and conversion
│   ├── storage.ts           # safe localStorage load/save
│   ├── format.ts            # INR/date formatting, id creation
│   ├── categories.ts        # category lists
│   ├── csv.ts               # CSV export
│   └── utils.test.ts        # unit tests
├── App.tsx                  # owns state, wires everything together
├── main.tsx
└── index.css                # Tailwind import
```

## How it works

- `App.tsx` holds the `transactions` array in state, initialised from `localStorage` and saved back with `useEffect` whenever it changes.
- Totals, category totals and the visible list are **derived** from that state each render, so they can never get out of sync.
- Amounts are always stored as positive numbers; the `type` field decides whether they count as income or expense.
- Editing updates the transaction with the matching `id` (no duplicates).

## Known limitations

- Data lives only in this browser on this device. There is no login, cloud backup or sync across devices.
- Clearing site data in your browser deletes your transactions. Use **Export CSV** to keep a copy.
- Currency is fixed to Indian Rupees (₹).
- Not a banking app and not financial advice. Don't store sensitive account details in it.

## Deploying (Vercel)

Push to GitHub, import the repo in Vercel and keep the detected Vite settings (build command `npm run build`, output directory `dist`).
