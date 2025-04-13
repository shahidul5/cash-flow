import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ProgressBarAndroid, StyleSheet, Text, View } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/currency';

const BudgetCard: React.FC<{ budget: any, onPress: any }> = ({ budget, onPress }) => {
  const { theme, isDarkMode } = useTheme();
  const { calculateBudgetSpent } = useFinance();

  if (!budget) {
    return null;
  }

  const { name = 'Other', amount = 0, period = 'Monthly', icon = 'cash' } = budget;
  const spent = calculateBudgetSpent(budget);
  const percentage = Math.min(spent / amount, 1);
  const remaining = amount - spent;

  const getProgressColor = () => {
    if (percentage < 0.5) return theme.success;
    if (percentage < 0.75) return theme.warning;
    return theme.error;
  };

  const iconName = budget.icon || 'cash';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border
        }
      ]}
      onTouchEnd={onPress}
    >
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <View style={[styles.iconContainer, { backgroundColor: budget.color || getProgressColor() }]}>
            <MaterialCommunityIcons name={iconName} size={20} color={theme.white} />
          </View>
          <Text style={[styles.category, { color: theme.text }]}>{name}</Text>
        </View>
        <Text style={[styles.period, { color: theme.textSecondary }]}>{period}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.spent, { color: theme.text }]}>
          {formatCurrency(spent)} <Text style={[styles.total, { color: theme.textSecondary }]}>/ {formatCurrency(amount)}</Text>
        </Text>
        <Text style={[
          styles.remaining,
          {
            color: remaining >= 0 ? theme.textSecondary : theme.error
          }
        ]}>
          {remaining >= 0 ? `${formatCurrency(remaining)} remaining` : `${formatCurrency(Math.abs(remaining))} over budget`}
        </Text>
      </View>

      <ProgressBarAndroid
        styleAttr="Horizontal"
        indeterminate={false}
        progress={percentage}
        color={getProgressColor()}
        style={styles.progressBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: '500',
  },
  period: {
    fontSize: 12,
  },
  amountContainer: {
    marginBottom: 8,
  },
  spent: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  remaining: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

export default BudgetCard; 