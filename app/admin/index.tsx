import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { UserRole } from "../../src/utils/auth";
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  PlusCircle,
  BookCopy,
  FileText,
  UserCheck,
} from "lucide-react-native";

export default function AdminDashboard() {
  const { user, hasRole } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBooks: 245,
    activeUsers: 128,
    booksCheckedOut: 37,
    pendingApprovals: 5,
  });

  useEffect(() => {
    // Check if user has admin or librarian role
    if (!user || !hasRole(UserRole.LIBRARIAN)) {
      Alert.alert(
        "Access Denied",
        "You do not have permission to access this area.",
      );
      router.replace("/");
    }
  }, [hasRole, router, user]);

  const isAdmin = user?.role === UserRole.ADMIN;

  const adminCards = [
    {
      title: "Manage Books",
      icon: BookCopy,
      color: "#4f46e5",
      onPress: () => router.push("/admin/books"),
      description: "Add, edit, or remove books from the library",
    },
    {
      title: "User Management",
      icon: Users,
      color: "#0891b2",
      onPress: () => router.push("/admin/users"),
      description: "Manage user accounts and permissions",
      adminOnly: true,
    },
    {
      title: "Student Submissions",
      icon: FileText,
      color: "#ca8a04",
      onPress: () => router.push("/admin/submissions"),
      description: "Review and approve student writing submissions",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      color: "#16a34a",
      onPress: () => router.push("/admin/analytics"),
      description: "View library usage statistics and reports",
    },
    {
      title: "System Settings",
      icon: Settings,
      color: "#9333ea",
      onPress: () => router.push("/admin/settings" as any),
      description: "Configure system settings and preferences",
      adminOnly: true,
    },
    {
      title: "Add New Book",
      icon: PlusCircle,
      color: "#dc2626",
      onPress: () => router.push("/admin/books/new"),
      description: "Add a new book to the library catalog",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-primary-600 px-6 py-4">
        <Text className="text-white text-2xl font-bold">Admin Dashboard</Text>
        <Text className="text-primary-100">
          Logged in as: {user?.name} ({user?.role})
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Stats Overview */}
        <View className="flex-row flex-wrap justify-between mb-6">
          <View className="bg-white rounded-xl p-4 shadow-sm w-[48%] mb-4">
            <View className="bg-blue-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
              <BookOpen size={20} color="#4f46e5" />
            </View>
            <Text className="text-2xl font-bold">{stats.totalBooks}</Text>
            <Text className="text-gray-500">Total Books</Text>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm w-[48%] mb-4">
            <View className="bg-green-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
              <Users size={20} color="#16a34a" />
            </View>
            <Text className="text-2xl font-bold">{stats.activeUsers}</Text>
            <Text className="text-gray-500">Active Users</Text>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm w-[48%] mb-4">
            <View className="bg-amber-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
              <BookCopy size={20} color="#ca8a04" />
            </View>
            <Text className="text-2xl font-bold">{stats.booksCheckedOut}</Text>
            <Text className="text-gray-500">Books Checked Out</Text>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm w-[48%] mb-4">
            <View className="bg-red-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
              <FileText size={20} color="#dc2626" />
            </View>
            <Text className="text-2xl font-bold">{stats.pendingApprovals}</Text>
            <Text className="text-gray-500">Pending Approvals</Text>
          </View>
        </View>

        {/* Admin Functions */}
        <Text className="text-xl font-bold mb-4">Admin Functions</Text>
        <View className="flex-row flex-wrap justify-between">
          {adminCards.map((card: any, index: number) => {
            // Skip admin-only cards for librarians
            if (card.adminOnly && !isAdmin) return null;

            return (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm w-[48%] mb-4"
                onPress={card.onPress}
              >
                <View
                  style={{ backgroundColor: `${card.color}20` }}
                  className="p-2 rounded-full w-10 h-10 items-center justify-center mb-2"
                >
                  <card.icon size={20} color={card.color} />
                </View>
                <Text className="text-lg font-bold mb-1">{card.title}</Text>
                <Text className="text-gray-500 text-sm">
                  {card.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
