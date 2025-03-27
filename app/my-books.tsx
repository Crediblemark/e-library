import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import Header from "../src/components/Header";
import NavigationBar from "../src/components/NavigationBar";

export default function MyBooksScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="My Books" showBackButton={false} />
      <ScrollView className="flex-1 p-4">
        <View className="items-center justify-center py-10">
          <Text className="text-2xl font-bold text-primary-600 mb-4">
            My Books
          </Text>
          <Text className="text-gray-500 text-center">
            Here you'll find all your borrowed books and reading history.
          </Text>

          {/* Placeholder content - to be implemented */}
          <View className="w-full mt-8 p-4 bg-gray-50 rounded-xl">
            <Text className="text-lg font-medium text-gray-800 mb-2">
              Currently Borrowed
            </Text>
            <Text className="text-gray-500">
              You don't have any borrowed books at the moment.
            </Text>
          </View>

          <View className="w-full mt-6 p-4 bg-gray-50 rounded-xl">
            <Text className="text-lg font-medium text-gray-800 mb-2">
              Reading History
            </Text>
            <Text className="text-gray-500">
              Your reading history will appear here.
            </Text>
          </View>
        </View>
      </ScrollView>
      <NavigationBar activeTab="myBooks" />
    </SafeAreaView>
  );
}
