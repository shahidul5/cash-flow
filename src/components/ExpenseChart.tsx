import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useTheme } from "../context/ThemeContext";
import { formatCurrency } from "../utils/currency";

const screenWidth = Dimensions.get("window").width;

// Define transaction type
type Transaction = {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
};

// Define category colors type
type CategoryColors = {
  [key: string]: string;
};

const ExpenseChart: React.FC<{ transactions: Transaction[] }> = ({
  transactions,
}) => {
  const { theme, isDarkMode } = useTheme();

  // Filter only expense transactions
  const expenses = transactions
    ? transactions.filter((t: Transaction) => t && t.type === "expense")
    : [];

  // Group expenses by category and calculate totals
  const expensesByCategory = expenses.reduce<Record<string, number>>(
    (acc, transaction) => {
      if (!transaction || !transaction.category) return acc;

      const { category, amount } = transaction;
      const categoryKey = typeof category === "string" ? category : "other";

      if (!acc[categoryKey]) {
        acc[categoryKey] = 0;
      }
      acc[categoryKey] += amount;
      return acc;
    },
    {}
  );

  // Define colors for categories
  const categoryColors: CategoryColors = {
    food: "#FF5722",
    transportation: "#2196F3",
    housing: "#9C27B0",
    utilities: "#FFC107",
    entertainment: "#4CAF50",
    shopping: "#E91E63",
    health: "#00BCD4",
    education: "#3F51B5",
    travel: "#8BC34A",
    personal: "#795548",
    gifts: "#FF9800",
    other: "#607D8B",
  };

  // Prepare data for pie chart
  const chartData = Object.keys(expensesByCategory).map((category) => {
    const categoryKey = category.toLowerCase();
    return {
      name: category,
      amount: expensesByCategory[category],
      color: categoryColors[categoryKey as keyof CategoryColors] || "#607D8B",
      legendFontColor: theme.text,
      legendFontSize: 12,
    };
  });

  // Sort by amount (highest first)
  chartData.sort((a, b) => b.amount - a.amount);

  // Calculate total expenses
  const totalExpenses = chartData.reduce((sum, item) => sum + item.amount, 0);

  // If no expenses, show empty state
  if (expenses.length === 0 || totalExpenses === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          No expenses to display
        </Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: theme.cardBackground,
    backgroundGradientTo: theme.cardBackground,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={screenWidth - 64}
        height={180}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend={true}
      />

      <View style={styles.totalContainer}>
        <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
          Total Expenses
        </Text>
        <Text style={[styles.totalAmount, { color: theme.text }]}>
          {formatCurrency(totalExpenses)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 8,
  },
  emptyContainer: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  totalContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ExpenseChart;
