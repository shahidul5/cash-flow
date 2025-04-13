import { useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import { useNotifications } from "../context/NotificationContext";

// This component doesn't render anything, it just connects the contexts
const NotificationConnector = () => {
  const { registerNotificationHandler } = useFinance();
  const { addBudgetOverrunNotification } = useNotifications()!;

  useEffect(() => {
    // Pass the notification function to the finance context
    if (addBudgetOverrunNotification) {
      registerNotificationHandler(addBudgetOverrunNotification);
    }
  }, [addBudgetOverrunNotification, registerNotificationHandler]);

  // This component doesn't render anything
  return null;
};

export default NotificationConnector;
