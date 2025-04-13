// User types
export interface User {
  id: string;
  name: string;
  email?: string;
  profilePicture?: string;
  createdAt: number;
  updatedAt: number;
}

// Finance related types
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: number;
  type: 'income' | 'expense';
  recurring?: boolean;
  recurringPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurringEndDate?: number;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: number;
  endDate?: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  type: 'income' | 'expense' | 'both';
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: number;
  type: 'transaction' | 'budget' | 'system';
  relatedItemId?: string;
}

// Theme types
export interface ThemeColors {
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryDark: string;
  background: string;
  white: string;
  black: string;
  text: string;
  textSecondary: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  border: string;
  card: string;
  cardBackground?: string;
  expense: string;
  income: string;
  shadow: string;
  headerBackground: string;
  headerText: string;
}

export interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  isDarkMode: boolean;
  colors: ThemeColors;
}

// Authentication types
export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Transactions: undefined;
  AddTransaction: { type?: 'income' | 'expense' };
  TransactionDetail: { id: string };
  Categories: undefined;
  Settings: undefined;
  Profile: undefined;
  Statistics: undefined;
  Budgets: undefined;
  AddBudget: undefined;
  BudgetDetail: { id: string };
  Notifications: undefined;
};
