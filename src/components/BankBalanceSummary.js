import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/currency';
import { FONTS, SHADOWS, SIZES } from '../utils/theme';

const BankBalanceSummary = () => {
  const { bankAccounts, getTotalBankBalance } = useFinance();
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Get top 3 banks by balance
  const topBanks = [...bankAccounts]
    .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
    .slice(0, 3);

  const handleViewAll = () => {
    navigation.navigate('BankTab');
  };

  const handleBankPress = (bankId) => {
    navigation.navigate('BankTab', {
      screen: 'BankDetail',
      params: { bankId }
    });
  };

  if (bankAccounts.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="bank" size={20} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>Bank Accounts</Text>
        </View>
        <TouchableOpacity onPress={handleViewAll} style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
          <MaterialCommunityIcons name="chevron-right" size={16} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.totalContainer, { backgroundColor: theme.backgroundSecondary }]}>
        <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Total Bank Balance</Text>
        <Text style={[styles.totalAmount, { color: theme.text }]}>
          {formatCurrency(getTotalBankBalance())}
        </Text>
      </View>

      {topBanks.map((bank) => (
        <TouchableOpacity
          key={bank.id}
          style={[styles.bankItem, { borderBottomColor: theme.border }]}
          onPress={() => handleBankPress(bank.id)}
        >
          <View style={styles.bankInfo}>
            <View style={[styles.bankIconContainer, { backgroundColor: theme.primary }]}>
              <MaterialCommunityIcons name="bank" size={16} color="#FFFFFF" />
            </View>
            <Text style={[styles.bankName, { color: theme.text }]} numberOfLines={1}>
              {bank.name}
            </Text>
          </View>
          <Text style={[styles.bankBalance, { color: theme.text }]}>
            {formatCurrency(bank.balance)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    ...SHADOWS.small,
    width: '92%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.m,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: 16,
    marginLeft: SIZES.xs,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    ...FONTS.medium,
    fontSize: 12,
    marginRight: 2,
  },
  totalContainer: {
    padding: SIZES.m,
    marginHorizontal: SIZES.m,
    marginBottom: SIZES.m,
    borderRadius: SIZES.radius,
  },
  totalLabel: {
    ...FONTS.regular,
    fontSize: 12,
    marginBottom: SIZES.xs,
  },
  totalAmount: {
    ...FONTS.bold,
    fontSize: 20,
  },
  bankItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.s,
    paddingHorizontal: SIZES.m,
    borderBottomWidth: 1,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.xs,
  },
  bankName: {
    ...FONTS.medium,
    fontSize: 14,
    flex: 1,
  },
  bankBalance: {
    ...FONTS.bold,
    fontSize: 14,
  },
});

export default BankBalanceSummary; 