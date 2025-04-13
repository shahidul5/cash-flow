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
import { CURRENCY_SYMBOL } from "../utils/currency";
import { COLORS, FONTS, SIZES } from "../utils/theme";

// Define icon types for MaterialCommunityIcons
type IconName =
  | "food"
  | "car"
  | "movie"
  | "shopping"
  | "file-document"
  | "home"
  | "medical-bag"
  | "school"
  | "gift"
  | "cash"
  | "check";

// Define type for form errors
type FormErrors = {
  name?: string;
  amount?: string;
};

const ICONS = [
  { name: "food" as IconName, label: "Food" },
  { name: "car" as IconName, label: "Transport" },
  { name: "movie" as IconName, label: "Entertainment" },
  { name: "shopping" as IconName, label: "Shopping" },
  { name: "file-document" as IconName, label: "Bills" },
  { name: "home" as IconName, label: "Home" },
  { name: "medical-bag" as IconName, label: "Health" },
  { name: "school" as IconName, label: "Education" },
  { name: "gift" as IconName, label: "Gifts" },
  { name: "cash" as IconName, label: "Other" },
];

const COLORS_PALETTE = [
  "#FF5252", // Red
  "#FF9800", // Orange
  "#FFC107", // Amber
  "#4CAF50", // Green
  "#2196F3", // Blue
  "#3F51B5", // Indigo
  "#9C27B0", // Purple
  "#F44336", // Red
  "#009688", // Teal
  "#795548", // Brown
];

const BudgetForm: React.FC<{ budget: any; onSubmit: any; onCancel: any }> = ({
  budget,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [icon, setIcon] = useState<IconName>("cash");
  const [color, setColor] = useState<string>(COLORS_PALETTE[0]);
  const [errors, setErrors] = useState<FormErrors>({});

  // If editing an existing budget, populate the form
  useEffect(() => {
    if (budget) {
      setName(budget.name);
      setAmount(budget.amount.toString());
      setIcon(budget.icon || "cash");
      setColor(budget.color || COLORS_PALETTE[0]);
    }
  }, [budget]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Please enter a category name";
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        name,
        amount: parseFloat(amount),
        icon,
        color,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Groceries, Rent, etc."
            placeholderTextColor={COLORS.textSecondary}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Monthly Budget Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>{CURRENCY_SYMBOL}</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          {errors.amount && (
            <Text style={styles.errorText}>{errors.amount}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Icon</Text>
          <View style={styles.iconGrid}>
            {ICONS.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.iconButton,
                  icon === item.name && { backgroundColor: color },
                ]}
                onPress={() => setIcon(item.name)}
              >
                <MaterialCommunityIcons
                  name={item.name}
                  size={24}
                  color={icon === item.name ? COLORS.white : COLORS.text}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Color</Text>
          <View style={styles.colorGrid}>
            {COLORS_PALETTE.map((colorItem) => (
              <TouchableOpacity
                key={colorItem}
                style={[
                  styles.colorButton,
                  { backgroundColor: colorItem },
                  color === colorItem && styles.selectedColorButton,
                ]}
                onPress={() => setColor(colorItem)}
              >
                {color === colorItem && (
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color={COLORS.white}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {budget ? "Update" : "Add"} Budget
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
  formGroup: {
    marginBottom: SIZES.m,
  },
  label: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500" as const,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  input: {
    fontFamily: FONTS.regular.fontFamily,
    fontWeight: "400" as const,
    fontSize: 16,
    color: COLORS.text,
    padding: SIZES.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.m,
  },
  currencySymbol: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500" as const,
    fontSize: 18,
    color: COLORS.text,
    marginRight: SIZES.xs,
  },
  amountInput: {
    fontFamily: FONTS.regular.fontFamily,
    fontWeight: "400" as const,
    fontSize: 18,
    color: COLORS.text,
    padding: SIZES.m,
    flex: 1,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -SIZES.xs,
  },
  iconButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    margin: SIZES.xs,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -SIZES.xs,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: SIZES.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColorButton: {
    borderWidth: 2,
    borderColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
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
    borderColor: COLORS.border,
    marginRight: SIZES.s,
    alignItems: "center",
  },
  cancelButtonText: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500" as const,
    fontSize: 16,
    color: COLORS.text,
  },
  submitButton: {
    flex: 2,
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  submitButtonText: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500" as const,
    fontSize: 16,
    color: COLORS.white,
  },
  errorText: {
    fontFamily: FONTS.regular.fontFamily,
    fontWeight: "normal" as const,
    fontSize: 12,
    color: COLORS.error,
    marginTop: SIZES.xs,
  },
});

export default BudgetForm;
