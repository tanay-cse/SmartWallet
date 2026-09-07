import { Colors } from '../theme/colors';

export type TransactionItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  fullDate: string;
  amount: number;
  formattedAmount: string;
  type: 'income' | 'outcome';
  categoryKey: string;
  merchant: string;
  iconBg: string;
  iconColor: string;
  isRecurring?: boolean;
  frequency?: string;
  daysLeft?: string;
};

export type TransactionSection = {
  title: string;
  data: TransactionItem[];
};

export const MOCK_ALL_TRANSACTIONS: TransactionItem[] = [
  // TODAY
  {
    id: 'tx-1',
    title: 'Salary-January',
    date: '31/12/2025',
    time: '15:00',
    fullDate: '31/12/2025 · 15:00',
    amount: 2000.0,
    formattedAmount: '+₹2,000.00',
    type: 'income',
    categoryKey: 'salary',
    merchant: 'Corporate Payroll',
    iconBg: Colors.forestGreenLight,
    iconColor: Colors.forestGreen,
  },
  {
    id: 'tx-2',
    title: 'Rent Payment',
    date: '31/12/2025',
    time: '15:00',
    fullDate: '31/12/2025 · 15:00',
    amount: 290.0,
    formattedAmount: '-₹290.00',
    type: 'outcome',
    categoryKey: 'rent',
    merchant: 'Residential Lease',
    iconBg: '#EFF6FF',
    iconColor: Colors.navyBlue,
  },
  {
    id: 'tx-3',
    title: 'Grocery for Lunar Year',
    date: '31/12/2025',
    time: '15:00',
    fullDate: '31/12/2025 · 15:00',
    amount: 35.0,
    formattedAmount: '-₹35.00',
    type: 'outcome',
    categoryKey: 'groceries',
    merchant: 'FairPrice Supermarket',
    iconBg: Colors.forestGreenLight,
    iconColor: Colors.forestGreen,
  },

  // TUESDAY, OCT 24
  {
    id: 'tx-4',
    title: 'Gym Membership',
    date: '31/12/2025',
    time: '15:00',
    fullDate: '31/12/2025 · 15:00',
    amount: 20.0,
    formattedAmount: '-₹20.00',
    type: 'outcome',
    categoryKey: 'health',
    merchant: 'Fitness First',
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
  },
  {
    id: 'tx-5',
    title: 'Freelance Design Project',
    date: '31/12/2025',
    time: '15:00',
    fullDate: '31/12/2025 · 15:00',
    amount: 135.0,
    formattedAmount: '+₹135.00',
    type: 'income',
    categoryKey: 'investments',
    merchant: 'Acme Studio Client',
    iconBg: Colors.forestGreenLight,
    iconColor: Colors.forestGreen,
  },
  {
    id: 'tx-6',
    title: 'Coffee & Milk tea',
    date: '31/12/2025',
    time: '15:00',
    fullDate: '31/12/2025 · 15:00',
    amount: 25.0,
    formattedAmount: '-₹25.00',
    type: 'outcome',
    categoryKey: 'meals',
    merchant: 'Heytea Cafe',
    iconBg: '#F1F5F9',
    iconColor: Colors.slateExpense,
  },
  {
    id: 'tx-7',
    title: 'Ride share with Mike',
    date: '31/12/2025',
    time: '15:00',
    fullDate: '31/12/2025 · 15:00',
    amount: 25.0,
    formattedAmount: '-₹25.00',
    type: 'outcome',
    categoryKey: 'transport',
    merchant: 'Grab Transport',
    iconBg: '#F0FDF4',
    iconColor: '#0B6E4F',
  },

  // FRIDAY, OCT 20
  {
    id: 'tx-8',
    title: 'Apple Invoice #1234',
    date: '31/12/2025',
    time: '15:00',
    fullDate: '31/12/2025 · 15:00',
    amount: 20.0,
    formattedAmount: '-₹20.00',
    type: 'outcome',
    categoryKey: 'shopping',
    merchant: 'Apple Services',
    iconBg: '#F8F9FA',
    iconColor: Colors.textPrimary,
    isRecurring: true,
    frequency: '/month',
    daysLeft: '2 days left',
  },
  {
    id: 'tx-9',
    title: 'Paypal Invoice #1234',
    date: '31/12/2025',
    time: '15:00',
    fullDate: '31/12/2025 · 15:00',
    amount: 20.0,
    formattedAmount: '-₹20.00',
    type: 'outcome',
    categoryKey: 'shopping',
    merchant: 'PayPal Commerce',
    iconBg: '#EFF6FF',
    iconColor: Colors.navyBlue,
  },
  {
    id: 'tx-10',
    title: 'Youtube Premium',
    date: '31/12/2025',
    time: '15:00',
    fullDate: '31/12/2025 · 15:00',
    amount: 20.0,
    formattedAmount: '-₹20.00',
    type: 'outcome',
    categoryKey: 'fun',
    merchant: 'Google Subscriptions',
    iconBg: '#FEF2F2',
    iconColor: '#EF4444',
    isRecurring: true,
    frequency: '/month',
    daysLeft: '2 days left',
  },
];

export const MOCK_TRANSACTION_SECTIONS: TransactionSection[] = [
  {
    title: 'TODAY',
    data: MOCK_ALL_TRANSACTIONS.slice(0, 3),
  },
  {
    title: 'TUESDAY, OCT 24',
    data: MOCK_ALL_TRANSACTIONS.slice(3, 7),
  },
  {
    title: 'FRIDAY, OCT 20',
    data: MOCK_ALL_TRANSACTIONS.slice(7, 10),
  },
];

export const MOCK_RECENT_TRANSACTIONS = [
  {
    id: 'rec-1',
    title: 'Apple Invoice #1234',
    date: '31/12/2025 · 15:00',
    amount: '-₹20.00',
    category: 'shopping',
    iconType: 'apple',
  },
  {
    id: 'rec-2',
    title: 'Paypal Invoice #1234',
    date: '31/12/2025 · 15:00',
    amount: '-₹20.00',
    category: 'shopping',
    iconType: 'paypal',
  },
  {
    id: 'rec-3',
    title: 'Apple Invoice #1234',
    date: '31/12/2025 · 15:00',
    amount: '-₹20.00',
    category: 'shopping',
    iconType: 'spotify',
  },
];
