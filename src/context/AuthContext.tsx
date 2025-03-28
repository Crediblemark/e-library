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
  signIn,
  signOut,
  getCurrentSession,
} from "../services/supabase";

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
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  isAuthenticated: false,
  hasRole: () => false,
});

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

  const logout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error("Logout error:", error);
      }
      // User will be cleared by the auth state change listener
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
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
