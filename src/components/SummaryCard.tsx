import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/currency';

const SummaryCard: React.FC<{ title: any, amount: any, icon: any, color: any }> = ({ title, amount, icon, color }) => {
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.title, { color: theme.textSecondary }]}>{title}</Text>
      <Text style={[styles.amount, { color: theme.text }]}>{formatCurrency(amount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SummaryCard; 