# FinanceFlow 2026

A modern, AI-powered personal finance dashboard built with Next.js 15, React 19, and TypeScript. Track your expenses, manage budgets, and visualize your financial health with beautiful, interactive charts.

## Features

- 📊 **Overview Dashboard** - Get a quick view of your total income, expenses, savings, and financial health score
- 💰 **Expense Tracker** - Add, edit, and delete transactions with categories, dates, and notes
- 📈 **Interactive Charts** - Visualize your finances with:
  - Monthly expense trends (line chart)
  - Category-wise spending (pie chart)
  - Income vs expenses comparison (bar chart)
- 🎯 **Budget Planner** - Set monthly budgets for different categories and track your spending
- 🏷️ **Category Management** - Create custom categories with color coding
- 🌙 **Dark Mode** - Toggle between light and dark themes with smooth transitions
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- 📥 **CSV Export** - Export your transaction data for external analysis
- 🎨 **Modern UI** - Glassmorphism design with smooth animations using Framer Motion
- 💾 **Local Storage** - All data persists locally in your browser

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management with persistence
- **Recharts** - Composable charting library
- **Framer Motion** - Animation library
- **date-fns** - Date utility library
- **lucide-react** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Adding Transactions

1. Click the "Add Transaction" button in the Expense Tracker section
2. Select transaction type (Income or Expense)
3. Enter the amount, category, date, and optional notes
4. Click "Add Transaction"

### Setting Budgets

1. Click "Set Budget" in the Budget Planner section
2. Select a category and enter your monthly budget amount
3. Track your spending progress with visual progress bars

### Managing Categories

1. Click "Add Category" in the Category Manager section
2. Enter a category name and choose a color
3. Custom categories can be deleted, but default categories are protected

### Exporting Data

Click the download icon in the header to export all your transactions as a CSV file.

### Dark Mode

Toggle dark mode using the moon/sun icon in the header.

## Financial Health Score

The financial health score is calculated based on:
- Savings rate (how much you save vs. your income)
- Expense consistency (variability in monthly spending)

A score of 80-100 indicates excellent financial health, while scores below 50 may need attention.

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── providers.tsx   # Client providers
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── Header.tsx
│   ├── OverviewCards.tsx
│   ├── ExpenseTracker.tsx
│   ├── ChartsSection.tsx
│   ├── BudgetPlanner.tsx
│   └── CategoryManager.tsx
├── store/              # Zustand store
│   └── useStore.ts     # Global state management
├── types/              # TypeScript types
│   └── index.ts
└── utils/              # Utility functions
    ├── calculations.ts
    └── export.ts
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

