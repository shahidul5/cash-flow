import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import BudgetForm from "../components/BudgetForm";
import { useFinance } from "../context/FinanceContext";
import { COLORS } from "../utils/theme";

const AddBudgetScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { addBudget } = useFinance();

  const handleSubmit = (budget: any) => {
    addBudget(budget);
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <BudgetForm
          budget={null}
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
    backgroundColor: COLORS.background,
  },
  formContainer: {
    flex: 1,
  },
});

export default AddBudgetScreen;
