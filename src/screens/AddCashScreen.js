import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
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

const AddCashScreen = ({ navigation }) => {
  const { addTransaction } = useFinance();
  const { theme, isDarkMode } = useTheme();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Add a new income transaction with "Cash Addition" category
      addTransaction({
        type: 'income',
        amount: parseFloat(amount),
        category: 'Cash Addition',
        note: note || 'Cash added to wallet',
        paymentMethod: 'cash',
        bankId: null,
      });
      navigation.goBack();
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView>
          <View style={styles.header}>
            <MaterialCommunityIcons name="cash-plus" size={40} color={theme.income} />
            <Text style={[styles.headerText, { color: theme.text }]}>Add Cash</Text>
          </View>

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

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: theme.border }]}
              onPress={handleCancel}
            >
              <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.income }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Add Cash</Text>
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
    padding: SIZES.m,
  },
  header: {
    alignItems: 'center',
    marginVertical: SIZES.xl,
  },
  headerText: {
    ...FONTS.bold,
    fontSize: 24,
    marginTop: SIZES.s,
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
  noteInput: {
    ...FONTS.regular,
    fontSize: 16,
    padding: SIZES.m,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    minHeight: 100,
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
  submitButton: {
    flex: 2,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  submitButtonText: {
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

export default AddCashScreen; 