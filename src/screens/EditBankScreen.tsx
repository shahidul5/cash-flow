import React, { useEffect, useState } from 'react';
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
import { FONTS, SIZES } from '../utils/theme';

const EditBankScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const { bankId } = route.params;
  const { bankAccounts, updateBankAccount } = useFinance();
  const { theme } = useTheme();

  const [name, setName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, any>>({});

  useEffect(() => {
    const bank = bankAccounts.find(b => b.id === bankId);
    if (bank) {
      setName(bank.name);
      setAccountNumber(bank.accountNumber || '');
    } else {
      Alert.alert(
        'Error',
        'Bank account not found',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [bankId, bankAccounts]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Bank name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const bank = bankAccounts.find(b => b.id === bankId);
      if (bank) {
        const updatedBank = {
          ...bank,
          name: name.trim(),
          accountNumber: accountNumber.trim(),
        };

        updateBankAccount(updatedBank);
        navigation.goBack();
      }
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
                { color: theme.text, borderColor: errors.name ? theme.error : theme.border, backgroundColor: theme.background }
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
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }
              ]}
              placeholder="Enter account number"
              placeholderTextColor={theme.textSecondary}
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
            />
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
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Save Changes</Text>
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

export default EditBankScreen; 