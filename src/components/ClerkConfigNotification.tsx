import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ClerkConfigNotificationProps {
  onDismiss?: () => void;
}

export const ClerkConfigNotification: React.FC<ClerkConfigNotificationProps> = ({ onDismiss }) => {
  const openClerkDashboard = () => {
    Linking.openURL('https://dashboard.clerk.com');
  };

  const openDocumentation = () => {
    // In a real app, this could open a help modal or documentation
    console.log('Opening JWT template configuration guide');
  };

  return (
    <View className="bg-orange-50 border border-orange-200 rounded-lg p-4 m-4">
      <View className="flex-row items-start">
        <Ionicons name="warning" size={24} color="#f97316" className="mr-3 mt-1" />
        <View className="flex-1">
          <Text className="text-orange-800 font-semibold text-base mb-2">
            Konfigurasi Clerk Diperlukan
          </Text>
          <Text className="text-orange-700 text-sm mb-3 leading-5">
            JWT template 'supabase' belum dikonfigurasi di Clerk dashboard. 
            Aplikasi tidak dapat mengakses data dari Supabase tanpa konfigurasi ini.
          </Text>
          
          <View className="space-y-2">
            <TouchableOpacity 
              onPress={openClerkDashboard}
              className="bg-orange-100 border border-orange-300 rounded-md px-3 py-2"
            >
              <Text className="text-orange-800 font-medium text-center">
                Buka Clerk Dashboard
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={openDocumentation}
              className="bg-white border border-orange-300 rounded-md px-3 py-2"
            >
              <Text className="text-orange-700 text-center">
                Lihat Panduan Konfigurasi
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text className="text-orange-600 text-xs mt-3 leading-4">
            Langkah singkat: Clerk Dashboard → JWT Templates → New Template → Supabase → 
            Name: 'supabase' → Save
          </Text>
        </View>
        
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} className="ml-2">
            <Ionicons name="close" size={20} color="#f97316" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ClerkConfigNotification;