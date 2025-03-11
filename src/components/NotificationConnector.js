import { useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useNotifications } from '../context/NotificationContext';

// This component doesn't render anything, it just connects the contexts
const NotificationConnector = () => {
  const { setNotificationFunction } = useFinance();
  const { addBudgetOverrunNotification } = useNotifications();

  useEffect(() => {
    // Pass the notification function to the finance context
    if (addBudgetOverrunNotification) {
      setNotificationFunction(addBudgetOverrunNotification);
    }
  }, [addBudgetOverrunNotification, setNotificationFunction]);

  // This component doesn't render anything
  return null;
};

export default NotificationConnector; 