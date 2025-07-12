import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

// Auth0 configuration
const auth0Domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN || '';
const auth0ClientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || '';

// Get redirect URI based on platform
const getRedirectUri = () => {
  if (Platform.OS === 'web') {
    return `${window.location.origin}/auth`;
  } else {
    return AuthSession.makeRedirectUri();
  }
};

// Auth0 discovery endpoints
const discovery = {
  authorizationEndpoint: `https://${auth0Domain}/authorize`,
  tokenEndpoint: `https://${auth0Domain}/oauth/token`,
  revocationEndpoint: `https://${auth0Domain}/oauth/revoke`,
};

export interface Auth0User {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

export interface Auth0Tokens {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
}

class Auth0Service {
  private request: AuthSession.AuthRequest | null = null;
  private codeVerifier: string | null = null;

  constructor() {
    // Lazy initialization - will be called when login is triggered
  }

  private async generateCodeChallenge(): Promise<{ codeVerifier: string; codeChallenge: string }> {
    if (Platform.OS === 'web') {
      // Use Web Crypto API for web platform
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      
      const codeVerifier = btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      // Generate code challenge using Web Crypto API
      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = new Uint8Array(hashBuffer);
      
      const codeChallenge = btoa(String.fromCharCode(...hashArray))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      return { codeVerifier, codeChallenge };
    } else {
      // Use simple random string for mobile platforms
      const codeVerifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      // For mobile, we'll use the same value for both (simplified approach)
      return {
        codeVerifier: codeVerifier,
        codeChallenge: codeVerifier
      };
    }
  }

  private async initializeRequest() {
    try {
      // Generate PKCE challenge
      const { codeVerifier, codeChallenge } = await this.generateCodeChallenge();
      
      // Store code verifier for token exchange
      this.codeVerifier = codeVerifier;

      this.request = new AuthSession.AuthRequest({
        clientId: auth0ClientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: getRedirectUri(),
        responseType: AuthSession.ResponseType.Code,
        codeChallenge,
        codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
        extraParams: {
          audience: `https://${auth0Domain}/api/v2/`,
        },
      });
    } catch (error) {
      console.error('Failed to initialize Auth0 request:', error);
      throw error;
    }
  }

  async login(): Promise<Auth0Tokens | null> {
    try {
      if (!this.request) {
        await this.initializeRequest();
      }

      if (!this.request) {
        throw new Error('Failed to initialize auth request');
      }

      const result = await this.request.promptAsync(discovery);

      if (result.type === 'success') {
        const { code } = result.params;
        
        // Exchange code for tokens
        const tokens = await this.exchangeCodeForTokens(code);
        // Store tokens after successful login
        await this.storeTokens(tokens);
        return tokens;
      } else {
        console.log('Auth cancelled or failed:', result);
        return null;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  private async exchangeCodeForTokens(code: string): Promise<Auth0Tokens> {
    const response = await fetch(`https://${auth0Domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: auth0ClientId,
        code,
        redirect_uri: getRedirectUri(),
        code_verifier: this.codeVerifier,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', errorText);
      throw new Error(`Failed to exchange code for tokens: ${response.status}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      idToken: data.id_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
    };
  }

  async getUserInfo(accessToken: string): Promise<Auth0User | null> {
    try {
      const response = await fetch(`https://${auth0Domain}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user info');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear local state
      this.request = null;
      this.codeVerifier = null;

      // For web platform, redirect to Auth0 logout
      if (Platform.OS === 'web') {
        const logoutUrl = `https://${auth0Domain}/v2/logout?client_id=${auth0ClientId}&returnTo=${encodeURIComponent(window.location.origin)}`;
        window.location.href = logoutUrl;
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getStoredTokens(): Promise<Auth0Tokens | null> {
    try {
      if (Platform.OS === 'web') {
        // For web, try to get tokens from localStorage
        const storedTokens = localStorage.getItem('auth0_tokens');
        if (storedTokens) {
          return JSON.parse(storedTokens);
        }
      } else {
        // For mobile, use AsyncStorage
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const storedTokens = await AsyncStorage.getItem('auth0_tokens');
        if (storedTokens) {
          return JSON.parse(storedTokens);
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting stored tokens:', error);
      return null;
    }
  }

  async storeTokens(tokens: Auth0Tokens): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('auth0_tokens', JSON.stringify(tokens));
      } else {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem('auth0_tokens', JSON.stringify(tokens));
      }
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }

  async clearStoredTokens(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('auth0_tokens');
        localStorage.removeItem('auth0_user');
      } else {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.removeItem('auth0_tokens');
        await AsyncStorage.removeItem('auth0_user');
      }
    } catch (error) {
      console.error('Error clearing stored tokens:', error);
    }
  }
}

export const auth0Service = new Auth0Service();