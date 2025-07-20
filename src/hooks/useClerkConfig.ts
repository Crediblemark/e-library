import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';

export interface ClerkConfigStatus {
  isConfigured: boolean;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useClerkConfig = () => {
  const { getToken, isSignedIn } = useAuth();
  const [status, setStatus] = useState<ClerkConfigStatus>({
    isConfigured: false,
    isLoading: true,
    error: null,
    lastChecked: null,
  });

  const checkConfiguration = async () => {
    if (!isSignedIn) {
      setStatus({
        isConfigured: false,
        isLoading: false,
        error: 'User not signed in',
        lastChecked: new Date(),
      });
      return;
    }

    setStatus(prev => ({ ...prev, isLoading: true }));

    try {
      const token = await getToken({ template: 'supabase' });
      
      if (token) {
        setStatus({
          isConfigured: true,
          isLoading: false,
          error: null,
          lastChecked: new Date(),
        });
      } else {
        setStatus({
          isConfigured: false,
          isLoading: false,
          error: 'JWT template "supabase" not configured in Clerk dashboard',
          lastChecked: new Date(),
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setStatus({
        isConfigured: false,
        isLoading: false,
        error: `JWT template configuration error: ${errorMessage}`,
        lastChecked: new Date(),
      });
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      checkConfiguration();
    }
  }, [isSignedIn]);

  return {
    ...status,
    recheckConfiguration: checkConfiguration,
  };
};

export default useClerkConfig;