export type PeriodOption = {
  id: string;
  label: string;
  shortLabel: string;
  month: number;
  year: number;
};

export type CategoryKey = 
  | 'meals'
  | 'groceries'
  | 'rent'
  | 'shopping'
  | 'fun'
  | 'transport'
  | 'health'
  | 'savings'
  | 'investments'
  | 'utilities';

export type CategoryItem = {
  id: string;
  key: CategoryKey;
  name: string;
  percentage: number;
  amount: number;
  budgetLimit: number;
  color: string;
  bgColor: string;
  transactionCount: number;
  recentTransactions?: {
    id: string;
    title: string;
    date: string;
    amount: number;
    merchant: string;
  }[];
};

export type MonthlyComparison = {
  monthKey: string;      // e.g. "01/2026"
  monthName: string;     // e.g. "Jan"
  expense: number;       // e.g. 1850
  income: number;        // e.g. 700
  expenseHeightPercent: number; // 0 - 100 for visual chart
  incomeHeightPercent: number;
};

export type SpendingTrendPoint = {
  date: string;          // e.g. "11 Aug, 2026"
  day: number;           // e.g. 11
  amount: number;        // e.g. 501
  isPeak?: boolean;
};

export type BudgetSpace = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  targetAmount?: number;
  currency: string;
  type: 'main' | 'savings' | 'travel' | 'investment';
  badge?: string;
  accentColor: string;
  bgTint: string;
};

export type BudgetOverviewData = {
  period: string;
  totalExpense: number;
  totalIncome: number;
  netSavings: number;
  savingsRate: number;
  expenseChangePercent: number;
  incomeChangePercent: number;
  monthlyComparisons: MonthlyComparison[];
  spendingTrend: SpendingTrendPoint[];
  categories: CategoryItem[];
  incomeCategories: CategoryItem[];
  spaces: BudgetSpace[];
};
