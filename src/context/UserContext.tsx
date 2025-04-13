import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define user profile type
type UserProfile = {
  name: string;
  occupation: string;
  profileImage: string | null;
  [key: string]: any;
};

// Define context type
type UserContextType = {
  userProfile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  isLoading: boolean;
} | null;

// Create context
const UserContext = createContext<UserContextType>(null);

// Storage key
const USER_PROFILE_KEY = "@cashflow_user_profile";

// Default profile
const DEFAULT_PROFILE: UserProfile = {
  name: "",
  occupation: "",
  profileImage: null,
};

export const UserProvider: React.FC<{ children: any }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        console.error("Error loading user profile:", error);
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
        await AsyncStorage.setItem(
          USER_PROFILE_KEY,
          JSON.stringify(userProfile)
        );
      } catch (error) {
        console.error("Error saving user profile:", error);
      }
    };

    if (!isLoading) {
      saveUserProfile();
    }
  }, [userProfile, isLoading]);

  // Update user profile
  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile((prevProfile: UserProfile) => ({
      ...prevProfile,
      ...newProfile,
    }));
  };

  const value = {
    userProfile,
    updateProfile,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
