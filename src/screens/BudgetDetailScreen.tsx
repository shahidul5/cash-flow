import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import TransactionCard from '../components/TransactionCard';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/currency';

const BudgetDetailScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const { budget } = route.params;
  const {
    transactions,
    deleteBudget,
    updateBudget,
    calculateBudgetSpent,
    getTransactionsByCategory
  } = useFinance();
  const { theme, isDarkMode } = useTheme();
  const [budgetTransactions, setBudgetTransactions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadBudgetData();
  }, [transactions, budget]);

  const loadBudgetData = () => {
    // Get transactions for this budget category
    const categoryTransactions = getTransactionsByCategory(budget.name)
      .filter(t => t.type === 'expense');

    // Filter by period if needed
    let filteredTransactions = [...categoryTransactions];

    if (budget.period === 'Monthly') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      filteredTransactions = filteredTransactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
    } else if (budget.period === 'Weekly') {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      filteredTransactions = filteredTransactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date >= startOfWeek;
      });
    }

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    setBudgetTransactions(filteredTransactions);
  };

  const spent = calculateBudgetSpent(budget);
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  const remaining = budget.amount - spent;
  const isOverBudget = remaining < 0;

  const getProgressColor = () => {
    if (percentage < 50) return '#4CAF50';
    if (percentage < 75) return '#FFC107';
    return '#F44336';
  };

  const handleDeleteBudget = () => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBudget(budget.id);
            navigation.goBack();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBudgetData();
    setRefreshing(false);
  };

  const renderTransactionItem: React.FC<{ item: any }> = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
    >
      <TransactionCard transaction={item} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.budgetHeader, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <View style={styles.budgetInfo}>
          <View style={styles.titleRow}>
            <View style={styles.titleWithIcon}>
              <View style={[styles.iconContainer, { backgroundColor: budget.color || getProgressColor() }]}>
                <MaterialCommunityIcons name={budget.icon || 'cash'} size={20} color="#FFFFFF" />
              </View>
              <Text style={[styles.budgetTitle, { color: theme.text }]}>{budget.name}</Text>
            </View>
            <Text style={[styles.budgetPeriod, { color: theme.textSecondary }]}>{budget.period}</Text>
          </View>

          <View style={styles.amountRow}>
            <Text style={[styles.spentAmount, { color: theme.text }]}>
              {formatCurrency(spent)} <Text style={[styles.totalAmount, { color: theme.textSecondary }]}>/ {formatCurrency(budget.amount)}</Text>
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: getProgressColor()
                  }
                ]}
              />
            </View>
            <Text style={[styles.percentageText, { color: theme.textSecondary }]}>
              {percentage.toFixed(0)}%
            </Text>
          </View>

          <Text style={[
            styles.remainingText,
            { color: isOverBudget ? '#F44336' : theme.textSecondary }
          ]}>
            {isOverBudget
              ? `${formatCurrency(Math.abs(remaining))} over budget`
              : `${formatCurrency(remaining)} remaining`
            }
          </Text>
        </View>
      </View>

      <View style={styles.transactionsHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>
      </View>

      <FlatList
        data={budgetTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No transactions for this budget category
            </Text>
          </View>
        }
      />

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.primaryActionButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('AddTransaction', { category: budget.name })}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
          <Text style={styles.primaryActionButtonText}>Add Transaction</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActionsRow}>
          <TouchableOpacity
            style={[styles.secondaryActionButton, { backgroundColor: theme.info }]}
            onPress={() => navigation.navigate('EditBudget', { budget })}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#FFFFFF" />
            <Text style={styles.secondaryActionButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryActionButton, { backgroundColor: theme.error }]}
            onPress={handleDeleteBudget}
          >
            <MaterialCommunityIcons name="delete" size={20} color="#FFFFFF" />
            <Text style={styles.secondaryActionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  budgetHeader: {
    padding: 20,
    borderBottomWidth: 1,
  },
  budgetInfo: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  budgetPeriod: {
    fontSize: 14,
  },
  amountRow: {
    marginBottom: 12,
  },
  spentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    width: 40,
    textAlign: 'right',
  },
  remainingText: {
    fontSize: 14,
    marginTop: 4,
  },
  transactionsHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  primaryActionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.48,
    elevation: 2,
  },
  secondaryActionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});

export default BudgetDetailScreen; 