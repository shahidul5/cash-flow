import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

// Storage key
const BIOMETRIC_ENABLED_KEY = '@cashflow_biometric_enabled';

/**
 * Check if device supports biometric authentication
 * @returns {Promise<boolean>} Whether device supports biometrics
 */
export const isBiometricSupported = async () => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  return compatible;
};

/**
 * Check if device has biometric data enrolled
 * @returns {Promise<boolean>} Whether device has biometric data
 */
export const hasBiometricData = async () => {
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
};

/**
 * Get available biometric types
 * @returns {Promise<string[]>} Array of available biometric types
 */
export const getBiometricTypes = async () => {
  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  const typeNames = types.map(type => {
    switch (type) {
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return 'fingerprint';
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return 'face';
      case LocalAuthentication.AuthenticationType.IRIS:
        return 'iris';
      default:
        return 'unknown';
    }
  });
  return typeNames;
};

/**
 * Authenticate user with biometrics
 * @param {string} promptMessage - Message to display to user
 * @returns {Promise<{success: boolean, error?: string}>} Authentication result
 */
export const authenticateWithBiometrics = async (promptMessage = 'Authenticate to access your financial data') => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      disableDeviceFallback: false,
      cancelLabel: 'Cancel',
    });

    return { success: result.success };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Save biometric authentication preference
 * @param {boolean} enabled - Whether biometric authentication is enabled
 * @returns {Promise<void>}
 */
export const saveBiometricPreference = async (enabled) => {
  try {
    await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, JSON.stringify(enabled));
  } catch (error) {
    console.error('Error saving biometric preference:', error);
  }
};

/**
 * Get biometric authentication preference
 * @returns {Promise<boolean>} Whether biometric authentication is enabled
 */
export const getBiometricPreference = async () => {
  try {
    const value = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
    return value !== null ? JSON.parse(value) : false;
  } catch (error) {
    console.error('Error getting biometric preference:', error);
    return false;
  }
}; 