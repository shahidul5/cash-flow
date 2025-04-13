import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import {
  authenticateWithBiometrics,
  getBiometricPreference,
  hasBiometricData,
  isBiometricSupported,
  saveBiometricPreference
} from '../utils/biometrics';
import {
  clearAllData,
  exportData,
  importData,
  importFromClipboard
} from '../utils/dataExport';
import { COLORS, FONTS, SIZES } from '../utils/theme';

const SettingsScreen = () => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const { settings, updateSettings } = useNotifications();
  const [notifications, setNotifications] = useState<boolean>(true);
  const [biometricAuth, setBiometricAuth] = useState<boolean>(false);
  const [biometricSupported, setBiometricSupported] = useState<boolean>(false);
  const [biometricEnrolled, setBiometricEnrolled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkBiometricSupport = async () => {
      try {
        const supported = await isBiometricSupported();
        setBiometricSupported(supported);

        if (supported) {
          const enrolled = await hasBiometricData();
          setBiometricEnrolled(enrolled);

          const enabled = await getBiometricPreference();
          setBiometricAuth(enabled);
        }
      } catch (error) {
        console.error('Error checking biometric support:', error);
      } finally {
        setLoading(false);
      }
    };

    checkBiometricSupport();
  }, []);

  const handleToggleBiometric = async (value) => {
    if (value && !biometricEnrolled) {
      Alert.alert(
        'Biometric Authentication',
        'You need to set up biometric authentication in your device settings first.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (value) {
      try {
        const result = await authenticateWithBiometrics('Enable biometric authentication');
        if (result.success) {
          await saveBiometricPreference(true);
          setBiometricAuth(true);
        } else {
          Alert.alert('Authentication Failed', 'Biometric authentication failed. Please try again.');
        }
      } catch (error) {
        console.error('Error enabling biometric auth:', error);
      }
    } else {
      await saveBiometricPreference(false);
      setBiometricAuth(false);
    }
  };

  const handleToggleNotifications = (value: any$3 => {
    updateSettings({ enabled: value });
  };

  const handleToggleBudgetAlerts = (value: any$3 => {
    updateSettings({ budgetAlerts: value });
  };

  const handleToggleInAppAlerts = (value: any$3 => {
    updateSettings({ showInApp: value });
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      const result = await exportData();
      if (result.success) {
        Alert.alert('Success', 'Your data has been exported successfully.');
      } else {
        console.error('Export error:', result.error);

        // Check if the error is related to permissions
        if (result.error && result.error.includes('permission')) {
          Alert.alert(
            'Permission Required',
            'This app needs storage permission to export your data. Please go to your device settings and grant storage permission to Cash Flow.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings()
              }
            ]
          );
        } else {
          Alert.alert(
            'Export Failed',
            `${result.error || 'Failed to export data.'}\n\nPlease make sure you have granted storage permissions to the app.`
          );
        }
      }
    } catch (error) {
      console.error('Unexpected export error:', error);
      Alert.alert(
        'Export Error',
        'An unexpected error occurred during export. Please check app permissions and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async () => {
    setLoading(true);
    try {
      const result = await importData();
      if (result.success) {
        Alert.alert('Success', 'Your data has been imported successfully. Please restart the app to see the changes.');
      } else if (result.error !== 'Import canceled by user' && result.error !== 'Document picking was canceled') {
        console.error('Import error:', result.error);
        Alert.alert(
          'Import Failed',
          `${result.error || 'Failed to import data.'}\n\nPlease make sure you have selected a valid Cash Flow export file.`
        );
      }
    } catch (error) {
      console.error('Unexpected import error:', error);
      Alert.alert(
        'Import Error',
        'An unexpected error occurred during import. Please check app permissions and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromClipboard = async () => {
    setLoading(true);
    try {
      const result = await importFromClipboard();
      if (result.success) {
        Alert.alert('Success', 'Your data has been imported successfully from clipboard. Please restart the app to see the changes.');
      } else if (result.error !== 'Import canceled by user') {
        console.error('Clipboard import error:', result.error);
        Alert.alert(
          'Import Failed',
          `${result.error || 'Failed to import data from clipboard.'}\n\nPlease make sure you have copied a valid Cash Flow export data to your clipboard.`
        );
      }
    } catch (error) {
      console.error('Unexpected clipboard import error:', error);
      Alert.alert(
        'Import Error',
        'An unexpected error occurred during clipboard import. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    setLoading(true);
    try {
      const result = await clearAllData();
      if (result.success) {
        Alert.alert('Success', 'All data has been cleared. Please restart the app.');
      } else if (result.error !== 'Clearing canceled by user') {
        Alert.alert('Error', result.error || 'Failed to clear data. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while clearing data.');
    } finally {
      setLoading(false);
    }
  };

  const openPrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const openTermsOfService = () => {
    navigation.navigate('TermsOfService');
  };

  const openIncomeCategories = () => {
    navigation.navigate('IncomeCategories');
  };

  const openProfile = () => {
    navigation.navigate('Profile');
  };

  const openNotifications = () => {
    navigation.navigate('Notifications');
  };

  const renderSettingItem: React.FC<{ icon: any, title: any, description: any, action: any, type = 'arrow': any, value: any, onValueChange: any }> = ({ icon, title, description, action, type = 'arrow', value, onValueChange }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: theme.card }]}
      onPress={action}
      disabled={type === 'switch'}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.background }]}>
        <MaterialCommunityIcons name={icon} size={24} color={theme.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
        {description && <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>{description}</Text>}
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor={theme.white}
          disabled={title === 'Biometric Authentication' && (!biometricSupported || !biometricEnrolled)}
        />
      ) : (
        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondary} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Preferences</Text>
          {renderSettingItem({
            icon: 'account',
            title: 'Profile',
            description: 'Manage your personal information',
            action: openProfile,
          })}
          {renderSettingItem({
            icon: 'theme-light-dark',
            title: 'Dark Mode',
            description: 'Switch between light and dark themes',
            type: 'switch',
            value: isDarkMode,
            onValueChange: toggleTheme,
          })}
          {renderSettingItem({
            icon: 'bell',
            title: 'Notifications',
            description: 'Enable or disable app notifications',
            type: 'switch',
            value: settings.enabled,
            onValueChange: handleToggleNotifications,
          })}
          {renderSettingItem({
            icon: 'fingerprint',
            title: 'Biometric Authentication',
            description: biometricSupported && biometricEnrolled
              ? 'Secure your app with fingerprint or face ID'
              : !biometricSupported
                ? 'Your device does not support biometric authentication'
                : 'You need to set up biometric authentication in your device settings',
            type: 'switch',
            value: biometricAuth,
            onValueChange: handleToggleBiometric,
          })}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Data Management</Text>
          {renderSettingItem({
            icon: 'cash-multiple',
            title: 'Income Categories',
            description: 'Manage your income categories',
            action: openIncomeCategories,
          })}
          {renderSettingItem({
            icon: 'export',
            title: 'Export Data',
            description: 'Export your transactions and budgets',
            action: handleExportData,
          })}
          {renderSettingItem({
            icon: 'import',
            title: 'Import Data',
            description: 'Import from a file',
            action: handleImportData,
          })}
          {renderSettingItem({
            icon: 'clipboard-text',
            title: 'Import from Clipboard',
            description: 'Import data from clipboard',
            action: handleImportFromClipboard,
          })}
          {renderSettingItem({
            icon: 'delete',
            title: 'Clear All Data',
            description: 'Permanently delete all your data',
            action: handleClearData,
          })}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>About</Text>
          {renderSettingItem({
            icon: 'shield',
            title: 'Privacy Policy',
            action: openPrivacyPolicy,
          })}
          {renderSettingItem({
            icon: 'file-document',
            title: 'Terms of Service',
            action: openTermsOfService,
          })}
          {renderSettingItem({
            icon: 'information',
            title: 'App Version',
            description: '1.0.0',
            action: () => { },
          })}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Notifications</Text>
          {settings.enabled && (
            <>
              {renderSettingItem({
                icon: 'bell-alert',
                title: 'Budget Alerts',
                description: 'Get notified when you exceed your budget',
                type: 'switch',
                value: settings.budgetAlerts,
                onValueChange: handleToggleBudgetAlerts,
              })}
              {renderSettingItem({
                icon: 'bell-ring',
                title: 'In-App Alerts',
                description: 'Show alerts within the app',
                type: 'switch',
                value: settings.showInApp,
                onValueChange: handleToggleInAppAlerts,
              })}
              {renderSettingItem({
                icon: 'bell-badge',
                title: 'View Notifications',
                description: 'See all your notifications',
                action: openNotifications,
              })}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: SIZES.m,
  },
  sectionTitle: {
    ...FONTS.medium,
    fontSize: 16,
    marginHorizontal: SIZES.m,
    marginVertical: SIZES.s,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.m,
    paddingHorizontal: SIZES.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.m,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...FONTS.medium,
    fontSize: 16,
  },
  settingDescription: {
    ...FONTS.regular,
    fontSize: 14,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.medium,
    fontSize: 16,
    marginTop: SIZES.m,
  },
});

export default SettingsScreen; 