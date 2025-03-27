import React from "react";
import { View, Text } from "react-native";
import { TrendingUp, Clock, Calendar, BookOpen } from "lucide-react-native";

interface WritingStatsProps {
  totalWordCount?: number;
  averageWordsPerDay?: number;
  totalWritingTime?: number; // in minutes
  daysActive?: number;
  projectsCompleted?: number;
}

const WritingStats = ({
  totalWordCount = 0,
  averageWordsPerDay = 0,
  totalWritingTime = 0,
  daysActive = 0,
  projectsCompleted = 0,
}: WritingStatsProps) => {
  // Format writing time (convert minutes to hours and minutes)
  const formatWritingTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Writing Stats
      </Text>

      <View className="flex-row flex-wrap justify-between">
        <View className="w-1/2 mb-4 pr-2">
          <View className="flex-row items-center mb-1">
            <BookOpen size={16} color="#4F46E5" />
            <Text className="text-gray-600 text-sm ml-1.5">Total Words</Text>
          </View>
          <Text className="text-xl font-bold text-gray-800">
            {totalWordCount.toLocaleString()}
          </Text>
        </View>

        <View className="w-1/2 mb-4 pl-2">
          <View className="flex-row items-center mb-1">
            <TrendingUp size={16} color="#4F46E5" />
            <Text className="text-gray-600 text-sm ml-1.5">Daily Average</Text>
          </View>
          <Text className="text-xl font-bold text-gray-800">
            {averageWordsPerDay.toLocaleString()} words
          </Text>
        </View>

        <View className="w-1/2 pr-2">
          <View className="flex-row items-center mb-1">
            <Clock size={16} color="#4F46E5" />
            <Text className="text-gray-600 text-sm ml-1.5">Writing Time</Text>
          </View>
          <Text className="text-xl font-bold text-gray-800">
            {formatWritingTime(totalWritingTime)}
          </Text>
        </View>

        <View className="w-1/2 pl-2">
          <View className="flex-row items-center mb-1">
            <Calendar size={16} color="#4F46E5" />
            <Text className="text-gray-600 text-sm ml-1.5">Days Active</Text>
          </View>
          <Text className="text-xl font-bold text-gray-800">
            {daysActive} days
          </Text>
        </View>
      </View>
    </View>
  );
};

export default WritingStats;
