import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import { Alert, Linking, Platform } from 'react-native';

/**
 * Check and request storage permissions
 * @returns {Promise<boolean>} Whether permissions are granted
 */
export const checkStoragePermissions = async () => {
  // On iOS, we don't need to explicitly request storage permissions
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    // For Android, check if we have the permissions
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.MEDIA_LIBRARY_WRITE_ONLY
    );

    let finalStatus = existingStatus;

    // If we don't have them, request them
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(
        Permissions.MEDIA_LIBRARY_WRITE_ONLY
      );
      finalStatus = status;
    }

    // If permissions are not granted after the request
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Storage Permission Required',
        'This app needs storage access to export your data. Please grant storage permission in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings()
          }
        ]
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
};

/**
 * Ensure directory exists
 * @param {string} dirPath - Directory path
 * @returns {Promise<boolean>} Whether directory exists or was created
 */
export const ensureDirectoryExists = async (dirPath) => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(dirPath);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
    }

    return true;
  } catch (error) {
    console.error('Error ensuring directory exists:', error);
    return false;
  }
};

/**
 * Get a writable directory path
 * @returns {Promise<string|null>} Path to a writable directory or null if not available
 */
export const getWritableDirectory = async () => {
  try {
    // Try cache directory first (most reliable)
    const cacheDir = FileSystem.cacheDirectory;
    if (cacheDir && await ensureDirectoryExists(cacheDir)) {
      return cacheDir;
    }

    // Try document directory as fallback
    const docDir = FileSystem.documentDirectory;
    if (docDir && await ensureDirectoryExists(docDir)) {
      return docDir;
    }

    return null;
  } catch (error) {
    console.error('Error getting writable directory:', error);
    return null;
  }
}; 