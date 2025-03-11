import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import IncomeCategoryForm from '../components/IncomeCategoryForm';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';

const AddIncomeCategoryScreen = ({ navigation }) => {
  const { addIncomeCategory } = useFinance();
  const { theme } = useTheme();

  const handleSubmit = (category) => {
    addIncomeCategory(category);
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.formContainer}>
        <IncomeCategoryForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
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

export default AddIncomeCategoryScreen; 