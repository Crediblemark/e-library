import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../src/context/AuthContext";
import { UserRole } from "../../../src/utils/auth";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  Calendar,
  BookCopy,
  FileText,
} from "lucide-react-native";

export default function AnalyticsDashboard() {
  const router = useRouter();
  const { user, hasRole } = useAuth();

  useEffect(() => {
    // Check if user has librarian or admin role
    if (!user || !hasRole(UserRole.LIBRARIAN)) {
      Alert.alert(
        "Access Denied",
        "You do not have permission to access this area.",
      );
      router.replace("/admin");
    }
  }, [hasRole, router, user]);

  // Mock data for analytics
  const overviewStats = [
    {
      title: "Total Books Borrowed",
      value: "1,245",
      change: "+12%",
      trend: "up",
      icon: BookCopy,
      color: "#4f46e5",
    },
    {
      title: "Active Readers",
      value: "328",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "#16a34a",
    },
    {
      title: "Reading Time",
      value: "4,892 hrs",
      change: "+15%",
      trend: "up",
      icon: Clock,
      color: "#ca8a04",
    },
    {
      title: "Student Submissions",
      value: "87",
      change: "+23%",
      trend: "up",
      icon: FileText,
      color: "#dc2626",
    },
  ];

  const popularBooks = [
    { title: "The Great Gatsby", borrows: 78 },
    { title: "To Kill a Mockingbird", borrows: 65 },
    { title: "1984", borrows: 52 },
    { title: "The Hobbit", borrows: 48 },
    { title: "Pride and Prejudice", borrows: 41 },
  ];

  const activeReaders = [
    { name: "Alex Student", booksRead: 12, readingTime: 48 },
    { name: "Taylor Student", booksRead: 9, readingTime: 36 },
    { name: "Jordan Student", booksRead: 15, readingTime: 62 },
    { name: "Casey Student", booksRead: 7, readingTime: 28 },
    { name: "Riley Student", booksRead: 11, readingTime: 44 },
  ];

  const monthlyActivity = [
    { month: "Jan", borrows: 95 },
    { month: "Feb", borrows: 110 },
    { month: "Mar", borrows: 125 },
    { month: "Apr", borrows: 115 },
    { month: "May", borrows: 130 },
    { month: "Jun", borrows: 145 },
  ];

  // Function to render a simple bar chart
  const renderBarChart = (data: any[], valueKey: string) => {
    const maxValue = Math.max(...data.map((item: any) => item[valueKey]));

    return (
      <View className="flex-row items-end justify-between h-40 mt-2">
        {data.map((item, index) => {
          const barHeight = (item[valueKey] / maxValue) * 100;
          return (
            <View key={index} className="items-center">
              <View
                style={{ height: `${barHeight}%` }}
                className="w-8 bg-primary-500 rounded-t-md"
              />
              <Text className="text-xs text-gray-600 mt-1">{item.month}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#4f46e5" />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1">Analytics Dashboard</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Overview Stats */}
        <Text className="text-lg font-bold mb-3">Overview</Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {overviewStats.map((stat, index) => (
            <View
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm w-[48%] mb-4"
            >
              <View className="flex-row justify-between items-start">
                <View
                  style={{ backgroundColor: `${stat.color}20` }}
                  className="p-2 rounded-full w-10 h-10 items-center justify-center"
                >
                  <stat.icon size={20} color={stat.color} />
                </View>
                <View
                  className={`flex-row items-center ${stat.trend === "up" ? "bg-green-100" : "bg-red-100"} px-2 py-1 rounded-full`}
                >
                  <TrendingUp
                    size={12}
                    color={stat.trend === "up" ? "#16a34a" : "#dc2626"}
                  />
                  <Text
                    className={`text-xs ml-1 ${stat.trend === "up" ? "text-green-700" : "text-red-700"}`}
                  >
                    {stat.change}
                  </Text>
                </View>
              </View>
              <Text className="text-2xl font-bold mt-2">{stat.value}</Text>
              <Text className="text-gray-500 text-sm">{stat.title}</Text>
            </View>
          ))}
        </View>

        {/* Monthly Activity Chart */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold">Monthly Activity</Text>
            <Calendar size={20} color="#4f46e5" />
          </View>
          <Text className="text-gray-500 mb-4">Book borrowing trends</Text>
          {renderBarChart(monthlyActivity, "borrows")}
        </View>

        {/* Popular Books */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold">Popular Books</Text>
            <BookOpen size={20} color="#4f46e5" />
          </View>
          <Text className="text-gray-500 mb-4">Most borrowed titles</Text>
          {popularBooks.map((book, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center py-3 border-b border-gray-100"
            >
              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-3">{index + 1}</Text>
                <Text className="font-medium">{book.title}</Text>
              </View>
              <View className="bg-primary-50 px-2 py-1 rounded-full">
                <Text className="text-primary-700 text-sm">
                  {book.borrows} borrows
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Active Readers */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold">Active Readers</Text>
            <Users size={20} color="#4f46e5" />
          </View>
          <Text className="text-gray-500 mb-4">Top readers this month</Text>
          {activeReaders.map((reader, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center py-3 border-b border-gray-100"
            >
              <View>
                <Text className="font-medium">{reader.name}</Text>
                <Text className="text-gray-500 text-sm">
                  {reader.booksRead} books • {reader.readingTime} hours
                </Text>
              </View>
              <View className="bg-amber-50 px-2 py-1 rounded-full">
                <Text className="text-amber-700 text-sm">#{index + 1}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Export Data Button */}
        <TouchableOpacity
          onPress={() => Alert.alert("Export", "Data would be exported as CSV")}
          className="bg-gray-800 py-4 rounded-xl items-center mb-6"
        >
          <View className="flex-row items-center">
            <BarChart3 size={20} color="white" className="mr-2" />
            <Text className="text-white font-bold">Export Analytics Data</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
