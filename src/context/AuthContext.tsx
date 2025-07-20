import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { UserRole } from "../utils/auth";
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-expo';
import { supabase } from "../services/supabase";

// Define User interface based on Clerk user with Supabase integration
export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatar?: string;
  clerkId: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  syncUserWithSupabase: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: async () => {},
  isAuthenticated: false,
  hasRole: () => false,
  syncUserWithSupabase: async () => {},
});
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isSignedIn, isLoaded, signOut, getToken } = useClerkAuth();
  const { user: clerkUserDetails } = useClerkUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync user data with Supabase
  const syncUserWithSupabase = async () => {
    if (!clerkUserDetails || !isSignedIn) {
      setUser(null);
      return;
    }

    try {
      const clerkId = clerkUserDetails.id;
      const email = clerkUserDetails.emailAddresses[0]?.emailAddress;
      const firstName = clerkUserDetails.firstName;
      const lastName = clerkUserDetails.lastName;
      const fullName = `${firstName || ''} ${lastName || ''}`.trim();

      if (!email) {
        console.error('No email found for Clerk user');
        return;
      }

      // Get authenticated Supabase client
      let token;
      try {
        token = await getToken({ template: 'supabase' });
      } catch (error) {
        console.error('Error getting Supabase token - JWT template may not be configured:', error);
        console.warn('Please configure JWT template in Clerk dashboard. See CLERK_JWT_TEMPLATE_FIX.md for instructions.');
        return;
      }
      
      if (!token) {
        console.error('No authentication token available - check Clerk JWT template configuration');
        return;
      }

      const { createSupabaseWithClerk } = await import('../services/supabase');
      const authenticatedSupabase = createSupabaseWithClerk(token);

      // Check if user exists in Supabase
      const { data: existingUser, error: fetchError } = await authenticatedSupabase
        .from('users')
        .select('*')
        .eq('clerk_id', clerkId)
        .single();

      let userData: User;

      if (existingUser && !fetchError) {
        // User exists, update if needed
        const { data: updatedUser, error: updateError } = await authenticatedSupabase
          .from('users')
          .update({
            email,
            first_name: firstName,
            last_name: lastName,
            name: fullName,
            updated_at: new Date().toISOString(),
          })
          .eq('clerk_id', clerkId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user:', updateError);
          return;
        }

        userData = {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role as UserRole,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          name: updatedUser.name,
          avatar: updatedUser.avatar_url,
          clerkId: updatedUser.clerk_id,
        };
      } else {
        // User doesn't exist, create new user
        const { data: newUser, error: createError } = await authenticatedSupabase
          .from('users')
          .insert({
            clerk_id: clerkId,
            email,
            first_name: firstName,
            last_name: lastName,
            name: fullName,
            role: UserRole.READER, // Default role
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          return;
        }

        userData = {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role as UserRole,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          name: newUser.name,
          avatar: newUser.avatar_url,
          clerkId: newUser.clerk_id,
        };
      }

      setUser(userData);
    } catch (error) {
      console.error('Error syncing user with Supabase:', error);
    }
  };

  // Effect to handle Clerk authentication state changes
  useEffect(() => {
    const handleAuthState = async () => {
      if (!isLoaded) {
        return; // Wait for Clerk to load
      }

      setIsLoading(true);

      try {
        if (isSignedIn && clerkUserDetails) {
          // User is signed in with Clerk, sync with Supabase
          await syncUserWithSupabase();
        } else {
          // User is not signed in
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to handle auth state:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthState();
  }, [isLoaded, isSignedIn, clerkUserDetails]);

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      setUser(null);
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const isAuthenticated = !!user;
  const hasRole = (role: UserRole) => user?.role === role;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        logout,
        isAuthenticated,
        hasRole,
        syncUserWithSupabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
