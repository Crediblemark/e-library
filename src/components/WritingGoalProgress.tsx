import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Target, Edit3 } from "lucide-react-native";

interface WritingGoalProgressProps {
  currentWordCount: number;
  goalWordCount: number;
  daysStreak?: number;
  onEditGoal?: () => void;
}

const WritingGoalProgress = ({
  currentWordCount = 0,
  goalWordCount = 1000,
  daysStreak = 0,
  onEditGoal,
}: WritingGoalProgressProps) => {
  const progress = Math.min(
    Math.round((currentWordCount / goalWordCount) * 100),
    100,
  );

  return (
    <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <Target size={18} color="#4F46E5" />
          <Text className="text-gray-800 font-semibold ml-2">Writing Goal</Text>
        </View>
        {onEditGoal && (
          <TouchableOpacity
            onPress={onEditGoal}
            className="flex-row items-center"
          >
            <Edit3 size={16} color="#4F46E5" />
            <Text className="text-primary-600 text-sm ml-1">Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="mb-2">
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-600 text-sm">
            {currentWordCount} words
          </Text>
          <Text className="text-gray-600 text-sm">{goalWordCount} words</Text>
        </View>
        <View className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary-600 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-gray-700">{progress}% complete</Text>
        {daysStreak > 0 && (
          <View className="bg-amber-100 px-2 py-1 rounded-full">
            <Text className="text-amber-800 text-xs font-medium">
              {daysStreak} day{daysStreak !== 1 ? "s" : ""} streak 🔥
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default WritingGoalProgress;
