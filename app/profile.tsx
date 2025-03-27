import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import Header from "../src/components/Header";
import NavigationBar from "../src/components/NavigationBar";
import {
  User,
  Settings,
  BookOpen,
  LogOut,
  Award,
  Edit,
  ChevronRight,
} from "lucide-react-native";
import { useAuth } from "../src/context/AuthContext";
import { getReadingStats, getProjects } from "../src/services/api";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [readingStats, setReadingStats] = useState({
    booksRead: 0,
    pagesRead: 0,
    hoursRead: 0,
  });
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getReadingStats();
        const projects = await getProjects();
        setReadingStats(stats);
        setProjectCount(projects.length);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: logout,
        style: "destructive",
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title="Profile" showBackButton={false} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="mt-4 text-gray-600">Loading your profile...</Text>
        </View>
        <NavigationBar activeTab="profile" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Profile" showBackButton={false} />
      <ScrollView className="flex-1 p-4">
        <View className="items-center justify-center py-6">
          {user?.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              className="w-24 h-24 rounded-full mb-4"
              resizeMode="cover"
            />
          ) : (
            <View className="bg-gray-100 rounded-full p-6 mb-4">
              <User size={60} color="#4f46e5" strokeWidth={1.5} />
            </View>
          )}
          <Text className="text-2xl font-bold text-gray-800">
            {user?.name || "User Name"}
          </Text>
          <Text className="text-gray-500 mb-2">
            {user?.email || "user@example.com"}
          </Text>
          <View className="bg-primary-50 px-3 py-1 rounded-full mb-6">
            <Text className="text-primary-700 text-sm font-medium">
              {user?.role || "Reader"}
            </Text>
          </View>

          {/* Stats */}
          <View className="w-full bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="font-medium text-gray-800 mb-3">Your Stats</Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-xl font-bold text-primary-600">
                  {readingStats.booksRead}
                </Text>
                <Text className="text-xs text-gray-500">Books Read</Text>
              </View>
              <View className="items-center">
                <Text className="text-xl font-bold text-primary-600">
                  {projectCount}
                </Text>
                <Text className="text-xs text-gray-500">Projects</Text>
              </View>
              <View className="items-center">
                <Text className="text-xl font-bold text-primary-600">
                  {readingStats.hoursRead}
                </Text>
                <Text className="text-xs text-gray-500">Hours Read</Text>
              </View>
            </View>
          </View>

          {/* Profile options */}
          <View className="w-full">
            <TouchableOpacity
              className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl mb-3"
              onPress={() =>
                Alert.alert(
                  "Account Settings",
                  "This feature will be available soon.",
                )
              }
            >
              <View className="flex-row items-center">
                <User size={24} color="#4f46e5" />
                <Text className="ml-3 text-gray-800 font-medium">
                  Account Settings
                </Text>
              </View>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl mb-3"
              onPress={() =>
                Alert.alert(
                  "Preferences",
                  "This feature will be available soon.",
                )
              }
            >
              <View className="flex-row items-center">
                <Settings size={24} color="#4f46e5" />
                <Text className="ml-3 text-gray-800 font-medium">
                  Preferences
                </Text>
              </View>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl mb-3"
              onPress={() => router.push("/my-books")}
            >
              <View className="flex-row items-center">
                <BookOpen size={24} color="#4f46e5" />
                <Text className="ml-3 text-gray-800 font-medium">
                  Reading History
                </Text>
              </View>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl mb-3"
              onPress={() => router.push("/achievements")}
            >
              <View className="flex-row items-center">
                <Award size={24} color="#4f46e5" />
                <Text className="ml-3 text-gray-800 font-medium">
                  Achievements
                </Text>
              </View>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 bg-red-50 rounded-xl mt-6"
              onPress={handleLogout}
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
