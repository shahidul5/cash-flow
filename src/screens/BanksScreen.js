import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/currency';
import { FONTS, SHADOWS, SIZES } from '../utils/theme';

const BanksScreen = ({ navigation }) => {
  const { bankAccounts, deleteBankAccount, getTotalBankBalance, isLoading } = useFinance();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleDeleteAccount = (account) => {
    Alert.alert(
      'Delete Bank Account',
      `Are you sure you want to delete the "${account.name}" account?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteBankAccount(account.id),
        },
      ]
    );
  };

  const handleAddBank = () => {
    navigation.navigate('AddBank');
  };

  const handleBankPress = (bankId) => {
    navigation.navigate('BankDetail', { bankId });
  };

  const handleEditBank = (bankId) => {
    navigation.navigate('EditBank', { bankId });
  };

  const renderBankCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.bankCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => handleBankPress(item.id)}
    >
      <View style={styles.bankCardHeader}>
        <View style={styles.bankInfo}>
          <View style={[styles.bankIconContainer, { backgroundColor: theme.primary }]}>
            <MaterialCommunityIcons name="bank" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.bankDetails}>
            <Text style={[styles.bankName, { color: theme.text }]}>{item.name}</Text>
            <Text style={[styles.accountNumber, { color: theme.textSecondary }]}>
              {item.accountNumber ? `•••• ${item.accountNumber.slice(-4)}` : 'No account number'}
            </Text>
          </View>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Balance</Text>
          <Text style={[styles.balanceAmount, { color: theme.text }]}>
            {formatCurrency(item.balance || 0)}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.info }]}
          onPress={() => handleBankPress(item.id)}
        >
          <MaterialCommunityIcons name="cash-plus" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Update Balance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() => handleEditBank(item.id)}
        >
          <MaterialCommunityIcons name="pencil" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.error }]}
          onPress={() => handleDeleteAccount(item)}
        >
          <MaterialCommunityIcons name="delete" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <MaterialCommunityIcons name="bank-off" size={64} color={theme.textSecondary} />
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        No bank accounts found
      </Text>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={handleAddBank}
      >
        <Text style={styles.addButtonText}>Add Bank Account</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {bankAccounts.length > 0 && (
        <View style={[styles.totalBalanceContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.totalBalanceLabel, { color: theme.textSecondary }]}>
            Total Balance
          </Text>
          <Text style={[styles.totalBalanceAmount, { color: theme.text }]}>
            {formatCurrency(getTotalBankBalance())}
          </Text>

          <TouchableOpacity
            style={[styles.transferButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Transfer')}
          >
            <MaterialCommunityIcons name="bank-transfer" size={16} color="#FFFFFF" />
            <Text style={styles.transferButtonText}>Transfer Money</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={bankAccounts}
        renderItem={renderBankCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={handleAddBank}
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
    padding: SIZES.m,
    paddingBottom: SIZES.xxxl,
  },
  totalBalanceContainer: {
    margin: SIZES.m,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  totalBalanceLabel: {
    ...FONTS.medium,
    fontSize: 14,
    marginBottom: SIZES.xs,
  },
  totalBalanceAmount: {
    ...FONTS.bold,
    fontSize: 28,
    marginBottom: SIZES.m,
  },
  transferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.s,
    paddingHorizontal: SIZES.m,
    borderRadius: SIZES.radius,
    marginTop: SIZES.s,
  },
  transferButtonText: {
    ...FONTS.medium,
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: SIZES.xs,
  },
  bankCard: {
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: SIZES.m,
    overflow: 'hidden',
  },
  bankCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.m,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.s,
  },
  bankDetails: {
    justifyContent: 'center',
  },
  bankName: {
    ...FONTS.bold,
    fontSize: 16,
    marginBottom: 2,
  },
  accountNumber: {
    ...FONTS.regular,
    fontSize: 12,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    ...FONTS.regular,
    fontSize: 12,
    marginBottom: 2,
  },
  balanceAmount: {
    ...FONTS.bold,
    fontSize: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.s,
  },
  actionButtonText: {
    ...FONTS.medium,
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  emptyContainer: {
    padding: SIZES.xl,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.xl,
  },
  emptyText: {
    ...FONTS.medium,
    fontSize: 16,
    marginTop: SIZES.m,
    marginBottom: SIZES.m,
    textAlign: 'center',
  },
  addButton: {
    paddingVertical: SIZES.s,
    paddingHorizontal: SIZES.m,
    borderRadius: SIZES.radius,
  },
  addButtonText: {
    ...FONTS.medium,
    fontSize: 14,
    color: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    bottom: SIZES.xl,
    right: SIZES.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
});

export default BanksScreen; 