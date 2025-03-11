import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create context
const UserContext = createContext();

// Storage key
const USER_PROFILE_KEY = '@cashflow_user_profile';

// Default profile
const DEFAULT_PROFILE = {
  name: '',
  occupation: '',
  profileImage: null,
};

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile from storage on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);

        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  // Save user profile to storage whenever it changes
  useEffect(() => {
    const saveUserProfile = async () => {
      try {
        await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
      } catch (error) {
        console.error('Error saving user profile:', error);
      }
    };

    if (!isLoading) {
      saveUserProfile();
    }
  }, [userProfile, isLoading]);

  // Update user profile
  const updateProfile = (newProfile) => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      ...newProfile,
    }));
  };

  const value = {
    userProfile,
    updateProfile,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 