import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BudgetCard from '../components/BudgetCard';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';

const BudgetsScreen = ({ navigation }) => {
  const { budgets, deleteBudget, isLoading, calculateBudgetSpent } = useFinance();
  const { theme, isDarkMode } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

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

  const handleDeleteBudget = (budgetId) => {
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
            deleteBudget(budgetId);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderBudgetItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('BudgetDetail', { budget: item })}
    >
      <BudgetCard budget={item} />
    </TouchableOpacity>
  );

  const onRefresh = () => {
    setRefreshing(true);
    // No need to manually refresh since the context will handle it
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={budgetUtilization}
        renderItem={renderBudgetItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              You don't have any budgets yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Create a budget to track your spending
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('AddBudget')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for FAB
  },
  emptyContainer: {
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
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

export default BudgetsScreen; 