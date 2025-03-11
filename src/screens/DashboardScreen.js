import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BankBalanceSummary from '../components/BankBalanceSummary';
import BudgetCard from '../components/BudgetCard';
import ExpenseChart from '../components/ExpenseChart';
import SummaryCard from '../components/SummaryCard';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { formatCurrency } from '../utils/currency';

const DashboardScreen = ({ navigation }) => {
  const {
    calculateTotalIncome,
    calculateTotalExpense,
    getTransactionsByMonth,
    transactions,
    budgets,
    isLoading,
    calculateBudgetSpent,
    getTotalBankBalance,
    calculateCashBalance,
    calculateTotalBalance
  } = useFinance();

  const { theme, isDarkMode } = useTheme();
  const { userProfile } = useUser();

  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);

  useEffect(() => {
    loadMonthlyData();
  }, [transactions, currentMonth, currentYear]);

  useEffect(() => {
    prepareChartData();
  }, [monthlyTransactions]);

  const loadMonthlyData = () => {
    const monthly = getTransactionsByMonth(currentMonth, currentYear);
    setMonthlyTransactions(monthly);
  };

  const prepareChartData = () => {
    // Group expenses by category
    const expensesByCategory = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const { category, amount } = transaction;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
      }, {});

    const data = [];

    Object.keys(expensesByCategory).forEach((category, index) => {
      // Find the budget with this category name to get its color
      const budgetItem = budgets.find(b => b.category === category);

      data.push({
        name: category,
        value: expensesByCategory[category],
        color: budgetItem?.color || theme.primary,
        legendFontColor: theme.text,
        legendFontSize: 12,
      });
    });

    setChartData(data);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMonthlyData();
    prepareChartData();
    setRefreshing(false);
  };

  const totalIncome = calculateTotalIncome(monthlyTransactions);
  const totalExpenses = calculateTotalExpense(monthlyTransactions);
  const cashBalance = calculateCashBalance();
  const bankBalance = getTotalBankBalance();
  const totalBalance = calculateTotalBalance();

  // Calculate budget utilization
  const budgetUtilization = budgets.map(budget => {
    const spent = calculateBudgetSpent(budget);
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

    return {
      ...budget,
      spent,
      remaining: budget.amount - spent,
      percentage: Math.min(percentage, 100), // Cap at 100%
    };
  });

  // Sort budgets by percentage (highest first)
  const sortedBudgets = [...budgetUtilization].sort((a, b) => b.percentage - a.percentage);
  // Get top 3 budgets
  const topBudgets = sortedBudgets.slice(0, 3);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.text }]}>
            Welcome to your financial dashboard
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Here's your financial summary
          </Text>
        </View>

        <View style={styles.summaryContainer}>
          <SummaryCard
            title="Monthly Income"
            amount={totalIncome}
            icon="arrow-down-circle"
            color="#4CAF50"
          />
          <SummaryCard
            title="Monthly Expenses"
            amount={totalExpenses}
            icon="arrow-up-circle"
            color="#F44336"
          />
          <SummaryCard
            title="Cash"
            amount={cashBalance}
            icon="cash"
            color="#2196F3"
          />
        </View>

        {/* Total Balance Section */}
        <View style={[styles.totalBalanceContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.totalBalanceLabel, { color: theme.textSecondary }]}>
            Total Balance
          </Text>
          <Text style={[styles.totalBalanceAmount, { color: theme.text }]}>
            {formatCurrency(totalBalance)}
          </Text>
          <View style={styles.balanceBreakdown}>
            <View style={styles.balanceItem}>
              <MaterialCommunityIcons name="cash" size={16} color={theme.primary} />
              <Text style={[styles.balanceItemText, { color: theme.text }]}>
                Cash: {formatCurrency(cashBalance)}
              </Text>
            </View>
            <View style={styles.balanceItem}>
              <MaterialCommunityIcons name="bank" size={16} color={theme.primary} />
              <Text style={[styles.balanceItemText, { color: theme.text }]}>
                Banks: {formatCurrency(bankBalance)}
              </Text>
            </View>
          </View>
        </View>

        {/* Add Bank Balance Summary */}
        <BankBalanceSummary />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Expense Breakdown</Text>
          </View>
          {monthlyTransactions.length > 0 ? (
            <View style={[styles.chartContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <ExpenseChart transactions={monthlyTransactions} />
            </View>
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No transactions found for this month.
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('AddTransaction')}
              >
                <Text style={styles.addButtonText}>Add Transaction</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Budget Categories</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('BudgetTab')}
            >
              <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={theme.primary} />
            </TouchableOpacity>
          </View>
          {topBudgets.length > 0 ? (
            topBudgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onPress={() => navigation.navigate('BudgetDetail', { budget })}
              />
            ))
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No budgets found. Create a budget to track your spending.
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('AddBudget')}
              >
                <Text style={styles.addButtonText}>Create Budget</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
          </View>
          <View style={[styles.actionsContainer, { backgroundColor: isDarkMode ? theme.cardDark : '#F5F7FA', borderColor: theme.border }]}>
            <Text style={[styles.quickActionsTitle, { color: theme.text }]}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => navigation.navigate('AddTransaction', { type: 'income', paymentMethod: 'cash' })}
              >
                <View style={[styles.actionIcon, { backgroundColor: theme.income }]}>
                  <MaterialCommunityIcons name="arrow-down-circle" size={20} color="#FFFFFF" />
                </View>
                <Text style={[styles.actionText, { color: theme.text }]}>Add Income</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => navigation.navigate('AddTransaction', { type: 'expense', paymentMethod: 'cash' })}
              >
                <View style={[styles.actionIcon, { backgroundColor: theme.expense }]}>
                  <MaterialCommunityIcons name="arrow-up-circle" size={20} color="#FFFFFF" />
                </View>
                <Text style={[styles.actionText, { color: theme.text }]}>Add Expense</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => navigation.navigate('AddCash')}
              >
                <View style={[styles.actionIcon, { backgroundColor: theme.income }]}>
                  <MaterialCommunityIcons name="cash-plus" size={20} color="#FFFFFF" />
                </View>
                <Text style={[styles.actionText, { color: theme.text }]}>Add Cash</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => navigation.navigate('BankTab', { screen: 'Transfer' })}
              >
                <View style={[styles.actionIcon, { backgroundColor: theme.info }]}>
                  <MaterialCommunityIcons name="bank-transfer" size={20} color="#FFFFFF" />
                </View>
                <Text style={[styles.actionText, { color: theme.text }]}>Transfer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionsContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  totalBalanceContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  totalBalanceLabel: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  totalBalanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  balanceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceItemText: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default DashboardScreen; 