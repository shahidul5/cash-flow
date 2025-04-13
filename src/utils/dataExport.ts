import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Alert, Clipboard, Platform, ToastAndroid } from 'react-native';

// Storage keys
const TRANSACTIONS_KEY = '@cashflow_transactions';
const BUDGETS_KEY = '@cashflow_budgets';

/**
 * Export data to clipboard as a fallback method
 * @returns {Promise<{success: boolean, error?: string}>} Export result
 */
const exportToClipboard = async () => {
  try {
    // Get all data from AsyncStorage
    const transactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    const budgets = await AsyncStorage.getItem(BUDGETS_KEY);

    // Create data object
    const data = {
      transactions: transactions ? JSON.parse(transactions) : [],
      budgets: budgets ? JSON.parse(budgets) : [],
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Copy to clipboard
    await Clipboard.setString(jsonString);

    // Show toast on Android
    if (Platform.OS === 'android') {
      ToastAndroid.show('Data copied to clipboard', ToastAndroid.LONG);
    }

    return { success: true };
  } catch (error) {
    console.error('Error exporting to clipboard:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export data using Media Library (alternative approach)
 * @returns {Promise<{success: boolean, error?: string}>} Export result
 */
const exportToMediaLibrary = async () => {
  try {
    // Request permissions first
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      return {
        success: false,
        error: 'Media library permission is required to save the export file.'
      };
    }

    // Get all data from AsyncStorage
    const transactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    const budgets = await AsyncStorage.getItem(BUDGETS_KEY);

    // Create data object
    const data = {
      transactions: transactions ? JSON.parse(transactions) : [],
      budgets: budgets ? JSON.parse(budgets) : [],
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Create a temporary file in the cache directory
    const fileUri = `${FileSystem.cacheDirectory}cashflow_export_${Date.now()}.json`;
    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: FileSystem.EncodingType.UTF8
    });

    // Save the file to the media library
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    const album = await MediaLibrary.getAlbumAsync('Cash Flow');

    if (album) {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    } else {
      await MediaLibrary.createAlbumAsync('Cash Flow', asset, false);
    }

    // Show success message
    if (Platform.OS === 'android') {
      ToastAndroid.show('Export saved to Cash Flow album in your gallery', ToastAndroid.LONG);
    }

    return { success: true };
  } catch (error) {
    console.error('Error exporting to media library:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export all app data to a JSON file
 * @returns {Promise<{success: boolean, error?: string}>} Export result
 */
export const exportData = async () => {
  try {
    // Get all data from AsyncStorage
    const transactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    const budgets = await AsyncStorage.getItem(BUDGETS_KEY);

    // Create data object
    const data = {
      transactions: transactions ? JSON.parse(transactions) : [],
      budgets: budgets ? JSON.parse(budgets) : [],
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // For Android, try the media library approach first (most reliable)
    if (Platform.OS === 'android') {
      try {
        const mediaResult = await exportToMediaLibrary();
        if (mediaResult.success) {
          return { success: true };
        }
      } catch (mediaError) {
        console.error('Media library export error:', mediaError);
      }
    }

    // Check if sharing is available
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      // If sharing is not available, try clipboard as fallback
      Alert.alert(
        'Sharing Not Available',
        'Would you like to copy the data to clipboard instead?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => { },
          },
          {
            text: 'Copy to Clipboard',
            onPress: async () => {
              await exportToClipboard();
            },
          },
        ]
      );

      return {
        success: false,
        error: 'Sharing is not available on this device. Try using the clipboard option.',
      };
    }

    // Try the standard sharing approach
    try {
      // Create a temporary file in the cache directory
      const fileUri = `${FileSystem.cacheDirectory}cashflow_export_${Date.now()}.json`;

      // Write the file
      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8
      });

      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Cash Flow Data',
        UTI: 'public.json',
      });

      return { success: true };
    } catch (fileError) {
      console.error('File operation error:', fileError);

      // If all else fails, offer clipboard as a last resort
      Alert.alert(
        'Export Failed',
        'Would you like to copy the data to clipboard instead?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => { },
          },
          {
            text: 'Copy to Clipboard',
            onPress: async () => {
              await exportToClipboard();
            },
          },
        ]
      );

      return {
        success: false,
        error: `Export failed: ${fileError.message || 'Unknown error'}`
      };
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    return {
      success: false,
      error: `Export failed: ${error.message || 'Unknown error'}`
    };
  }
};

/**
 * Import data from a JSON file
 * @returns {Promise<{success: boolean, error?: string}>} Import result
 */
export const importData = async () => {
  try {
    // Pick a document
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return { success: false, error: 'Document picking was canceled' };
    }

    if (!result.assets || !result.assets[0] || !result.assets[0].uri) {
      return { success: false, error: 'Invalid document selection' };
    }

    // Read the file
    try {
      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);

      // Parse the JSON
      let data;
      try {
        data = JSON.parse(fileContent);
      } catch (parseError) {
        return { success: false, error: 'Invalid JSON format in the selected file' };
      }

      // Validate the data structure
      if (!data.transactions || !data.budgets || !Array.isArray(data.transactions) || !Array.isArray(data.budgets)) {
        return { success: false, error: 'Invalid data format: Missing transactions or budgets' };
      }

      // Confirm import with user
      return new Promise((resolve) => {
        Alert.alert(
          'Import Data',
          'This will replace all your current data. Are you sure you want to continue?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve({ success: false, error: 'Import canceled by user' }),
            },
            {
              text: 'Import',
              onPress: async () => {
                try {
                  // Save the data to AsyncStorage
                  await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(data.transactions));
                  await AsyncStorage.setItem(BUDGETS_KEY, JSON.stringify(data.budgets));

                  resolve({ success: true });
                } catch (error) {
                  console.error('Error saving imported data:', error);
                  resolve({ success: false, error: error.message });
                }
              },
            },
          ],
          { cancelable: false }
        );
      });
    } catch (readError) {
      console.error('Error reading file:', readError);
      return { success: false, error: `Error reading file: ${readError.message}` };
    }
  } catch (error) {
    console.error('Error importing data:', error);
    return { success: false, error: `Import failed: ${error.message || 'Unknown error'}` };
  }
};

/**
 * Import data from clipboard
 * @returns {Promise<{success: boolean, error?: string}>} Import result
 */
export const importFromClipboard = async () => {
  try {
    // Get clipboard content
    const clipboardContent = await Clipboard.getString();

    if (!clipboardContent) {
      return { success: false, error: 'Clipboard is empty' };
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(clipboardContent);
    } catch (parseError) {
      return { success: false, error: 'Invalid JSON format in clipboard' };
    }

    // Validate the data structure
    if (!data.transactions || !data.budgets || !Array.isArray(data.transactions) || !Array.isArray(data.budgets)) {
      return { success: false, error: 'Invalid data format: Missing transactions or budgets' };
    }

    // Confirm import with user
    return new Promise((resolve) => {
      Alert.alert(
        'Import Data from Clipboard',
        'This will replace all your current data. Are you sure you want to continue?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve({ success: false, error: 'Import canceled by user' }),
          },
          {
            text: 'Import',
            onPress: async () => {
              try {
                // Save the data to AsyncStorage
                await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(data.transactions));
                await AsyncStorage.setItem(BUDGETS_KEY, JSON.stringify(data.budgets));

                resolve({ success: true });
              } catch (error) {
                console.error('Error saving imported data:', error);
                resolve({ success: false, error: error.message });
              }
            },
          },
        ],
        { cancelable: false }
      );
    });
  } catch (error) {
    console.error('Error importing from clipboard:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Clear all app data
 * @returns {Promise<{success: boolean, error?: string}>} Clear result
 */
export const clearAllData = async () => {
  try {
    // Confirm clearing with user
    return new Promise((resolve) => {
      Alert.alert(
        'Clear All Data',
        'This will permanently delete all your financial data. This action cannot be undone. Are you sure you want to continue?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve({ success: false, error: 'Clearing canceled by user' }),
          },
          {
            text: 'Clear Data',
            style: 'destructive',
            onPress: async () => {
              try {
                // Clear specific keys instead of all AsyncStorage
                await AsyncStorage.multiRemove([TRANSACTIONS_KEY, BUDGETS_KEY]);

                resolve({ success: true });
              } catch (error) {
                console.error('Error clearing data:', error);
                resolve({ success: false, error: error.message });
              }
            },
          },
        ],
        { cancelable: false }
      );
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    return { success: false, error: error.message };
  }
}; 