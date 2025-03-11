import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import TransactionForm from '../components/TransactionForm';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';

const AddTransactionScreen = ({ navigation, route }) => {
  const { addTransaction } = useFinance();
  const { theme } = useTheme();

  // Get initial transaction type and payment method from route params if available
  const initialType = route.params?.type || 'expense';
  const initialPaymentMethod = route.params?.paymentMethod || 'cash';

  const handleSubmit = (transaction) => {
    addTransaction(transaction);
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.formContainer}>
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialType={initialType}
          initialPaymentMethod={initialPaymentMethod}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
  },
});

export default AddTransactionScreen; 