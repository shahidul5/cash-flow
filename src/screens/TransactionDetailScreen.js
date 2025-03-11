import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import TransactionForm from '../components/TransactionForm';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/currency';
import { FONTS, SHADOWS, SIZES } from '../utils/theme';

const TransactionDetailScreen = ({ navigation, route }) => {
  const { transaction } = route.params;
  const { updateTransaction, deleteTransaction } = useFinance();
  const { theme, isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = (updatedTransaction) => {
    updateTransaction(transaction.id, updatedTransaction);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteTransaction(transaction.id);
            navigation.goBack();
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  if (isEditing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <TransactionForm
          transaction={transaction}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View
            style={[
              styles.typeTag,
              {
                backgroundColor:
                  transaction.type === 'income' ? theme.income : theme.expense,
              },
            ]}
          >
            <Text style={styles.typeText}>
              {transaction.type === 'income' ? 'Income' : 'Expense'}
            </Text>
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[styles.amountPrefix, { color: theme.text }]}>
            {transaction.type === 'income' ? '+' : '-'}
          </Text>
          <Text style={[styles.amount, { color: theme.text }]}>
            {formatCurrency(transaction.amount)}
          </Text>
        </View>

        <View style={[styles.detailsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Category</Text>
            <View style={styles.categoryContainer}>
              <MaterialCommunityIcons
                name={getCategoryIcon(transaction.category, transaction.type)}
                size={20}
                color={transaction.type === 'income' ? theme.income : theme.expense}
                style={styles.categoryIcon}
              />
              <Text style={[styles.detailValue, { color: theme.text }]}>{transaction.category}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Date</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {format(new Date(transaction.date), 'MMMM dd, yyyy')}
            </Text>
          </View>

          {transaction.note && (
            <>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Note</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{transaction.note}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.info }]}
            onPress={handleEdit}
          >
            <MaterialCommunityIcons name="pencil" size={20} color={theme.white} />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.error }]}
            onPress={handleDelete}
          >
            <MaterialCommunityIcons name="delete" size={20} color={theme.white} />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function to get category icon
const getCategoryIcon = (category, type) => {
  if (!category) {
    return type === 'income' ? 'cash-plus' : 'cash-minus';
  }

  const lowerCategory = category.toLowerCase();

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
    other: 'cash',
  };

  return categoryIcons[lowerCategory] || (type === 'income' ? 'cash-plus' : 'cash-minus');
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: SIZES.m,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.m,
  },
  typeTag: {
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.m,
    borderRadius: SIZES.radius,
  },
  typeText: {
    ...FONTS.medium,
    fontSize: 14,
    color: '#FFFFFF',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: SIZES.l,
  },
  amountPrefix: {
    ...FONTS.bold,
    fontSize: 24,
  },
  amount: {
    ...FONTS.bold,
    fontSize: 36,
    marginLeft: SIZES.xs,
  },
  detailsCard: {
    borderRadius: SIZES.radius,
    padding: SIZES.m,
    marginBottom: SIZES.m,
    borderWidth: 1,
    ...SHADOWS.small,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.s,
  },
  detailLabel: {
    ...FONTS.medium,
    fontSize: 16,
  },
  detailValue: {
    ...FONTS.regular,
    fontSize: 16,
    textAlign: 'right',
    flex: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  categoryIcon: {
    marginRight: SIZES.xs,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: SIZES.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.m,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.m,
    paddingHorizontal: SIZES.l,
    borderRadius: SIZES.radius,
    flex: 1,
    marginHorizontal: SIZES.xs,
  },
  actionButtonText: {
    ...FONTS.medium,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: SIZES.xs,
  },
});

export default TransactionDetailScreen; 