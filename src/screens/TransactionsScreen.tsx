import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import TransactionCard from '../components/TransactionCard';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { FONTS, SHADOWS, SIZES } from '../utils/theme';

const TransactionsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { transactions, isLoading, deleteTransaction } = useFinance(); // Changed loading to isLoading
  const { theme, isDarkMode } = useTheme();
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<any>('all');
  const [showFabMenu, setShowFabMenu] = useState<boolean>(false);

  useEffect(() => {
    filterTransactions(activeFilter);
  }, [transactions, activeFilter]);

  const filterTransactions = (filter: any) => {
    switch (filter) {
      case 'income':
        setFilteredTransactions(
          transactions.filter(t =>
            t.type === 'income' &&
            t.category !== 'Transfer' &&
            t.category !== 'Bank Transfer'
          )
        );
        break;
      case 'expense':
        setFilteredTransactions(
          transactions.filter(t =>
            t.type === 'expense' &&
            t.category !== 'Transfer' &&
            t.category !== 'Bank Transfer'
          )
        );
        break;
      case 'transfers':
        setFilteredTransactions(
          transactions.filter(t =>
            t.category === 'Transfer' ||
            t.category === 'Bank Transfer'
          )
        );
        break;
      case 'cash_additions':
        setFilteredTransactions(
          transactions.filter(t => t.type === 'cash_addition')
        );
        break;
      case 'all':
      default:
        setFilteredTransactions([...transactions]);
        break;
    }
  };

  const handleDeleteTransaction = (id: any) => {
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
          onPress: () => deleteTransaction(id),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const renderEmptyList = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
      <MaterialCommunityIcons
        name={activeFilter === 'transfers' ? 'bank-transfer' : 'cash-remove'}
        size={64}
        color={theme.textSecondary}
      />
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        {activeFilter === 'transfers'
          ? 'No transfers found'
          : 'No transactions found'}
      </Text>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => {
          if (activeFilter === 'transfers') {
            navigation.navigate('BankTab', { screen: 'Transfer' });
          } else {
            navigation.navigate('AddTransaction');
          }
        }}
      >
        <Text style={styles.addButtonText}>
          {activeFilter === 'transfers' ? 'Make Transfer' : 'Add Transaction'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFabMenu = () => (
    <Modal
      transparent={true}
      visible={showFabMenu}
      animationType="fade"
      onRequestClose={() => setShowFabMenu(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowFabMenu(false)}
      >
        <View style={[styles.fabMenu, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity
            style={styles.fabMenuItem}
            onPress={() => {
              setShowFabMenu(false);
              navigation.navigate('AddTransaction');
            }}
          >
            <MaterialCommunityIcons name="cash-plus" size={24} color={theme.income} />
            <Text style={[styles.fabMenuItemText, { color: theme.text }]}>Add Transaction</Text>
          </TouchableOpacity>

          <View style={[styles.fabMenuDivider, { backgroundColor: theme.border }]} />

          <TouchableOpacity
            style={styles.fabMenuItem}
            onPress={() => {
              setShowFabMenu(false);
              navigation.navigate('BankTab', { screen: 'Transfer' });
            }}
          >
            <MaterialCommunityIcons name="bank-transfer" size={24} color={theme.info} />
            <Text style={[styles.fabMenuItemText, { color: theme.text }]}>Make Transfer</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (isLoading) { // Changed loading to isLoading
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.filterContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { borderColor: theme.border, backgroundColor: activeFilter === 'all' ? theme.primary : 'transparent' },
          ]}
          onPress={() => setActiveFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'all' ? theme.white : theme.text },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              borderColor: theme.border,
              backgroundColor: activeFilter === 'income' ? theme.income : 'transparent'
            },
          ]}
          onPress={() => setActiveFilter('income')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'income' ? theme.white : theme.text },
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              borderColor: theme.border,
              backgroundColor: activeFilter === 'expense' ? theme.expense : 'transparent'
            },
          ]}
          onPress={() => setActiveFilter('expense')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'expense' ? theme.white : theme.text },
            ]}
          >
            Expenses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              borderColor: theme.border,
              backgroundColor: activeFilter === 'transfers' ? theme.info : 'transparent'
            },
          ]}
          onPress={() => setActiveFilter('transfers')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'transfers' ? theme.white : theme.text },
            ]}
          >
            Transfers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              borderColor: theme.border,
              backgroundColor: activeFilter === 'cash_additions' ? theme.warning : 'transparent'
            },
          ]}
          onPress={() => setActiveFilter('cash_additions')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'cash_additions' ? theme.white : theme.text },
            ]}
          >
            Cash
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
          >
            <TransactionCard transaction={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
      />

      {renderFabMenu()}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => {
          if (activeFilter === 'transfers') {
            navigation.navigate('BankTab', { screen: 'Transfer' });
          } else {
            setShowFabMenu(true);
          }
        }}
      >
        <MaterialCommunityIcons
          name={activeFilter === 'transfers' ? 'bank-transfer' : 'plus'}
          size={24}
          color={theme.white}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: SIZES.m,
    ...SHADOWS.small,
  },
  filterButton: {
    flex: 1,
    paddingVertical: SIZES.s,
    alignItems: 'center',
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.xs / 2,
    borderWidth: 1,
  },
  filterText: {
    ...FONTS.medium,
    fontSize: 13,
    fontWeight: "500" as const, // Ensure fontWeight is a valid type
  },
  listContent: {
    padding: SIZES.m,
    paddingBottom: SIZES.xxxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.xl,
    borderRadius: SIZES.radius,
  },
  emptyText: {
    ...FONTS.medium,
    fontSize: 16,
    marginTop: SIZES.m,
    marginBottom: SIZES.m,
    fontWeight: "500" as const, // Add this line with type assertion
  },
  addButton: {
    paddingVertical: SIZES.s,
    paddingHorizontal: SIZES.m,
    borderRadius: SIZES.radius,
  },
  addButtonText: {
    ...FONTS.medium,
    fontSize: 14,
    fontWeight: "500" as const, // Ensure fontWeight is a valid type
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: SIZES.xl,
  },
  fabMenu: {
    width: 200,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 70,
    marginRight: 4,
    ...SHADOWS.medium,
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.m,
  },
  fabMenuItemText: {
    ...FONTS.medium,
    fontSize: 14,
    marginLeft: SIZES.s,
  },
  fabMenuDivider: {
    height: 1,
    width: '100%',
  },
});

export default TransactionsScreen; 