import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Header from "../src/components/Header";
import NavigationBar from "../src/components/NavigationBar";
import { User, Settings, BookOpen, LogOut } from "lucide-react-native";
import { useAuth } from "../src/context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Profile" showBackButton={false} />
      <ScrollView className="flex-1 p-4">
        <View className="items-center justify-center py-6">
          <View className="bg-gray-100 rounded-full p-6 mb-4">
            <User size={60} color="#4f46e5" strokeWidth={1.5} />
          </View>
          <Text className="text-2xl font-bold text-gray-800">
            {user?.name || "User Name"}
          </Text>
          <Text className="text-gray-500 mb-6">
            {user?.email || "user@example.com"}
          </Text>

          {/* Profile options */}
          <View className="w-full mt-4">
            <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3">
              <User size={24} color="#4f46e5" />
              <Text className="ml-3 text-gray-800 font-medium">
                Account Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3">
              <Settings size={24} color="#4f46e5" />
              <Text className="ml-3 text-gray-800 font-medium">
                Preferences
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3">
              <BookOpen size={24} color="#4f46e5" />
              <Text className="ml-3 text-gray-800 font-medium">
                Reading History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 bg-red-50 rounded-xl mt-6"
              onPress={logout}
            >
              <LogOut size={24} color="#ef4444" />
              <Text className="ml-3 text-red-600 font-medium">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <NavigationBar activeTab="profile" />
    </SafeAreaView>
  );
}
