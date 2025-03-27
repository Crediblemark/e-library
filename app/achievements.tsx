import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Header from "../src/components/Header";
import NavigationBar from "../src/components/NavigationBar";
import { Trophy, Award, CheckCircle } from "lucide-react-native";
import {
  getAchievements,
  getReadingStats,
  Achievement,
  ReadingStats,
} from "../src/services/api";

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [readingStats, setReadingStats] = useState<ReadingStats>({
    booksRead: 0,
    pagesRead: 0,
    hoursRead: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const achievementsData = await getAchievements();
        const statsData = await getReadingStats();
        setAchievements(achievementsData);
        setReadingStats(statsData);
      } catch (error) {
        console.error("Error fetching achievements data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title="Achievements" showBackButton={false} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="mt-4 text-gray-600">
            Loading your achievements...
          </Text>
        </View>
        <NavigationBar activeTab="achievements" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Achievements" showBackButton={false} />
      <ScrollView className="flex-1 p-4">
        <View className="items-center justify-center py-6">
          <Trophy size={60} color="#4f46e5" strokeWidth={1.5} />
          <Text className="text-2xl font-bold text-primary-600 mt-4 mb-2">
            Achievements
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Track your reading progress and earn badges as you go!
          </Text>

          {/* Reading Stats */}
          <View className="w-full p-4 bg-gray-50 rounded-xl mb-6">
            <Text className="text-lg font-medium text-gray-800 mb-2">
              Reading Stats
            </Text>
            <View className="flex-row justify-between mt-2">
              <View className="items-center p-3 bg-white rounded-lg flex-1 mr-2">
                <Text className="text-2xl font-bold text-primary-600">
                  {readingStats.booksRead}
                </Text>
                <Text className="text-xs text-gray-500">Books Read</Text>
              </View>
              <View className="items-center p-3 bg-white rounded-lg flex-1 mx-2">
                <Text className="text-2xl font-bold text-primary-600">
                  {readingStats.pagesRead}
                </Text>
                <Text className="text-xs text-gray-500">Pages</Text>
              </View>
              <View className="items-center p-3 bg-white rounded-lg flex-1 ml-2">
                <Text className="text-2xl font-bold text-primary-600">
                  {readingStats.hoursRead}
                </Text>
                <Text className="text-xs text-gray-500">Hours</Text>
              </View>
            </View>
          </View>

          {/* Badges */}
          <View className="w-full p-4 bg-gray-50 rounded-xl">
            <Text className="text-lg font-medium text-gray-800 mb-2">
              Badges
            </Text>
            <Text className="text-gray-500 mb-4">
              Complete reading challenges to earn badges!
            </Text>

            {achievements.length === 0 ? (
              <View className="items-center justify-center py-8">
                <Text className="text-gray-400 italic">
                  No badges earned yet
                </Text>
              </View>
            ) : (
              <View>
                {achievements.map((achievement) => (
                  <View
                    key={achievement.id}
                    className="mb-4 bg-white p-4 rounded-lg"
                  >
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-3">
                        <Text className="text-2xl">{achievement.icon}</Text>
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center">
                          <Text className="font-bold text-gray-800">
                            {achievement.title}
                          </Text>
                          {achievement.isCompleted && (
                            <CheckCircle
                              size={16}
                              color="#10B981"
                              className="ml-2"
                            />
                          )}
                        </View>
                        <Text className="text-gray-600 text-sm">
                          {achievement.description}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-3">
                      <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                        <View
                          className="bg-primary-600 h-full rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </View>
                      <View className="flex-row justify-between mt-1">
                        <Text className="text-xs text-gray-500">
                          {achievement.progress}% complete
                        </Text>
                        {achievement.dateEarned && (
                          <Text className="text-xs text-gray-500">
                            Earned: {achievement.dateEarned}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <NavigationBar activeTab="achievements" />
    </SafeAreaView>
  );
}
