import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

// Define NotificationContext type
type NotificationContextType = {
  notifications: any[];
  settings: any;
  addNotification: (notification: any) => void;
  addBudgetOverrunNotification: (
    budget: any,
    spent: number,
    remaining: number
  ) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => Promise<void>;
  updateSettings: (newSettings: any) => void;
  getUnreadCount: () => number;
} | null;

// Create context
const NotificationContext = createContext<NotificationContextType>(null);

// Storage key for notifications
const NOTIFICATIONS_KEY = "@cashflow_notifications";
const NOTIFICATION_SETTINGS_KEY = "@cashflow_notification_settings";

export const NotificationProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    enabled: true,
    budgetAlerts: true,
    showInApp: true,
  });

  // Load notifications and settings from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem(
          NOTIFICATIONS_KEY
        );
        const storedSettings = await AsyncStorage.getItem(
          NOTIFICATION_SETTINGS_KEY
        );

        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        }

        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error("Error loading notification data:", error);
      }
    };

    loadData();
  }, []);

  // Save notifications to storage when they change
  useEffect(() => {
    const saveNotifications = async () => {
      try {
        await AsyncStorage.setItem(
          NOTIFICATIONS_KEY,
          JSON.stringify(notifications)
        );
      } catch (error) {
        console.error("Error saving notifications:", error);
      }
    };

    if (notifications.length > 0) {
      saveNotifications();
    }
  }, [notifications]);

  // Save settings to storage when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(
          NOTIFICATION_SETTINGS_KEY,
          JSON.stringify(settings)
        );
      } catch (error) {
        console.error("Error saving notification settings:", error);
      }
    };

    saveSettings();
  }, [settings]);

  // Add a new notification
  const addNotification = (notification: any) => {
    if (!settings.enabled) return;

    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    setNotifications((prevNotifications) => [
      newNotification,
      ...prevNotifications,
    ]);

    // Show in-app alert if enabled
    if (settings.showInApp) {
      Alert.alert(notification.title, notification.message);
    }
  };

  // Add a budget overrun notification
  const addBudgetOverrunNotification = (
    budget: any,
    spent: number,
    remaining: number
  ) => {
    if (!settings.enabled || !settings.budgetAlerts) return;

    addNotification({
      type: "budget_overrun",
      title: "Budget Alert",
      message: `Your ${budget.name} budget has exceeded its limit by ${Math.abs(
        remaining
      ).toFixed(2)}`,
      budget: budget,
      spent: spent,
      remaining: remaining,
    });
  };

  // Mark a notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Delete a notification
  const deleteNotification = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== notificationId
      )
    );
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    setNotifications([]);
    await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
  };

  // Update notification settings
  const updateSettings = (newSettings: any) => {
    setSettings((prevSettings: any) => ({ ...prevSettings, ...newSettings }));
  };

  // Get unread notifications count
  const getUnreadCount = () => {
    return notifications.filter((notification) => !notification.read).length;
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        settings,
        addNotification,
        addBudgetOverrunNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        updateSettings,
        getUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);
