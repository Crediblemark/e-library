import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Clerk configuration
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

if (!clerkPublishableKey) {
  console.warn('Clerk publishable key is missing. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable.');
}

export interface ClerkUser {
  id: string;
  emailAddresses: Array<{
    emailAddress: string;
    id: string;
  }>;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  username?: string;
}

export interface ClerkTokens {
  sessionToken: string;
  userId: string;
  expiresAt: number;
}

// Storage utility for tokens
const tokenStorage = {
  async getToken(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return localStorage.getItem(key);
        }
        return null;
      } else {
        // Use SecureStore for mobile platforms for better security
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async setToken(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(key, value);
        }
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },

  async removeToken(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(key);
        }
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
};

class ClerkService {
  private static instance: ClerkService;
  private sessionToken: string | null = null;
  private userId: string | null = null;

  constructor() {
    this.loadStoredSession();
  }

  static getInstance(): ClerkService {
    if (!ClerkService.instance) {
      ClerkService.instance = new ClerkService();
    }
    return ClerkService.instance;
  }

  private async loadStoredSession(): Promise<void> {
    try {
      const storedToken = await tokenStorage.getToken('clerk_session_token');
      const storedUserId = await tokenStorage.getToken('clerk_user_id');
      
      if (storedToken && storedUserId) {
        this.sessionToken = storedToken;
        this.userId = storedUserId;
      }
    } catch (error) {
      console.error('Error loading stored session:', error);
    }
  }

  async storeSession(tokens: ClerkTokens): Promise<void> {
    try {
      await tokenStorage.setToken('clerk_session_token', tokens.sessionToken);
      await tokenStorage.setToken('clerk_user_id', tokens.userId);
      await tokenStorage.setToken('clerk_expires_at', tokens.expiresAt.toString());
      
      this.sessionToken = tokens.sessionToken;
      this.userId = tokens.userId;
    } catch (error) {
      console.error('Error storing session:', error);
    }
  }

  async clearSession(): Promise<void> {
    try {
      await tokenStorage.removeToken('clerk_session_token');
      await tokenStorage.removeToken('clerk_user_id');
      await tokenStorage.removeToken('clerk_expires_at');
      
      this.sessionToken = null;
      this.userId = null;
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  getSessionToken(): string | null {
    return this.sessionToken;
  }

  getUserId(): string | null {
    return this.userId;
  }

  async isSessionValid(): Promise<boolean> {
    try {
      if (!this.sessionToken) {
        return false;
      }

      const expiresAtStr = await tokenStorage.getToken('clerk_expires_at');
      if (!expiresAtStr) {
        return false;
      }

      const expiresAt = parseInt(expiresAtStr, 10);
      const now = Date.now();
      
      return now < expiresAt;
    } catch (error) {
      console.error('Error checking session validity:', error);
      return false;
    }
  }

  // This method will be used by the Clerk hooks in the AuthContext
  // The actual authentication will be handled by Clerk's built-in components and hooks
  async handleSessionUpdate(sessionToken: string | null, userId: string | null): Promise<void> {
    if (sessionToken && userId) {
      // Session created/updated
      const tokens: ClerkTokens = {
        sessionToken,
        userId,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
      };
      await this.storeSession(tokens);
    } else {
      // Session cleared
      await this.clearSession();
    }
  }
}

export const clerkService = ClerkService.getInstance();
export { clerkPublishableKey };