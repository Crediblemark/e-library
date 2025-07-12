import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { UserRole } from "../utils/auth";
import {
  supabase,
  createSupabaseWithAuth0,
  signIn,
  signOut,
  getCurrentSession,
} from "../services/supabase";
import { auth0Service, Auth0Tokens, Auth0User } from "../services/auth0";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define User interface based on Supabase auth user
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithAuth0: () => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  loginWithAuth0: async () => false,
  logout: async () => {},
  isAuthenticated: false,
  hasRole: () => false,
});

// Storage keys
const AUTH0_TOKENS_KEY = 'auth0_tokens';
const AUTH0_USER_KEY = 'auth0_user';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in with Supabase
    const loadUser = async () => {
      try {
        const { data, error } = await getCurrentSession();

        if (error || !data.session) {
          setUser(null);
          return;
        }

        // Get user profile data from the profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
        }

        // Create user object combining auth and profile data
        const userData: User = {
          id: data.session.user.id,
          email: data.session.user.email || "",
          role: (profileData?.role as UserRole) || UserRole.READER,
          name:
            profileData?.name || data.session.user.email?.split("@")[0] || "",
          avatar: profileData?.avatar_url,
        };

        setUser(userData);
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Get user profile data
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profileError && profileError.code !== "PGRST116") {
            console.error("Error fetching user profile:", profileError);
          }

          // Create user object
          const userData: User = {
            id: session.user.id,
            email: session.user.email || "",
            role: (profileData?.role as UserRole) || UserRole.READER,
            name: profileData?.name || session.user.email?.split("@")[0] || "",
            avatar: profileData?.avatar_url,
          };

          setUser(userData);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      },
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("AuthContext: Attempting login with email:", email);
      const { data, error } = await signIn(email, password);

      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }

      if (!data || !data.user) {
        console.error("Login failed: No user data returned");
        return false;
      }

      console.log("Login successful for user:", data.user.id);
      // User will be set by the auth state change listener
      return true;
    } catch (error) {
      console.error("Login exception:", error);
      throw error;
    }
  };

  const loginWithAuth0 = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Perform Auth0 login
      const tokens = await auth0Service.login();
      if (!tokens) {
        console.error('Auth0 login failed: No tokens received');
        return false;
      }

      // Get user info from Auth0
      const auth0User = await auth0Service.getUserInfo(tokens.accessToken);
      if (!auth0User) {
        console.error('Auth0 login failed: Could not get user info');
        return false;
      }

      // Store Auth0 tokens and user info using Auth0Service methods
      await auth0Service.storeTokens(tokens);
      
      // Store user info in AsyncStorage for compatibility
      await AsyncStorage.setItem(AUTH0_USER_KEY, JSON.stringify(auth0User));

      // Create Supabase client with Auth0 token for third-party auth
      const supabaseWithAuth0 = createSupabaseWithAuth0(tokens.accessToken);
      
      // Check if user exists in profiles table, create if not
      const { data: existingProfile, error: profileError } = await supabaseWithAuth0
        .from('profiles')
        .select('*')
        .eq('email', auth0User.email)
        .single();

      let profileData = existingProfile;
      
      if (profileError && profileError.code === 'PGRST116') {
        // User doesn't exist, create profile
        const { data: newProfile, error: createError } = await supabaseWithAuth0
          .from('profiles')
          .insert({
            id: auth0User.sub,
            email: auth0User.email,
            name: auth0User.name || auth0User.email?.split('@')[0],
            avatar_url: auth0User.picture,
            role: 'reader', // Default role
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating user profile:', createError);
        } else {
          profileData = newProfile;
        }
      }

      // Create user object for context
      const userData: User = {
        id: auth0User.sub,
        email: auth0User.email,
        role: (profileData?.role as UserRole) || UserRole.READER,
        name: auth0User.name || profileData?.name || auth0User.email?.split('@')[0] || '',
        avatar: auth0User.picture || profileData?.avatar_url,
      };

      setUser(userData);
      console.log('Auth0 login successful');
      return true;
    } catch (error) {
      console.error('Auth0 login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Check if user logged in with Auth0
      const auth0Tokens = await auth0Service.getStoredTokens();
      
      if (auth0Tokens) {
        // Logout from Auth0
        await auth0Service.logout();
        // Clear Auth0 data from storage
        await auth0Service.clearStoredTokens();
        await AsyncStorage.removeItem(AUTH0_USER_KEY);
        // Clear user state immediately for Auth0 users
        setUser(null);
      } else {
        // Logout from Supabase for regular users
        const { error } = await signOut();
        if (error) {
          console.error("Logout error:", error);
        }
        // User will be cleared by the auth state change listener
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const hasRole = (role: UserRole) => {
    if (!user) return false;

    // Admin has access to everything
    if (user.role === UserRole.ADMIN) return true;

    // Librarian has access to librarian and reader roles
    if (user.role === UserRole.LIBRARIAN && role !== UserRole.ADMIN)
      return true;

    // Reader only has access to reader role
    if (user.role === UserRole.READER && role === UserRole.READER) return true;

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithAuth0,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
