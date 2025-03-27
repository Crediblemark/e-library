import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Plus,
  Edit3,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  MoreVertical,
  Target,
  X,
} from "lucide-react-native";
import NavigationBar from "../../src/components/NavigationBar";
import WritingGoalProgress from "../../src/components/WritingGoalProgress";
import WritingStats from "../../src/components/WritingStats";

// Mock data for user's writing projects
const myWritingProjects = [
  {
    id: "1",
    title: "The Hidden World",
    coverImage:
      "https://images.unsplash.com/photo-1518744386442-2d48ac47a7eb?w=400&q=80",
    description: "A fantasy novel about a hidden world beneath our own.",
    chapters: 5,
    lastEdited: "2 days ago",
    status: "In Progress",
    views: 245,
    likes: 32,
    comments: 8,
    wordCount: 12450,
  },
  {
    id: "2",
    title: "Midnight Memories",
    coverImage:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80",
    description:
      "A collection of short stories about memories that haunt us at night.",
    chapters: 3,
    lastEdited: "1 week ago",
    status: "Published",
    views: 1203,
    likes: 187,
    comments: 42,
    wordCount: 5940,
  },
  {
    id: "3",
    title: "The Science of Tomorrow",
    coverImage:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
    description: "A science fiction novel set in the near future.",
    chapters: 8,
    lastEdited: "3 days ago",
    status: "Draft",
    views: 0,
    likes: 0,
    comments: 0,
    wordCount: 17500,
  },
];

// Mock writing stats
const writingStats = {
  totalWordCount: 35890,
  averageWordsPerDay: 850,
  totalWritingTime: 2340, // in minutes (39 hours)
  daysActive: 42,
  projectsCompleted: 2,
  currentStreak: 5,
  dailyGoal: 1000,
};

export default function WriteScreen() {
  const router = useRouter();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(writingStats.dailyGoal.toString());
  const [todayWords, setTodayWords] = useState(650); // Mock words written today

  const handleBackPress = () => {
    router.back();
  };

  const handleCreateNewProject = () => {
    router.push("/write/new");
  };

  const handleEditProject = (projectId: string) => {
    router.push(`/write/project/${projectId}`);
  };

  const handleSaveGoal = () => {
    const goalNumber = parseInt(dailyGoal);
    if (isNaN(goalNumber) || goalNumber <= 0) {
      Alert.alert("Invalid Goal", "Please enter a valid number greater than 0");
      return;
    }

    // In a real app, this would save to a database
    writingStats.dailyGoal = goalNumber;
    setShowGoalModal(false);
    Alert.alert("Success", "Your daily writing goal has been updated!");
  };

  const renderStatusBadge = (status: string) => {
    let bgColor = "bg-yellow-100";
    let textColor = "text-yellow-800";

    if (status === "Published") {
      bgColor = "bg-green-100";
      textColor = "text-green-800";
    } else if (status === "Draft") {
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
    }

    return (
      <View className={`px-2.5 py-1 rounded-full ${bgColor}`}>
        <Text className={`text-xs font-medium ${textColor}`}>{status}</Text>
      </View>
    );
  };

  const totalWordCount = myWritingProjects.reduce(
    (sum, project) => sum + project.wordCount,
    0,
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={handleBackPress}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">My Writing Projects</Text>
        <TouchableOpacity
          onPress={handleCreateNewProject}
          className="bg-primary-600 p-2 rounded-full"
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <ScrollView className="flex-1">
        {/* Daily writing goal */}
        <View className="px-4 mt-4">
          <WritingGoalProgress
            currentWordCount={todayWords}
            goalWordCount={writingStats.dailyGoal}
            daysStreak={writingStats.currentStreak}
            onEditGoal={() => setShowGoalModal(true)}
          />
        </View>

        {/* Writing stats */}
        <View className="px-4">
          <WritingStats
            totalWordCount={writingStats.totalWordCount}
            averageWordsPerDay={writingStats.averageWordsPerDay}
            totalWritingTime={writingStats.totalWritingTime}
            daysActive={writingStats.daysActive}
            projectsCompleted={writingStats.projectsCompleted}
          />
        </View>

        {/* Projects list */}
        <View className="px-4">
          <Text className="text-lg font-bold mb-4">Your Projects</Text>

          {myWritingProjects.map((project) => (
            <TouchableOpacity
              key={project.id}
              onPress={() => handleEditProject(project.id)}
              className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm"
            >
              <View className="flex-row">
                <Image
                  source={{ uri: project.coverImage }}
                  className="w-24 h-full"
                  resizeMode="cover"
                />
                <View className="flex-1 p-3">
                  <View className="flex-row justify-between items-start">
                    <Text className="text-lg font-bold text-gray-800 flex-1 mr-2">
                      {project.title}
                    </Text>
                    {renderStatusBadge(project.status)}
                  </View>
                  <Text
                    numberOfLines={2}
                    className="text-gray-600 text-sm mt-1 mb-2"
                  >
                    {project.description}
                  </Text>
                  <View className="flex-row justify-between items-center mt-2">
                    <View className="flex-row items-center">
                      <Clock size={14} color="#6B7280" />
                      <Text className="text-xs text-gray-500 ml-1">
                        {project.lastEdited}
                      </Text>
                    </View>
                    <View className="flex-row items-center space-x-3">
                      <View className="flex-row items-center">
                        <Eye size={14} color="#6B7280" />
                        <Text className="text-xs text-gray-500 ml-1">
                          {project.views}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Heart size={14} color="#6B7280" />
                        <Text className="text-xs text-gray-500 ml-1">
                          {project.likes}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <MessageSquare size={14} color="#6B7280" />
                        <Text className="text-xs text-gray-500 ml-1">
                          {project.comments}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View className="bg-gray-50 px-3 py-2 flex-row justify-between items-center">
                <Text className="text-sm text-gray-700">
                  {project.chapters}{" "}
                  {project.chapters === 1 ? "Chapter" : "Chapters"} •{" "}
                  {project.wordCount.toLocaleString()} words
                </Text>
                <TouchableOpacity
                  onPress={() => handleEditProject(project.id)}
                  className="flex-row items-center bg-primary-100 px-3 py-1 rounded-full"
                >
                  <Edit3 size={14} color="#4F46E5" />
                  <Text className="text-primary-700 text-xs font-medium ml-1">
                    Edit Project
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Create new project button */}
        <TouchableOpacity
          onPress={handleCreateNewProject}
          className="mx-4 mb-6 bg-primary-600 py-3 rounded-xl"
        >
          <Text className="text-white font-bold text-center text-lg">
            Create New Writing Project
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Set Goal Modal */}
      <Modal
        visible={showGoalModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white w-full max-w-sm rounded-xl p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Set Daily Writing Goal
              </Text>
              <TouchableOpacity onPress={() => setShowGoalModal(false)}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 mb-4">
              Setting a daily word count goal helps build a consistent writing
              habit.
            </Text>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Daily Word Count Goal</Text>
              <TextInput
                value={dailyGoal}
                onChangeText={setDailyGoal}
                keyboardType="number-pad"
                className="border border-gray-300 rounded-lg p-3 text-base"
                placeholder="Enter your daily goal"
              />
            </View>

            <TouchableOpacity
              onPress={handleSaveGoal}
              className="bg-primary-600 py-3 rounded-lg"
            >
              <Text className="text-white font-bold text-center">
                Save Goal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <NavigationBar activeTab="write" />
    </SafeAreaView>
  );
}
