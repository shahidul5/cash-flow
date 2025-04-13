import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/currency';
import { FONTS, SIZES } from '../utils/theme';

const BankDetailScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const { bankId } = route.params;
  const { bankAccounts, updateBankBalance, deleteBankAccount } = useFinance();
  const { theme } = useTheme();

  const bank = bankAccounts.find(b => b.id === bankId);

  const [amount, setAmount] = useState<string>('');
  const [transactionType, setTransactionType] = useState<any>('deposit'); // 'deposit' or 'withdraw'
  const [errors, setErrors] = useState<Record<string, any>>({});

  if (!bank) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.error }]}>Bank account not found</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const validateForm = () => {
    const newErrors = {};

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than zero';
    }

    if (transactionType === 'withdraw' && parseFloat(amount) > parseFloat(bank.balance)) {
      newErrors.amount = 'Withdrawal amount cannot exceed current balance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateBalance = () => {
    if (validateForm()) {
      const amountValue = parseFloat(amount);
      updateBankBalance(bank.id, transactionType === 'deposit' ? amountValue : -amountValue);
      setAmount('');
      Alert.alert(
        'Success',
        `Balance ${transactionType === 'deposit' ? 'deposited' : 'withdrawn'} successfully`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete the account "${bank.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBankAccount(bank.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleEditAccount = () => {
    navigation.navigate('EditBank', { bankId: bank.id });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          {/* Bank Details Card */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.bankHeader}>
              <View style={styles.bankIconContainer}>
                <MaterialCommunityIcons name="bank" size={32} color={theme.primary} />
              </View>
              <View style={styles.bankInfo}>
                <Text style={[styles.bankName, { color: theme.text }]}>{bank.name}</Text>
                {bank.accountNumber && (
                  <Text style={[styles.accountNumber, { color: theme.textSecondary }]}>
                    Account: {bank.accountNumber}
                  </Text>
                )}
              </View>
            </View>

            <View style={[styles.balanceContainer, { backgroundColor: theme.backgroundSecondary }]}>
              <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Current Balance</Text>
              <Text style={[styles.balanceAmount, { color: theme.text }]}>
                {formatCurrency(bank.balance)}
              </Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { borderColor: theme.border }]}
                onPress={handleEditAccount}
              >
                <MaterialCommunityIcons name="pencil" size={20} color={theme.primary} />
                <Text style={[styles.actionButtonText, { color: theme.text }]}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { borderColor: theme.border }]}
                onPress={handleDeleteAccount}
              >
                <MaterialCommunityIcons name="delete" size={20} color={theme.error} />
                <Text style={[styles.actionButtonText, { color: theme.error }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Update Balance Form */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Update Balance</Text>

            <View style={styles.transactionTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.transactionTypeButton,
                  transactionType === 'deposit' && { backgroundColor: theme.primary },
                  { borderColor: theme.border }
                ]}
                onPress={() => setTransactionType('deposit')}
              >
                <MaterialCommunityIcons
                  name="arrow-down"
                  size={20}
                  color={transactionType === 'deposit' ? '#FFFFFF' : theme.text}
                />
                <Text
                  style={[
                    styles.transactionTypeText,
                    { color: transactionType === 'deposit' ? '#FFFFFF' : theme.text }
                  ]}
                >
                  Deposit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.transactionTypeButton,
                  transactionType === 'withdraw' && { backgroundColor: theme.primary },
                  { borderColor: theme.border }
                ]}
                onPress={() => setTransactionType('withdraw')}
              >
                <MaterialCommunityIcons
                  name="arrow-up"
                  size={20}
                  color={transactionType === 'withdraw' ? '#FFFFFF' : theme.text}
                />
                <Text
                  style={[
                    styles.transactionTypeText,
                    { color: transactionType === 'withdraw' ? '#FFFFFF' : theme.text }
                  ]}
                >
                  Withdraw
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: theme.text }]}>Amount</Text>
            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: errors.amount ? theme.error : theme.border, backgroundColor: theme.background }
              ]}
              placeholder="Enter amount"
              placeholderTextColor={theme.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            {errors.amount && <Text style={[styles.errorText, { color: theme.error }]}>{errors.amount}</Text>}

            <TouchableOpacity
              style={[styles.updateButton, { backgroundColor: theme.primary }]}
              onPress={handleUpdateBalance}
            >
              <Text style={[styles.updateButtonText, { color: '#FFFFFF' }]}>
                {transactionType === 'deposit' ? 'Deposit' : 'Withdraw'} Funds
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: SIZES.m,
  },
  card: {
    borderRadius: SIZES.radius,
    borderWidth: 1,
    padding: SIZES.m,
    marginBottom: SIZES.m,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.m,
  },
  bankIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.m,
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    ...FONTS.bold,
    fontSize: 18,
    marginBottom: SIZES.xs,
  },
  accountNumber: {
    ...FONTS.regular,
    fontSize: 14,
  },
  balanceContainer: {
    borderRadius: SIZES.radius,
    padding: SIZES.m,
    marginBottom: SIZES.m,
  },
  balanceLabel: {
    ...FONTS.regular,
    fontSize: 14,
    marginBottom: SIZES.xs,
  },
  balanceAmount: {
    ...FONTS.bold,
    fontSize: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.s,
    paddingHorizontal: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    minWidth: 100,
  },
  actionButtonText: {
    ...FONTS.medium,
    fontSize: 14,
    marginLeft: SIZES.xs,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: 18,
    marginBottom: SIZES.m,
  },
  transactionTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.m,
  },
  transactionTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.s,
    paddingHorizontal: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: SIZES.xs,
  },
  transactionTypeText: {
    ...FONTS.medium,
    fontSize: 14,
    marginLeft: SIZES.xs,
  },
  label: {
    ...FONTS.medium,
    fontSize: 14,
    marginBottom: SIZES.xs,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.m,
    marginBottom: SIZES.m,
    fontSize: 16,
  },
  errorText: {
    ...FONTS.regular,
    fontSize: 12,
    marginTop: -SIZES.s,
    marginBottom: SIZES.s,
  },
  updateButton: {
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    ...FONTS.medium,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.m,
  },
  button: {
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
    marginTop: SIZES.m,
  },
  buttonText: {
    ...FONTS.medium,
    fontSize: 16,
  },
});

export default BankDetailScreen; 