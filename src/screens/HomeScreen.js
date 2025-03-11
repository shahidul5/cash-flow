import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BudgetCard from '../components/BudgetCard';
import ExpenseChart from '../components/ExpenseChart';
import SummaryCard from '../components/SummaryCard';
import TransactionCard from '../components/TransactionCard';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = ({ navigation }) => {
  const { transactions, budgets, getTransactionsByMonth, calculateTotalIncome, calculateTotalExpense } = useFinance();
  const { theme, isDarkMode } = useTheme();
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const monthly = getTransactionsByMonth(currentMonth, currentYear);
    setMonthlyTransactions(monthly);
  }, [transactions, currentMonth, currentYear]);

  const totalIncome = calculateTotalIncome(monthlyTransactions);
  const totalExpense = calculateTotalExpense(monthlyTransactions);
  const balance = totalIncome - totalExpense;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const topBudgets = [...budgets]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const changeMonth = (direction) => {
    let newMonth = currentMonth;
    let newYear = currentYear;

    if (direction === 'next') {
      if (currentMonth === 11) {
        newMonth = 0;
        newYear = currentYear + 1;
      } else {
        newMonth = currentMonth + 1;
      }
    } else {
      if (currentMonth === 0) {
        newMonth = 11;
        newYear = currentYear - 1;
      } else {
        newMonth = currentMonth - 1;
      }
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => changeMonth('prev')}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.monthText, { color: theme.text }]}>
          {monthNames[currentMonth]} {currentYear}
        </Text>
        <TouchableOpacity onPress={() => changeMonth('next')}>
          <Ionicons name="chevron-forward" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <SummaryCard
          title="Income"
          amount={totalIncome}
          icon="arrow-down-circle"
          color="#4CAF50"
        />
        <SummaryCard
          title="Expense"
          amount={totalExpense}
          icon="arrow-up-circle"
          color="#F44336"
        />
        <SummaryCard
          title="Balance"
          amount={balance}
          icon="wallet"
          color="#2196F3"
        />
      </View>

      {monthlyTransactions.length > 0 ? (
        <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Expense Breakdown</Text>
          <ExpenseChart transactions={monthlyTransactions} />
        </View>
      ) : (
        <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>No transactions this month</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Add transactions to see your expense breakdown
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TransactionTab')}>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.length > 0 ? (
          recentTransactions.map(transaction => (
            <TouchableOpacity
              key={transaction.id}
              onPress={() => navigation.navigate('TransactionDetail', { transaction })}
            >
              <TransactionCard transaction={transaction} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No transactions yet. Add your first transaction!
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
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Budgets</Text>
          <TouchableOpacity onPress={() => navigation.navigate('BudgetTab')}>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {topBudgets.length > 0 ? (
          topBudgets.map(budget => (
            <TouchableOpacity
              key={budget.id}
              onPress={() => navigation.navigate('BudgetDetail', { budget })}
            >
              <BudgetCard budget={budget} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No budgets yet. Create your first budget!
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate('AddBudget')}
            >
              <Text style={styles.addButtonText}>Add Budget</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.floatingButton}>
        <TouchableOpacity
          style={[styles.addTransactionButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
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
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
  addTransactionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default HomeScreen; 