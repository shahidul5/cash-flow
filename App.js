import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NotificationConnector from './src/components/NotificationConnector';
import { FinanceProvider } from './src/context/FinanceContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { UserProvider } from './src/context/UserContext';
import AppNavigator from './src/navigation/AppNavigator';
import { authenticateWithBiometrics, getBiometricPreference } from './src/utils/biometrics';
import { COLORS, COLORS_DARK } from './src/utils/theme';

// Wrapper component to handle biometric authentication
const AuthenticatedApp = () => {
  const { theme, isDarkMode } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBiometricSettings = async () => {
      try {
        const enabled = await getBiometricPreference();
        setIsBiometricEnabled(enabled);

        if (enabled) {
          // If biometric is enabled, we need to authenticate
          const result = await authenticateWithBiometrics('Authenticate to access Cash Flow');
          setIsAuthenticated(result.success);
        } else {
          // If biometric is not enabled, no authentication needed
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking biometric settings:', error);
        // If there's an error, allow access anyway
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkBiometricSettings();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? COLORS_DARK.background : COLORS.background }}>
        <ActivityIndicator size="large" color={isDarkMode ? COLORS_DARK.primary : COLORS.primary} />
      </View>
    );
  }

  if (!isAuthenticated && isBiometricEnabled) {
    // If authentication failed, retry
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? COLORS_DARK.background : COLORS.background }}>
        <ActivityIndicator size="large" color={isDarkMode ? COLORS_DARK.primary : COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar
        style={isDarkMode ? 'light' : 'dark'}
        backgroundColor="transparent"
        translucent={true}
      />
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
          <FinanceProvider>
            <NotificationProvider>
              <NotificationConnector />
              <AuthenticatedApp />
            </NotificationProvider>
          </FinanceProvider>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
