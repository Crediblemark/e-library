import React, { useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useClerkConfig } from '../hooks/useClerkConfig';
import { ClerkConfigNotification } from './ClerkConfigNotification';

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { isSignedIn } = useAuth();
  const { isConfigured, isLoading, error } = useClerkConfig();
  const [notificationDismissed, setNotificationDismissed] = useState(false);

  const shouldShowNotification = 
    isSignedIn && 
    !isLoading && 
    !isConfigured && 
    error && 
    !notificationDismissed;

  return (
    <View className="flex-1">
      {shouldShowNotification && (
        <ClerkConfigNotification 
          onDismiss={() => setNotificationDismissed(true)}
        />
      )}
      {children}
    </View>
  );
};

export default AppWrapper;