/**
 * Storage utility that provides a platform-agnostic way to use AsyncStorage
 * This wrapper helps prevent "window is not defined" errors by providing fallbacks
 *
 * NOTE: This file is kept for backward compatibility but is no longer used for
 * authentication or data storage. All data is now stored in Supabase.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a safe wrapper around AsyncStorage
const safeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Error reading from storage:", error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error("Error writing to storage:", error);
      return false;
    }
  },

  removeItem: async (key: string): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from storage:", error);
      return false;
    }
  },

  clear: async (): Promise<boolean> => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing storage:", error);
      return false;
    }
  },
};

export default safeStorage;
