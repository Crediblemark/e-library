import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import Header from "../src/components/Header";
import NavigationBar from "../src/components/NavigationBar";
import { Trophy } from "lucide-react-native";

export default function AchievementsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Achievements" showBackButton={false} />
      <ScrollView className="flex-1 p-4">
        <View className="items-center justify-center py-10">
          <Trophy size={60} color="#4f46e5" strokeWidth={1.5} />
          <Text className="text-2xl font-bold text-primary-600 mt-4 mb-2">
            Achievements
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Track your reading progress and earn badges as you go!
          </Text>

          {/* Placeholder content - to be implemented */}
          <View className="w-full p-4 bg-gray-50 rounded-xl mb-6">
            <Text className="text-lg font-medium text-gray-800 mb-2">
              Reading Stats
            </Text>
            <View className="flex-row justify-between mt-2">
              <View className="items-center p-3 bg-white rounded-lg flex-1 mr-2">
                <Text className="text-2xl font-bold text-primary-600">0</Text>
                <Text className="text-xs text-gray-500">Books Read</Text>
              </View>
              <View className="items-center p-3 bg-white rounded-lg flex-1 mx-2">
                <Text className="text-2xl font-bold text-primary-600">0</Text>
                <Text className="text-xs text-gray-500">Pages</Text>
              </View>
              <View className="items-center p-3 bg-white rounded-lg flex-1 ml-2">
                <Text className="text-2xl font-bold text-primary-600">0</Text>
                <Text className="text-xs text-gray-500">Hours</Text>
              </View>
            </View>
          </View>

          <View className="w-full p-4 bg-gray-50 rounded-xl">
            <Text className="text-lg font-medium text-gray-800 mb-2">
              Badges
            </Text>
            <Text className="text-gray-500">
              Complete reading challenges to earn badges!
            </Text>
            <View className="items-center justify-center py-8">
              <Text className="text-gray-400 italic">No badges earned yet</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <NavigationBar activeTab="achievements" />
    </SafeAreaView>
  );
}
