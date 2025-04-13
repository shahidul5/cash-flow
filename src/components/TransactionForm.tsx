import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFinance } from "../context/FinanceContext";
import { useTheme } from "../context/ThemeContext";
import { CURRENCY_SYMBOL } from "../utils/currency";
import { FONTS, SIZES } from "../utils/theme";

// Define form error type
type FormErrors = {
  amount?: string;
  category?: string;
  bank?: string;
};

const TransactionForm: React.FC<{
  transaction: any;
  onSubmit: any;
  onCancel: any;
  initialType: any;
  initialPaymentMethod: any;
}> = ({
  transaction,
  onSubmit,
  onCancel,
  initialType,
  initialPaymentMethod,
}) => {
  const { budgets, incomeCategories, bankAccounts } = useFinance();
  const { theme, isDarkMode } = useTheme();
  const [type, setType] = useState<any>(initialType || "expense");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<any>(
    initialPaymentMethod || "cash"
  ); // 'cash' or 'bank'
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});

  // If editing an existing transaction, populate the form
  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setNote(transaction.note || "");
      setPaymentMethod(transaction.paymentMethod || "cash");
      setSelectedBankId(transaction.bankId || "");
    }
  }, [transaction]);

  // Apply initialType and initialPaymentMethod when they change
  useEffect(() => {
    if (initialType && !transaction) {
      setType(initialType);
    }
    if (initialPaymentMethod && !transaction) {
      setPaymentMethod(initialPaymentMethod);
    }
  }, [initialType, initialPaymentMethod, transaction]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }

    if (paymentMethod === "bank" && !selectedBankId) {
      newErrors.bank = "Please select a bank account";
    }

    // For withdrawals, check if bank has sufficient balance
    if (type === "expense" && paymentMethod === "bank" && selectedBankId) {
      const selectedBank = bankAccounts.find(
        (bank) => bank.id === selectedBankId
      );
      if (
        selectedBank &&
        parseFloat(amount) > parseFloat(selectedBank.balance)
      ) {
        newErrors.amount = "Insufficient funds in selected bank account";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        type,
        amount: parseFloat(amount),
        category,
        note,
        paymentMethod,
        bankId: paymentMethod === "bank" ? selectedBankId : null,
      });
    }
  };

  // Get categories based on transaction type
  const getCategories = () => {
    if (type === "income") {
      return incomeCategories.map((category) => ({
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
      }));
    } else {
      return budgets.map((budget) => ({
        id: budget.id,
        name: budget.name,
        icon: budget.icon,
        color: budget.color,
      }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "expense" && styles.activeTypeButton,
              {
                borderColor: theme.border,
                backgroundColor:
                  type === "expense" ? theme.expense : "transparent",
              },
            ]}
            onPress={() => setType("expense")}
          >
            <MaterialCommunityIcons
              name="cash-minus"
              size={20}
              color={type === "expense" ? "#FFFFFF" : theme.expense}
            />
            <Text
              style={[
                styles.typeText,
                type === "expense" && styles.activeTypeText,
                { color: type === "expense" ? "#FFFFFF" : theme.text },
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "income" && styles.activeIncomeButton,
              {
                borderColor: theme.border,
                backgroundColor:
                  type === "income" ? theme.income : "transparent",
              },
            ]}
            onPress={() => setType("income")}
          >
            <MaterialCommunityIcons
              name="cash-plus"
              size={20}
              color={type === "income" ? "#FFFFFF" : theme.income}
            />
            <Text
              style={[
                styles.typeText,
                type === "income" && styles.activeTypeText,
                { color: type === "income" ? "#FFFFFF" : theme.text },
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Amount</Text>
          <View
            style={[
              styles.amountInputContainer,
              {
                borderColor: errors.amount ? theme.error : theme.border,
                backgroundColor: isDarkMode
                  ? theme.cardBackground
                  : theme.white,
              },
            ]}
          >
            <Text style={[styles.currencySymbol, { color: theme.text }]}>
              {CURRENCY_SYMBOL}
            </Text>
            <TextInput
              style={[
                styles.amountInput,
                {
                  color: theme.text,
                  backgroundColor: "transparent",
                },
              ]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
          {errors.amount && (
            <Text style={[styles.errorText, { color: theme.error }]}>
              {errors.amount}
            </Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Category</Text>
          <View style={styles.categoryContainer}>
            {getCategories().map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  category === cat.name && {
                    backgroundColor:
                      type === "income"
                        ? theme.income
                        : cat.color || theme.expense,
                  },
                  { borderColor: theme.border },
                ]}
                onPress={() => setCategory(cat.name)}
              >
                <MaterialCommunityIcons
                  name={cat.icon}
                  size={20}
                  color={category === cat.name ? "#FFFFFF" : theme.text}
                />
                <Text
                  style={[
                    styles.categoryText,
                    category === cat.name && styles.activeCategoryText,
                    { color: category === cat.name ? "#FFFFFF" : theme.text },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.category && (
            <Text style={[styles.errorText, { color: theme.error }]}>
              {errors.category}
            </Text>
          )}
        </View>

        {/* Payment Method Selection */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Payment Method
          </Text>
          <View style={styles.paymentMethodContainer}>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                paymentMethod === "cash" && styles.activePaymentMethodButton,
                {
                  borderColor: theme.border,
                  backgroundColor:
                    paymentMethod === "cash" ? theme.primary : "transparent",
                },
              ]}
              onPress={() => setPaymentMethod("cash")}
            >
              <MaterialCommunityIcons
                name="cash"
                size={20}
                color={paymentMethod === "cash" ? "#FFFFFF" : theme.text}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  paymentMethod === "cash" && styles.activePaymentMethodText,
                  { color: paymentMethod === "cash" ? "#FFFFFF" : theme.text },
                ]}
              >
                Cash
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                paymentMethod === "bank" && styles.activePaymentMethodButton,
                {
                  borderColor: theme.border,
                  backgroundColor:
                    paymentMethod === "bank" ? theme.primary : "transparent",
                },
              ]}
              onPress={() => setPaymentMethod("bank")}
            >
              <MaterialCommunityIcons
                name="bank"
                size={20}
                color={paymentMethod === "bank" ? "#FFFFFF" : theme.text}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  paymentMethod === "bank" && styles.activePaymentMethodText,
                  { color: paymentMethod === "bank" ? "#FFFFFF" : theme.text },
                ]}
              >
                Bank Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bank Account Selection (only shown if payment method is 'bank') */}
        {paymentMethod === "bank" && (
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              Select Bank Account
            </Text>
            <View style={styles.bankAccountContainer}>
              {bankAccounts.length > 0 ? (
                bankAccounts.map((bank) => (
                  <TouchableOpacity
                    key={bank.id}
                    style={[
                      styles.bankAccountButton,
                      selectedBankId === bank.id &&
                        styles.activeBankAccountButton,
                      {
                        borderColor: theme.border,
                        backgroundColor:
                          selectedBankId === bank.id
                            ? theme.primary
                            : "transparent",
                      },
                    ]}
                    onPress={() => setSelectedBankId(bank.id)}
                  >
                    <MaterialCommunityIcons
                      name="bank"
                      size={20}
                      color={
                        selectedBankId === bank.id ? "#FFFFFF" : theme.text
                      }
                    />
                    <View style={styles.bankAccountInfo}>
                      <Text
                        style={[
                          styles.bankAccountName,
                          {
                            color:
                              selectedBankId === bank.id
                                ? "#FFFFFF"
                                : theme.text,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {bank.name}
                      </Text>
                      <Text
                        style={[
                          styles.bankAccountBalance,
                          {
                            color:
                              selectedBankId === bank.id
                                ? "#FFFFFF"
                                : theme.textSecondary,
                          },
                        ]}
                      >
                        {CURRENCY_SYMBOL}
                        {parseFloat(bank.balance).toFixed(2)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View
                  style={[styles.noBanksMessage, { borderColor: theme.border }]}
                >
                  <Text
                    style={[styles.noBanksText, { color: theme.textSecondary }]}
                  >
                    No bank accounts found. Please add a bank account first.
                  </Text>
                </View>
              )}
            </View>
            {errors.bank && (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {errors.bank}
              </Text>
            )}
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>
            Note (Optional)
          </Text>
          <TextInput
            style={[
              styles.noteInput,
              {
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: isDarkMode
                  ? theme.cardBackground
                  : theme.white,
              },
            ]}
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
            onPress={onCancel}
          >
            <Text style={[styles.cancelButtonText, { color: theme.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.primary }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {transaction ? "Update" : "Add"} Transaction
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.m,
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: SIZES.m,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginRight: SIZES.s,
  },
  activeTypeButton: {
    borderWidth: 0,
  },
  activeIncomeButton: {
    borderWidth: 0,
  },
  typeText: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500" as const,
    fontSize: 14,
    marginLeft: SIZES.xs,
  },
  activeTypeText: {
    color: "#FFFFFF",
  },
  formGroup: {
    marginBottom: SIZES.m,
  },
  label: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500" as const,
    fontSize: 14,
    marginBottom: SIZES.xs,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.m,
  },
  currencySymbol: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500" as const,
    fontSize: 18,
    marginRight: SIZES.xs,
  },
  amountInput: {
    fontFamily: FONTS.regular.fontFamily,
    fontWeight: "400" as const,
    fontSize: 18,
    padding: SIZES.m,
    flex: 1,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -SIZES.xs,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.s,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    margin: SIZES.xs,
  },
  categoryText: {
    fontFamily: FONTS.regular.fontFamily,
    fontWeight: "400" as const,
    fontSize: 12,
    marginLeft: SIZES.xs,
  },
  activeCategoryText: {
    color: "#FFFFFF",
  },
  // Payment Method Styles
  paymentMethodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentMethodButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginHorizontal: SIZES.xs,
  },
  activePaymentMethodButton: {
    borderWidth: 0,
  },
  paymentMethodText: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500" as const,
    fontSize: 14,
    marginLeft: SIZES.xs,
  },
  activePaymentMethodText: {
    color: "#FFFFFF",
  },
  // Bank Account Styles
  bankAccountContainer: {
    marginTop: SIZES.xs,
  },
  bankAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: SIZES.s,
  },
  activeBankAccountButton: {
    borderWidth: 0,
  },
  bankAccountInfo: {
    flex: 1,
    marginLeft: SIZES.s,
  },
  bankAccountName: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500" as const,
    fontSize: 14,
  },
  bankAccountBalance: {
    fontFamily: FONTS.regular.fontFamily,
    fontWeight: "400" as const,
    fontSize: 12,
    marginTop: 2,
  },
  noBanksMessage: {
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
  },
  noBanksText: {
    fontFamily: FONTS.regular.fontFamily,
    fontWeight: "400" as const,
    fontSize: 14,
    textAlign: "center",
  },
  noteInput: {
    fontFamily: FONTS.regular.fontFamily,
    fontWeight: "400" as const,
    fontSize: 16,
    padding: SIZES.m,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: SIZES.m,
  },
  cancelButton: {
    flex: 1,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginRight: SIZES.s,
    alignItems: "center",
  },
  cancelButtonText: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500" as const,
    fontSize: 16,
  },
  submitButton: {
    flex: 2,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    alignItems: "center",
  },
  submitButtonText: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500" as const,
    fontSize: 16,
    color: "#FFFFFF",
  },
  errorText: {
    fontFamily: FONTS.regular.fontFamily,
    fontWeight: "400" as const,
    fontSize: 12,
    marginTop: SIZES.xs,
  },
});

export default TransactionForm;
