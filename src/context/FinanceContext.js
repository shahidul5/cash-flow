import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import uuid from 'react-native-uuid';

// Create context
const FinanceContext = createContext();

// Storage keys
const TRANSACTIONS_KEY = '@cashflow_transactions';
const BUDGETS_KEY = '@cashflow_budgets';
const INCOME_CATEGORIES_KEY = '@cashflow_income_categories';
const BANK_ACCOUNTS_KEY = '@cashflow_bank_accounts';

// Default income categories
const DEFAULT_INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', icon: 'cash', color: '#4CAF50', isDefault: true },
  { id: 'investment', name: 'Investment', icon: 'chart-line', color: '#2196F3', isDefault: false },
  { id: 'gift', name: 'Gift', icon: 'gift', color: '#9C27B0', isDefault: false },
  { id: 'other_income', name: 'Other', icon: 'cash-plus', color: '#FF9800', isDefault: false },
];

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // We'll use a ref to store the notification function that will be set later
  const notificationRef = React.useRef({
    addBudgetOverrunNotification: null
  });

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const storedTransactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
        const storedBudgets = await AsyncStorage.getItem(BUDGETS_KEY);
        const storedIncomeCategories = await AsyncStorage.getItem(INCOME_CATEGORIES_KEY);
        const storedBankAccounts = await AsyncStorage.getItem(BANK_ACCOUNTS_KEY);

        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }

        if (storedBudgets) {
          setBudgets(JSON.parse(storedBudgets));
        } else {
          // Set default budget categories if none exist
          const defaultBudgets = [
            { id: '1', name: 'Food', amount: 500, color: '#FF5252', icon: 'food' },
            { id: '2', name: 'Transport', amount: 300, color: '#FFC107', icon: 'car' },
            { id: '3', name: 'Entertainment', amount: 200, color: '#2196F3', icon: 'movie' },
            { id: '4', name: 'Shopping', amount: 400, color: '#9C27B0', icon: 'shopping' },
            { id: '5', name: 'Bills', amount: 800, color: '#F44336', icon: 'file-document' },
          ];
          setBudgets(defaultBudgets);
          await AsyncStorage.setItem(BUDGETS_KEY, JSON.stringify(defaultBudgets));
        }

        if (storedIncomeCategories) {
          setIncomeCategories(JSON.parse(storedIncomeCategories));
        } else {
          // Default income categories
          const defaultCategories = [
            {
              id: uuid.v4(),
              name: 'Salary',
              icon: 'cash',
              color: '#4CAF50',
              isDefault: true
            },
            {
              id: uuid.v4(),
              name: 'Cash Addition',
              icon: 'cash-plus',
              color: '#9C27B0',
              isDefault: true
            }
          ];
          setIncomeCategories(defaultCategories);
          await AsyncStorage.setItem(INCOME_CATEGORIES_KEY, JSON.stringify(defaultCategories));
        }

        if (storedBankAccounts) {
          setBankAccounts(JSON.parse(storedBankAccounts));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save transactions to storage whenever they change
  useEffect(() => {
    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
      } catch (error) {
        console.error('Error saving transactions:', error);
      }
    };

    if (transactions.length > 0) {
      saveTransactions();
    }
  }, [transactions]);

  // Save budgets to storage whenever they change
  useEffect(() => {
    const saveBudgets = async () => {
      try {
        await AsyncStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
      } catch (error) {
        console.error('Error saving budgets:', error);
      }
    };

    if (budgets.length > 0) {
      saveBudgets();
    }
  }, [budgets]);

  // Save income categories to storage whenever they change
  useEffect(() => {
    const saveIncomeCategories = async () => {
      try {
        // Ensure we always have the default categories
        let updatedCategories = [...incomeCategories];

        // Check if Salary category exists
        const hasSalary = updatedCategories.some(cat => cat.name === 'Salary' && cat.isDefault);
        if (!hasSalary) {
          updatedCategories.push({
            id: uuid.v4(),
            name: 'Salary',
            icon: 'cash',
            color: '#4CAF50',
            isDefault: true
          });
        }

        // Check if Cash Addition category exists
        const hasCashAddition = updatedCategories.some(cat => cat.name === 'Cash Addition' && cat.isDefault);
        if (!hasCashAddition) {
          updatedCategories.push({
            id: uuid.v4(),
            name: 'Cash Addition',
            icon: 'cash-plus',
            color: '#9C27B0',
            isDefault: true
          });
        }

        // Only update state if we added a default category
        if (updatedCategories.length !== incomeCategories.length) {
          setIncomeCategories(updatedCategories);
        }

        await AsyncStorage.setItem(INCOME_CATEGORIES_KEY, JSON.stringify(updatedCategories));
      } catch (error) {
        console.error('Error saving income categories:', error);
      }
    };

    if (incomeCategories.length > 0) {
      saveIncomeCategories();
    }
  }, [incomeCategories]);

  // Save bank accounts to storage whenever they change
  useEffect(() => {
    const saveBankAccounts = async () => {
      try {
        await AsyncStorage.setItem(BANK_ACCOUNTS_KEY, JSON.stringify(bankAccounts));
      } catch (error) {
        console.error('Error saving bank accounts:', error);
      }
    };

    if (!isLoading) {
      saveBankAccounts();
    }
  }, [bankAccounts, isLoading]);

  // Check if any budget has been exceeded after adding or updating a transaction
  const checkBudgetOverruns = (transaction) => {
    if (!notificationRef.current.addBudgetOverrunNotification || transaction.type !== 'expense') return;

    // Only check for expense transactions
    const category = transaction.category;

    // Find the budget for this category
    const budget = budgets.find(b => b.name === category);
    if (!budget) return;

    // Calculate current spending for this budget
    const spent = calculateBudgetSpent(budget);
    const remaining = budget.amount - spent;

    // If budget is exceeded, send a notification
    if (remaining < 0) {
      notificationRef.current.addBudgetOverrunNotification(budget, spent, remaining);
    }
  };

  // Add a new transaction
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: uuid.v4(),
      date: new Date().toISOString(),
      ...transaction
    };

    // Update bank balance if this transaction is associated with a bank account
    if (transaction.bankId) {
      const isDeposit = transaction.type === 'income';
      updateBankBalance(transaction.bankId, transaction.amount, isDeposit);
    }

    setTransactions(prevTransactions => {
      const updatedTransactions = [newTransaction, ...prevTransactions];

      // Save to AsyncStorage
      AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions))
        .catch(error => console.error('Error saving transactions:', error));

      return updatedTransactions;
    });

    // Check if this transaction exceeds any budget
    checkBudgetOverruns(newTransaction);

    return newTransaction;
  };

  // Delete a transaction
  const deleteTransaction = async (transactionId) => {
    // Find the transaction to delete
    const transactionToDelete = transactions.find(t => t.id === transactionId);

    if (!transactionToDelete) {
      console.error('Transaction not found for deletion');
      return;
    }

    // If the transaction used a bank account, reverse its effect on the bank balance
    if (transactionToDelete.paymentMethod === 'bank' && transactionToDelete.bankId) {
      const wasDeposit = transactionToDelete.type === 'income';
      const amount = parseFloat(transactionToDelete.amount);

      // Reverse the transaction (deposit becomes withdrawal and vice versa)
      await updateBankBalance(
        transactionToDelete.bankId,
        amount,
        !wasDeposit
      );
    }

    const updatedTransactions = transactions.filter(
      transaction => transaction.id !== transactionId
    );

    setTransactions(updatedTransactions);
  };

  // Update an existing transaction
  const updateTransaction = (id, updatedTransaction) => {
    let oldTransaction = null;

    setTransactions(prevTransactions => {
      // Find the old transaction to reverse its effect on bank balance if needed
      oldTransaction = prevTransactions.find(t => t.id === id);

      // Update the transaction
      const updatedTransactions = prevTransactions.map(transaction =>
        transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
      );

      // Save to AsyncStorage
      AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions))
        .catch(error => console.error('Error saving transactions:', error));

      return updatedTransactions;
    });

    // If bank account was affected, update the balance
    if (oldTransaction && oldTransaction.bankId) {
      // Reverse the old transaction's effect
      const wasDeposit = oldTransaction.type === 'income';
      updateBankBalance(oldTransaction.bankId, oldTransaction.amount, !wasDeposit);
    }

    if (updatedTransaction.bankId) {
      // Apply the new transaction's effect
      const isDeposit = updatedTransaction.type === 'income';
      updateBankBalance(updatedTransaction.bankId, updatedTransaction.amount, isDeposit);
    }

    // Check if the updated transaction exceeds any budget
    if (updatedTransaction.type === 'expense') {
      checkBudgetOverruns(updatedTransaction);
    }
  };

  // Add a new budget category
  const addBudget = async (budget) => {
    const newBudget = {
      ...budget,
      id: uuid.v4(),
      createdAt: new Date().toISOString(),
    };

    const updatedBudgets = [...budgets, newBudget];
    setBudgets(updatedBudgets);
    return newBudget;
  };

  // Update a budget
  const updateBudget = async (updatedBudget) => {
    const updatedBudgets = budgets.map(budget =>
      budget.id === updatedBudget.id ? updatedBudget : budget
    );

    setBudgets(updatedBudgets);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(BUDGETS_KEY, JSON.stringify(updatedBudgets));
    } catch (error) {
      console.error('Error saving updated budgets:', error);
    }

    return updatedBudget;
  };

  // Delete a budget
  const deleteBudget = async (budgetId) => {
    const updatedBudgets = budgets.filter(budget => budget.id !== budgetId);
    setBudgets(updatedBudgets);
  };

  // Add a new income category
  const addIncomeCategory = async (category) => {
    // Ensure the category has a unique ID
    const newCategory = {
      ...category,
      id: uuid.v4(),
      isDefault: false,
    };

    const updatedCategories = [...incomeCategories, newCategory];
    setIncomeCategories(updatedCategories);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(INCOME_CATEGORIES_KEY, JSON.stringify(updatedCategories));
    } catch (error) {
      console.error('Error saving income categories:', error);
    }

    return newCategory;
  };

  // Update an income category
  const updateIncomeCategory = async (updatedCategory) => {
    // Find the category to update
    const categoryToUpdate = incomeCategories.find(cat => cat.id === updatedCategory.id);

    // Don't allow editing default categories
    if (categoryToUpdate && categoryToUpdate.isDefault) {
      console.error('Cannot update default income category');
      return null;
    }

    const updatedCategories = incomeCategories.map(category =>
      category.id === updatedCategory.id ? { ...updatedCategory, isDefault: category.isDefault } : category
    );

    setIncomeCategories(updatedCategories);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(INCOME_CATEGORIES_KEY, JSON.stringify(updatedCategories));
    } catch (error) {
      console.error('Error saving updated income categories:', error);
    }

    return updatedCategory;
  };

  // Delete an income category
  const deleteIncomeCategory = async (categoryId) => {
    // Find the category to delete
    const categoryToDelete = incomeCategories.find(cat => cat.id === categoryId);

    // Don't allow deleting default categories
    if (categoryToDelete && categoryToDelete.isDefault) {
      console.error('Cannot delete default income category');
      return false;
    }

    // Check if the category is used in any transactions
    const isUsed = transactions.some(transaction =>
      transaction.type === 'income' && transaction.category === categoryToDelete.name
    );

    if (isUsed) {
      console.error('Cannot delete category that is used in transactions');
      return false;
    }

    const updatedCategories = incomeCategories.filter(category => category.id !== categoryId);
    setIncomeCategories(updatedCategories);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(INCOME_CATEGORIES_KEY, JSON.stringify(updatedCategories));
    } catch (error) {
      console.error('Error saving income categories after deletion:', error);
      return false;
    }

    return true;
  };

  // Calculate total income for the current month
  const calculateTotalIncome = (transactionList = transactions) => {
    return transactionList
      .filter(transaction =>
        transaction.type === 'income' &&  // Only include real income transactions
        transaction.category !== 'Transfer' &&
        transaction.category !== 'Bank Transfer'
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  // Calculate total expenses for the current month
  const calculateTotalExpense = (transactionList = transactions) => {
    return transactionList
      .filter(transaction =>
        transaction.type === 'expense' &&
        transaction.category !== 'Transfer' &&
        transaction.category !== 'Bank Transfer'
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  // Get transactions for the current month
  const getCurrentMonthTransactions = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });
  };

  // For backward compatibility
  const getCurrentMonthIncome = () => {
    const monthTransactions = getCurrentMonthTransactions();
    return calculateTotalIncome(monthTransactions);
  };

  // For backward compatibility
  const getCurrentMonthExpenses = () => {
    const monthTransactions = getCurrentMonthTransactions();
    return calculateTotalExpense(monthTransactions);
  };

  // For backward compatibility
  const getExpensesByCategory = () => {
    const monthTransactions = getCurrentMonthTransactions();
    const expensesByCategory = {};

    monthTransactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = transaction.category || 'other';
        if (expensesByCategory[category]) {
          expensesByCategory[category] += transaction.amount;
        } else {
          expensesByCategory[category] = transaction.amount;
        }
      });

    return expensesByCategory;
  };

  // For backward compatibility
  const getBudgetUtilization = () => {
    const expensesByCategory = getExpensesByCategory();

    return budgets.map(budget => {
      const category = budget.category || budget.name || 'other';
      const spent = expensesByCategory[category] || 0;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

      return {
        ...budget,
        spent,
        remaining: budget.amount - spent,
        percentage: Math.min(percentage, 100), // Cap at 100%
      };
    });
  };

  // Get transactions by month
  const getTransactionsByMonth = (month, year) => {
    return transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };

  // Get transactions by category
  const getTransactionsByCategory = (category) => {
    if (!category) return [];

    // Handle both old (category) and new (name) property names
    return transactions.filter(transaction => {
      const transactionCategory = transaction.category ? transaction.category.toLowerCase() : '';
      const searchCategory = typeof category === 'string' ? category.toLowerCase() : '';
      return transactionCategory === searchCategory;
    });
  };

  // Calculate budget spent
  const calculateBudgetSpent = (budget) => {
    if (!budget) return 0;

    const category = budget.category || budget.name || 'other';
    const period = budget.period || 'Monthly';

    let filteredTransactions = transactions.filter(
      transaction => transaction.type === 'expense' &&
        (transaction.category === category || transaction.category === budget.name)
    );

    // Filter by period if needed
    if (period === 'Monthly') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      filteredTransactions = filteredTransactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
    } else if (period === 'Weekly') {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      filteredTransactions = filteredTransactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date >= startOfWeek;
      });
    }

    return filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      await AsyncStorage.removeItem(TRANSACTIONS_KEY);
      await AsyncStorage.removeItem(BUDGETS_KEY);
      await AsyncStorage.removeItem(INCOME_CATEGORIES_KEY);
      await AsyncStorage.removeItem(BANK_ACCOUNTS_KEY);
      setTransactions([]);
      setBudgets([]);
      setIncomeCategories([]);
      setBankAccounts([]);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  };

  // Bank account functions
  const addBankAccount = async (account) => {
    const newAccount = {
      ...account,
      id: uuid.v4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      transactions: []
    };

    setBankAccounts(prevAccounts => [...prevAccounts, newAccount]);
    return newAccount;
  };

  const updateBankAccount = async (updatedAccount) => {
    const updatedAccounts = bankAccounts.map(account => {
      if (account.id === updatedAccount.id) {
        return {
          ...account,
          ...updatedAccount,
          updatedAt: new Date().toISOString()
        };
      }
      return account;
    });

    setBankAccounts(updatedAccounts);
  };

  const deleteBankAccount = async (accountId) => {
    const updatedAccounts = bankAccounts.filter(account => account.id !== accountId);
    setBankAccounts(updatedAccounts);
  };

  const updateBankBalance = async (accountId, amount, isDeposit = true) => {
    const updatedAccounts = bankAccounts.map(account => {
      if (account.id === accountId) {
        const newBalance = isDeposit
          ? parseFloat(account.balance) + parseFloat(amount)
          : parseFloat(account.balance) - parseFloat(amount);

        return {
          ...account,
          balance: newBalance.toFixed(2),
          updatedAt: new Date().toISOString(),
          transactions: [
            ...account.transactions || [],
            {
              id: uuid.v4(),
              amount: parseFloat(amount),
              type: isDeposit ? 'deposit' : 'withdrawal',
              date: new Date().toISOString(),
              balance: newBalance.toFixed(2)
            }
          ]
        };
      }
      return account;
    });

    setBankAccounts(updatedAccounts);
  };

  const getTotalBankBalance = () => {
    return bankAccounts.reduce((total, account) => {
      return total + parseFloat(account.balance || 0);
    }, 0);
  };

  // Calculate total cash balance
  const calculateCashBalance = () => {
    // Add together:
    // 1. Income transactions that use cash payment method
    const incomeTotal = transactions
      .filter(transaction =>
        transaction.type === 'income' &&
        transaction.paymentMethod !== 'bank' &&
        transaction.category !== 'Transfer' &&
        transaction.category !== 'Bank Transfer'
      )
      .reduce((total, transaction) => total + transaction.amount, 0);

    // 2. Cash addition transactions
    const cashAdditionTotal = transactions
      .filter(transaction => transaction.type === 'cash_addition')
      .reduce((total, transaction) => total + transaction.amount, 0);

    // Subtract cash expenses
    const cashExpenseTotal = transactions
      .filter(transaction =>
        transaction.type === 'expense' &&
        transaction.paymentMethod !== 'bank' &&
        transaction.category !== 'Transfer' &&
        transaction.category !== 'Bank Transfer'
      )
      .reduce((total, transaction) => total + transaction.amount, 0);

    return incomeTotal + cashAdditionTotal - cashExpenseTotal;
  };

  // Calculate total balance (cash + bank accounts)
  const calculateTotalBalance = () => {
    const cashBalance = calculateCashBalance();
    const bankBalance = getTotalBankBalance();
    return cashBalance + bankBalance;
  };

  // Add cash without creating an income transaction
  const addCashBalance = async (amount, note = 'Cash added to wallet') => {
    // The cash balance is calculated from transactions
    // We need to store this information somewhere to track it
    // We'll create a special transaction type that won't be counted as income
    const newTransaction = {
      id: uuid.v4(),
      date: new Date().toISOString(),
      type: 'cash_addition', // Special type that won't be counted as income
      amount: parseFloat(amount),
      category: 'Cash Addition',
      note: note,
      paymentMethod: 'cash',
      bankId: null,
    };

    setTransactions(prevTransactions => {
      const updatedTransactions = [newTransaction, ...prevTransactions];

      // Save to AsyncStorage
      AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions))
        .catch(error => console.error('Error saving transactions:', error));

      return updatedTransactions;
    });

    return newTransaction;
  };

  // Set the notification function from outside
  const setNotificationFunction = (func) => {
    notificationRef.current.addBudgetOverrunNotification = func;
  };

  const value = {
    transactions,
    budgets,
    incomeCategories,
    bankAccounts,
    isLoading,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    addIncomeCategory,
    updateIncomeCategory,
    deleteIncomeCategory,
    calculateTotalIncome,
    calculateTotalExpense,
    getCurrentMonthTransactions,
    getCurrentMonthIncome,
    getCurrentMonthExpenses,
    getExpensesByCategory,
    getBudgetUtilization,
    getTransactionsByMonth,
    getTransactionsByCategory,
    calculateBudgetSpent,
    clearAllData,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    updateBankBalance,
    getTotalBankBalance,
    calculateCashBalance,
    calculateTotalBalance,
    addCashBalance,
    setNotificationFunction,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook to use the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export default FinanceContext; 