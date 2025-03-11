import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { FONTS, SHADOWS, SIZES } from '../utils/theme';

const ProfileScreen = ({ navigation }) => {
  const { userProfile, updateProfile, isLoading } = useUser();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setOccupation(userProfile.occupation || '');
      setProfileImage(userProfile.profileImage);
    }
  }, [userProfile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        occupation,
        profileImage,
      });
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload a profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.primary }]}>
                  <MaterialCommunityIcons name="account" size={80} color={theme.white} />
                </View>
              )}
              <View style={[styles.editIconContainer, { backgroundColor: theme.primary }]}>
                <MaterialCommunityIcons name="camera" size={16} color={theme.white} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.formContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Name</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
              placeholder="Enter your name"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Occupation</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
              placeholder="Enter your occupation"
              placeholderTextColor={theme.textSecondary}
              value={occupation}
              onChangeText={setOccupation}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
              onPress={() => navigation.goBack()}
              disabled={isSaving}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={theme.white} />
              ) : (
                <Text style={[styles.buttonText, { color: theme.white }]}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: SIZES.m,
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
  profileHeader: {
    alignItems: 'center',
    marginVertical: SIZES.xl,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  formContainer: {
    padding: SIZES.m,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.m,
    borderWidth: 1,
  },
  inputLabel: {
    ...FONTS.medium,
    fontSize: 14,
    marginBottom: SIZES.xs,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.m,
    marginBottom: SIZES.m,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.m,
    marginBottom: SIZES.xl,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SIZES.xs,
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    borderWidth: 0,
  },
  buttonText: {
    ...FONTS.medium,
    fontSize: 16,
  },
});

export default ProfileScreen; 