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
import { CURRENCY_SYMBOL } from '../utils/currency';
import { FONTS, SIZES } from '../utils/theme';

const TransferScreen = ({ navigation }) => {
  const { bankAccounts, updateBankBalance, addTransaction, calculateCashBalance } = useFinance();
  const { theme, isDarkMode } = useTheme();

  const [amount, setAmount] = useState('');
  const [fromType, setFromType] = useState('cash'); // 'cash' or 'bank'
  const [toType, setToType] = useState('bank'); // 'cash' or 'bank'
  const [fromBankId, setFromBankId] = useState('');
  const [toBankId, setToBankId] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (fromType === 'bank' && !fromBankId) {
      newErrors.fromBank = 'Please select a source bank account';
    }

    if (toType === 'bank' && !toBankId) {
      newErrors.toBank = 'Please select a destination bank account';
    }

    if (fromType === 'bank' && toType === 'bank' && fromBankId === toBankId) {
      newErrors.sameBank = 'Source and destination bank accounts cannot be the same';
    }

    // Check if source bank has sufficient balance
    if (fromType === 'bank' && fromBankId) {
      const sourceBank = bankAccounts.find(bank => bank.id === fromBankId);
      if (sourceBank && parseFloat(amount) > parseFloat(sourceBank.balance)) {
        newErrors.amount = 'Insufficient funds in source bank account';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTransfer = async () => {
    if (!validateForm()) return;

    const transferAmount = parseFloat(amount);

    try {
      // Handle the transfer based on source and destination types
      if (fromType === 'cash' && toType === 'bank') {
        // Transfer from cash to bank
        await updateBankBalance(toBankId, transferAmount, true); // Deposit to bank

        // Record as an expense transaction from cash
        await addTransaction({
          type: 'expense',
          amount: transferAmount,
          category: 'Transfer',
          note: note || `Transfer to ${bankAccounts.find(b => b.id === toBankId)?.name || 'bank account'}`,
          paymentMethod: 'cash',
          date: new Date().toISOString()
        });
      }
      else if (fromType === 'bank' && toType === 'cash') {
        // Transfer from bank to cash
        await updateBankBalance(fromBankId, transferAmount, false); // Withdraw from bank

        // Record as an income transaction to cash
        await addTransaction({
          type: 'income',
          amount: transferAmount,
          category: 'Transfer',
          note: note || `Transfer from ${bankAccounts.find(b => b.id === fromBankId)?.name || 'bank account'}`,
          paymentMethod: 'cash',
          date: new Date().toISOString()
        });
      }
      else if (fromType === 'bank' && toType === 'bank') {
        // Transfer between banks
        await updateBankBalance(fromBankId, transferAmount, false); // Withdraw from source bank
        await updateBankBalance(toBankId, transferAmount, true); // Deposit to destination bank

        // Record as a transfer note in transaction history
        await addTransaction({
          type: 'expense',
          amount: 0, // Zero amount as it's just a transfer between banks
          category: 'Bank Transfer',
          note: note || `Transfer from ${bankAccounts.find(b => b.id === fromBankId)?.name || 'bank account'} to ${bankAccounts.find(b => b.id === toBankId)?.name || 'bank account'}`,
          paymentMethod: 'bank',
          bankId: fromBankId,
          date: new Date().toISOString()
        });
      }

      Alert.alert(
        'Success',
        'Transfer completed successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Transfer error:', error);
      Alert.alert('Error', 'Failed to complete transfer. Please try again.');
    }
  };

  const renderBankSelection = (type, selectedBankId, setSelectedBankId, errorKey) => (
    <View style={styles.formGroup}>
      <Text style={[styles.label, { color: theme.text }]}>
        Select {type === 'from' ? 'Source' : 'Destination'} Bank Account
      </Text>
      <View style={styles.bankAccountContainer}>
        {bankAccounts.length > 0 ? (
          bankAccounts.map((bank) => (
            <TouchableOpacity
              key={bank.id}
              style={[
                styles.bankAccountButton,
                selectedBankId === bank.id && styles.activeBankAccountButton,
                {
                  borderColor: theme.border,
                  backgroundColor: selectedBankId === bank.id ? theme.primary : 'transparent'
                }
              ]}
              onPress={() => setSelectedBankId(bank.id)}
            >
              <MaterialCommunityIcons
                name="bank"
                size={20}
                color={selectedBankId === bank.id ? '#FFFFFF' : theme.text}
              />
              <View style={styles.bankAccountInfo}>
                <Text
                  style={[
                    styles.bankAccountName,
                    { color: selectedBankId === bank.id ? '#FFFFFF' : theme.text }
                  ]}
                  numberOfLines={1}
                >
                  {bank.name}
                </Text>
                <Text
                  style={[
                    styles.bankAccountBalance,
                    { color: selectedBankId === bank.id ? '#FFFFFF' : theme.textSecondary }
                  ]}
                >
                  {CURRENCY_SYMBOL}{parseFloat(bank.balance).toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={[styles.noBanksMessage, { borderColor: theme.border }]}>
            <Text style={[styles.noBanksText, { color: theme.textSecondary }]}>
              No bank accounts found. Please add a bank account first.
            </Text>
          </View>
        )}
      </View>
      {errors[errorKey] && <Text style={[styles.errorText, { color: theme.error }]}>{errors[errorKey]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>Transfer Money</Text>

            {/* Amount Input */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Amount</Text>
              <View style={[styles.amountInputContainer, {
                borderColor: errors.amount ? theme.error : theme.border,
                backgroundColor: isDarkMode ? theme.cardBackground : theme.white
              }]}>
                <Text style={[styles.currencySymbol, { color: theme.text }]}>{CURRENCY_SYMBOL}</Text>
                <TextInput
                  style={[styles.amountInput, {
                    color: theme.text,
                    backgroundColor: 'transparent'
                  }]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
              {errors.amount && <Text style={[styles.errorText, { color: theme.error }]}>{errors.amount}</Text>}
            </View>

            {/* From Selection */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>From</Text>
              <View style={styles.transferTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.transferTypeButton,
                    fromType === 'cash' && styles.activeTransferTypeButton,
                    {
                      borderColor: theme.border,
                      backgroundColor: fromType === 'cash' ? theme.primary : 'transparent'
                    }
                  ]}
                  onPress={() => setFromType('cash')}
                >
                  <MaterialCommunityIcons
                    name="cash"
                    size={20}
                    color={fromType === 'cash' ? '#FFFFFF' : theme.text}
                  />
                  <Text
                    style={[
                      styles.transferTypeText,
                      fromType === 'cash' && styles.activeTransferTypeText,
                      { color: fromType === 'cash' ? '#FFFFFF' : theme.text }
                    ]}
                  >
                    Cash
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.transferTypeButton,
                    fromType === 'bank' && styles.activeTransferTypeButton,
                    {
                      borderColor: theme.border,
                      backgroundColor: fromType === 'bank' ? theme.primary : 'transparent'
                    }
                  ]}
                  onPress={() => setFromType('bank')}
                >
                  <MaterialCommunityIcons
                    name="bank"
                    size={20}
                    color={fromType === 'bank' ? '#FFFFFF' : theme.text}
                  />
                  <Text
                    style={[
                      styles.transferTypeText,
                      fromType === 'bank' && styles.activeTransferTypeText,
                      { color: fromType === 'bank' ? '#FFFFFF' : theme.text }
                    ]}
                  >
                    Bank Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* From Bank Selection (if bank is selected as source) */}
            {fromType === 'bank' && renderBankSelection('from', fromBankId, setFromBankId, 'fromBank')}

            {/* To Selection */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>To</Text>
              <View style={styles.transferTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.transferTypeButton,
                    toType === 'cash' && styles.activeTransferTypeButton,
                    {
                      borderColor: theme.border,
                      backgroundColor: toType === 'cash' ? theme.primary : 'transparent'
                    }
                  ]}
                  onPress={() => setToType('cash')}
                >
                  <MaterialCommunityIcons
                    name="cash"
                    size={20}
                    color={toType === 'cash' ? '#FFFFFF' : theme.text}
                  />
                  <Text
                    style={[
                      styles.transferTypeText,
                      toType === 'cash' && styles.activeTransferTypeText,
                      { color: toType === 'cash' ? '#FFFFFF' : theme.text }
                    ]}
                  >
                    Cash
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.transferTypeButton,
                    toType === 'bank' && styles.activeTransferTypeButton,
                    {
                      borderColor: theme.border,
                      backgroundColor: toType === 'bank' ? theme.primary : 'transparent'
                    }
                  ]}
                  onPress={() => setToType('bank')}
                >
                  <MaterialCommunityIcons
                    name="bank"
                    size={20}
                    color={toType === 'bank' ? '#FFFFFF' : theme.text}
                  />
                  <Text
                    style={[
                      styles.transferTypeText,
                      toType === 'bank' && styles.activeTransferTypeText,
                      { color: toType === 'bank' ? '#FFFFFF' : theme.text }
                    ]}
                  >
                    Bank Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* To Bank Selection (if bank is selected as destination) */}
            {toType === 'bank' && renderBankSelection('to', toBankId, setToBankId, 'toBank')}

            {/* Same Bank Error */}
            {errors.sameBank && (
              <Text style={[styles.errorText, { color: theme.error, textAlign: 'center', marginBottom: SIZES.m }]}>
                {errors.sameBank}
              </Text>
            )}

            {/* Note Input */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Note (Optional)</Text>
              <TextInput
                style={[styles.noteInput, {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: isDarkMode ? theme.cardBackground : theme.white
                }]}
                value={note}
                onChangeText={setNote}
                placeholder="Add a note"
                placeholderTextColor={theme.textSecondary}
                multiline
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: theme.border }]}
                onPress={() => navigation.goBack()}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.transferButton, { backgroundColor: theme.primary }]}
                onPress={handleTransfer}
              >
                <Text style={styles.transferButtonText}>Transfer</Text>
              </TouchableOpacity>
            </View>
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
  },
  title: {
    ...FONTS.bold,
    fontSize: 20,
    marginBottom: SIZES.m,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: SIZES.m,
  },
  label: {
    ...FONTS.medium,
    fontSize: 14,
    marginBottom: SIZES.xs,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.m,
  },
  currencySymbol: {
    ...FONTS.medium,
    fontSize: 18,
    marginRight: SIZES.xs,
  },
  amountInput: {
    ...FONTS.regular,
    fontSize: 18,
    padding: SIZES.m,
    flex: 1,
  },
  transferTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transferTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginHorizontal: SIZES.xs,
  },
  activeTransferTypeButton: {
    borderWidth: 0,
  },
  transferTypeText: {
    ...FONTS.medium,
    fontSize: 14,
    marginLeft: SIZES.xs,
  },
  activeTransferTypeText: {
    color: '#FFFFFF',
  },
  bankAccountContainer: {
    marginTop: SIZES.xs,
  },
  bankAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: SIZES.s,
  },
  activeBankAccountButton: {
    borderWidth: 0,
  },
  bankAccountInfo: {
    flex: 1,
    marginLeft: SIZES.s,
  },
  bankAccountName: {
    ...FONTS.medium,
    fontSize: 14,
  },
  bankAccountBalance: {
    ...FONTS.regular,
    fontSize: 12,
    marginTop: 2,
  },
  noBanksMessage: {
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  noBanksText: {
    ...FONTS.regular,
    fontSize: 14,
    textAlign: 'center',
  },
  noteInput: {
    ...FONTS.regular,
    fontSize: 16,
    padding: SIZES.m,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: SIZES.m,
  },
  cancelButton: {
    flex: 1,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginRight: SIZES.s,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...FONTS.medium,
    fontSize: 16,
  },
  transferButton: {
    flex: 2,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  transferButtonText: {
    ...FONTS.medium,
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorText: {
    ...FONTS.regular,
    fontSize: 12,
    marginTop: SIZES.xs,
  },
});

export default TransferScreen; 