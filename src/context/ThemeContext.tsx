import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { COLORS, COLORS_DARK } from "../utils/theme";

// Define ThemeContext type
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: typeof COLORS | typeof COLORS_DARK;
  isLoading: boolean;
} | null;

// Create context
const ThemeContext = createContext<ThemeContextType>(null);

// Storage key
const THEME_MODE_KEY = "@cashflow_theme_mode";

export const ThemeProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load theme preference from storage on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedThemeMode = await AsyncStorage.getItem(THEME_MODE_KEY);
        if (storedThemeMode !== null) {
          setIsDarkMode(storedThemeMode === "dark");
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference to storage whenever it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem(
          THEME_MODE_KEY,
          isDarkMode ? "dark" : "light"
        );
      } catch (error) {
        console.error("Error saving theme preference:", error);
      }
    };

    if (!isLoading) {
      saveThemePreference();
    }
  }, [isDarkMode, isLoading]);

  // Toggle theme mode
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Get current theme colors using useMemo to prevent unnecessary recalculations
  const theme = useMemo(() => {
    return isDarkMode ? COLORS_DARK : COLORS;
  }, [isDarkMode]);

  const value = {
    isDarkMode,
    toggleTheme,
    theme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export default ThemeContext;
