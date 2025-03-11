import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/currency';

// Map category names to MaterialCommunityIcons names
const categoryIcons = {
  food: 'food',
  transport: 'car',
  transportation: 'car',
  entertainment: 'movie',
  shopping: 'shopping',
  bills: 'file-document',
  home: 'home',
  health: 'medical-bag',
  education: 'school',
  gifts: 'gift',
  salary: 'cash',
  investment: 'chart-line',
  transfer: 'bank-transfer',
  'bank transfer': 'bank-transfer',
  other: 'cash',
};

const TransactionCard = ({ transaction }) => {
  const { theme, isDarkMode } = useTheme();

  // Handle null or undefined transaction
  if (!transaction) {
    return null;
  }

  // Destructure transaction with default values
  const {
    description = '',
    amount = 0,
    date = new Date(),
    type = 'expense',
    category = 'other',
    note = ''
  } = transaction;

  const isExpense = type === 'expense';
  const isTransfer = category === 'Transfer' || category === 'Bank Transfer';
  const formattedDate = new Date(date).toLocaleDateString();

  // Get icon name based on category
  let iconName = 'cash';
  if (category && typeof category === 'string') {
    const lowerCategory = category.toLowerCase();
    iconName = categoryIcons[lowerCategory] || 'cash';
  }

  // For transfers, always use the bank-transfer icon
  if (isTransfer) {
    iconName = 'bank-transfer';
  }

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.card,
        borderColor: theme.border
      }
    ]}>
      <View style={[
        styles.iconContainer,
        {
          backgroundColor: isTransfer
            ? theme.info
            : isExpense
              ? theme.expense
              : theme.income
        }
      ]}>
        <MaterialCommunityIcons name={iconName} size={20} color="#FFFFFF" />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={[styles.description, { color: theme.text }]}>
          {isTransfer ? (note || 'Transfer') : (description || category)}
        </Text>
        <Text style={[styles.category, { color: theme.textSecondary }]}>
          {category} • {formattedDate}
        </Text>
      </View>

      <Text style={[
        styles.amount,
        {
          color: isTransfer
            ? theme.info
            : isExpense
              ? theme.expense
              : theme.income
        }
      ]}>
        {isExpense && !isTransfer ? '-' : '+'}{formatCurrency(amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionCard; 