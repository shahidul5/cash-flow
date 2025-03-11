import React from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import IncomeCategoryForm from '../components/IncomeCategoryForm';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';

const EditIncomeCategoryScreen = ({ navigation, route }) => {
  const { category } = route.params;
  const { updateIncomeCategory } = useFinance();
  const { theme } = useTheme();

  // Don't allow editing default categories
  if (category.isDefault) {
    Alert.alert(
      'Cannot Edit',
      'Default categories cannot be edited.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  }

  const handleSubmit = (updatedCategory) => {
    // Preserve the id and isDefault status
    const finalCategory = {
      ...category,
      ...updatedCategory,
    };

    updateIncomeCategory(finalCategory);
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.formContainer}>
        <IncomeCategoryForm
          category={category}
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

export default EditIncomeCategoryScreen; 