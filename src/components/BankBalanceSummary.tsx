import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFinance } from "../context/FinanceContext";
import { useTheme } from "../context/ThemeContext";
import { formatCurrency } from "../utils/currency";
import { FONTS, SHADOWS, SIZES } from "../utils/theme";

// Define navigation type
type BankNavigationProp = StackNavigationProp<any>;

const BankBalanceSummary = () => {
  const { bankAccounts, getTotalBankBalance } = useFinance();
  const { theme } = useTheme();
  const navigation = useNavigation<BankNavigationProp>();

  // Get top 3 banks by balance
  const topBanks = [...bankAccounts]
    .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
    .slice(0, 3);

  const handleViewAll = () => {
    navigation.navigate("BankTab");
  };

  const handleBankPress = (bankId: string) => {
    navigation.navigate("BankTab", {
      screen: "BankDetail",
      params: { bankId },
    });
  };

  if (bankAccounts.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="bank" size={20} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>
            Bank Accounts
          </Text>
        </View>
        <TouchableOpacity onPress={handleViewAll} style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: theme.primary }]}>
            View All
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={16}
            color={theme.primary}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.totalContainer,
          { backgroundColor: theme.cardBackground || theme.card },
        ]}
      >
        <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
          Total Bank Balance
        </Text>
        <Text style={[styles.totalAmount, { color: theme.text }]}>
          {formatCurrency(getTotalBankBalance())}
        </Text>
      </View>

      {topBanks.map((bank) => (
        <TouchableOpacity
          key={bank.id}
          style={[styles.bankItem, { borderBottomColor: theme.border }]}
          onPress={() => handleBankPress(bank.id)}
        >
          <View style={styles.bankInfo}>
            <View
              style={[
                styles.bankIconContainer,
                { backgroundColor: theme.primary },
              ]}
            >
              <MaterialCommunityIcons name="bank" size={16} color="#FFFFFF" />
            </View>
            <Text
              style={[styles.bankName, { color: theme.text }]}
              numberOfLines={1}
            >
              {bank.name}
            </Text>
          </View>
          <Text style={[styles.bankBalance, { color: theme.text }]}>
            {formatCurrency(bank.balance)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    ...SHADOWS.small,
    width: "92%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.m,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.bold.fontFamily,
    fontWeight: "bold",
    marginLeft: SIZES.xs,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500",
    marginRight: 2,
  },
  totalContainer: {
    padding: SIZES.m,
    marginHorizontal: SIZES.m,
    marginBottom: SIZES.m,
    borderRadius: SIZES.radius,
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular.fontFamily,
    fontWeight: "normal",
    marginBottom: SIZES.xs,
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: FONTS.bold.fontFamily,
    fontWeight: "bold",
  },
  bankItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.s,
    paddingHorizontal: SIZES.m,
    borderBottomWidth: 1,
  },
  bankInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bankIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZES.xs,
  },
  bankName: {
    fontSize: 14,
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500",
    flex: 1,
  },
  bankBalance: {
    fontSize: 14,
    fontFamily: FONTS.bold.fontFamily,
    fontWeight: "bold",
  },
});

export default BankBalanceSummary;
