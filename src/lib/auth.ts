import * as SecureStore from 'expo-secure-store';
import { TokenCache } from '@clerk/clerk-expo';

// Token cache implementation for Clerk
export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};