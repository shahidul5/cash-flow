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

const AddBankScreen = ({ navigation }) => {
  const { addBankAccount } = useFinance();
  const { theme, isDarkMode } = useTheme();
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Bank name is required';
    }

    if (balance && isNaN(parseFloat(balance))) {
      newErrors.balance = 'Balance must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const newAccount = {
        name: name.trim(),
        accountNumber: accountNumber.trim(),
        balance: balance ? parseFloat(balance).toFixed(2) : '0.00',
      };

      addBankAccount(newAccount);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={[styles.formContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.text }]}>Bank Name</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  color: theme.text, 
                  borderColor: errors.name ? theme.error : theme.border, 
                  backgroundColor: isDarkMode ? theme.cardBackground : theme.white 
                }
              ]}
              placeholder="Enter bank name"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
            />
            {errors.name && <Text style={[styles.errorText, { color: theme.error }]}>{errors.name}</Text>}

            <Text style={[styles.label, { color: theme.text }]}>Account Number (Optional)</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  color: theme.text, 
                  borderColor: theme.border, 
                  backgroundColor: isDarkMode ? theme.cardBackground : theme.white 
                }
              ]}
              placeholder="Enter account number"
              placeholderTextColor={theme.textSecondary}
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
            />

            <Text style={[styles.label, { color: theme.text }]}>Initial Balance</Text>
            <View style={styles.amountInputContainer}>
              <Text style={[styles.currencySymbol, { color: theme.text }]}>{CURRENCY_SYMBOL}</Text>
              <TextInput
                style={[
                  styles.amountInput,
                  { 
                    color: theme.text, 
                    borderColor: errors.balance ? theme.error : theme.border, 
                    backgroundColor: isDarkMode ? theme.cardBackground : theme.white 
                  }
                ]}
                placeholder="0.00"
                placeholderTextColor={theme.textSecondary}
                value={balance}
                onChangeText={setBalance}
                keyboardType="numeric"
              />
            </View>
            {errors.balance && <Text style={[styles.errorText, { color: theme.error }]}>{errors.balance}</Text>}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
            >
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Add Account</Text>
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
  formContainer: {
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: SIZES.m,
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
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.m,
  },
  currencySymbol: {
    ...FONTS.bold,
    fontSize: 18,
    marginRight: SIZES.xs,
  },
  amountInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.m,
    fontSize: 16,
  },
  errorText: {
    ...FONTS.regular,
    fontSize: 12,
    marginTop: -SIZES.s,
    marginBottom: SIZES.s,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.xl,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SIZES.xs,
  },
  cancelButton: {
    borderWidth: 1,
  },
  submitButton: {
    borderWidth: 0,
  },
  buttonText: {
    ...FONTS.medium,
    fontSize: 16,
  },
});

export default AddBankScreen; 