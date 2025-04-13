import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import BudgetForm from "../components/BudgetForm";
import { useFinance } from "../context/FinanceContext";
import { useTheme } from "../context/ThemeContext";

const EditBudgetScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { budget } = route.params;
  const { updateBudget } = useFinance();
  const { theme } = useTheme();

  const handleSubmit = (updatedBudgetData: any) => {
    // Preserve the id and createdAt from the original budget
    const updatedBudget = {
      ...budget,
      ...updatedBudgetData,
    };

    updateBudget(budget.id, updatedBudget);
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.formContainer}>
        <BudgetForm
          budget={budget}
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

export default EditBudgetScreen;
