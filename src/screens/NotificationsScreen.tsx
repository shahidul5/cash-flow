import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNotifications } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";
import { formatCurrency } from "../utils/currency";
import { FONTS, SHADOWS, SIZES } from "../utils/theme";

const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const notificationsContext = useNotifications()!;
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = notificationsContext;
  const { theme } = useTheme();

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          onPress: clearAllNotifications,
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteNotification = (id: string) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteNotification(id),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleNotificationPress = (notification: any) => {
    // Mark as read when pressed
    markAsRead(notification.id);

    // Navigate based on notification type
    if (notification.type === "budget_overrun" && notification.budget) {
      navigation.navigate("BudgetDetail", { budget: notification.budget });
    }
  };

  const renderNotificationItem = ({ item }: { item: any }) => {
    const isBudgetOverrun = item.type === "budget_overrun";
    const isRead = item.read;
    const date = new Date(item.timestamp).toLocaleDateString();
    const time = new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          {
            backgroundColor: isRead ? theme.card : theme.card + "99",
            borderColor: theme.border,
          },
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons
                name={isBudgetOverrun ? "alert-circle" : "bell"}
                size={24}
                color={isBudgetOverrun ? theme.expense : theme.primary}
              />
              <Text style={[styles.notificationTitle, { color: theme.text }]}>
                {item.title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteNotification(item.id)}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.notificationMessage, { color: theme.text }]}>
            {item.message}
          </Text>

          {isBudgetOverrun && (
            <View style={styles.budgetDetails}>
              <View style={styles.budgetDetail}>
                <Text
                  style={[
                    styles.budgetDetailLabel,
                    { color: theme.textSecondary },
                  ]}
                >
                  Budget:
                </Text>
                <Text style={[styles.budgetDetailValue, { color: theme.text }]}>
                  {formatCurrency(item.budget.amount)}
                </Text>
              </View>
              <View style={styles.budgetDetail}>
                <Text
                  style={[
                    styles.budgetDetailLabel,
                    { color: theme.textSecondary },
                  ]}
                >
                  Spent:
                </Text>
                <Text
                  style={[styles.budgetDetailValue, { color: theme.expense }]}
                >
                  {formatCurrency(item.spent)}
                </Text>
              </View>
              <View style={styles.budgetDetail}>
                <Text
                  style={[
                    styles.budgetDetailLabel,
                    { color: theme.textSecondary },
                  ]}
                >
                  Over by:
                </Text>
                <Text
                  style={[styles.budgetDetailValue, { color: theme.expense }]}
                >
                  {formatCurrency(Math.abs(item.remaining))}
                </Text>
              </View>
            </View>
          )}

          <Text
            style={[styles.notificationTime, { color: theme.textSecondary }]}
          >
            {date} at {time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
      <MaterialCommunityIcons
        name="bell-off"
        size={64}
        color={theme.textSecondary}
      />
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        No notifications yet
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Notifications
        </Text>
        {notifications.length > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.headerButton, { borderColor: theme.border }]}
              onPress={markAllAsRead}
            >
              <Text style={[styles.headerButtonText, { color: theme.primary }]}>
                Mark All as Read
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerButton, { borderColor: theme.border }]}
              onPress={handleClearAll}
            >
              <Text style={[styles.headerButtonText, { color: theme.error }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SIZES.m,
    borderBottomWidth: 1,
    ...SHADOWS.small,
  },
  headerTitle: {
    fontFamily: FONTS.bold.fontFamily,
    fontWeight: "700",
    fontSize: 20,
    marginBottom: SIZES.s,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  headerButton: {
    paddingVertical: SIZES.xs,
    paddingHorizontal: SIZES.s,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginLeft: SIZES.s,
  },
  headerButtonText: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500",
    fontSize: 12,
  },
  listContent: {
    padding: SIZES.m,
    paddingBottom: SIZES.xxxl,
  },
  notificationItem: {
    borderRadius: SIZES.radius,
    marginBottom: SIZES.m,
    borderWidth: 1,
    overflow: "hidden",
  },
  notificationContent: {
    padding: SIZES.m,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.xs,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationTitle: {
    fontFamily: FONTS.bold.fontFamily,
    fontWeight: "700",
    fontSize: 16,
    marginLeft: SIZES.xs,
  },
  notificationMessage: {
    fontFamily: FONTS.regular.fontFamily,
    fontWeight: "400",
    fontSize: 14,
    marginBottom: SIZES.s,
  },
  budgetDetails: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: SIZES.radius,
    padding: SIZES.s,
    marginBottom: SIZES.s,
  },
  budgetDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  budgetDetailLabel: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500",
    fontSize: 12,
  },
  budgetDetailValue: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500",
    fontSize: 12,
  },
  notificationTime: {
    fontFamily: FONTS.regular.fontFamily,
    fontWeight: "400",
    fontSize: 12,
    textAlign: "right",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: SIZES.xl,
    borderRadius: SIZES.radius,
    marginTop: SIZES.xl,
  },
  emptyText: {
    fontFamily: FONTS.medium.fontFamily,
    fontWeight: "500",
    fontSize: 16,
    marginTop: SIZES.m,
  },
});

export default NotificationsScreen;
