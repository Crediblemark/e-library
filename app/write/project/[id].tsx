import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Plus,
  Edit3,
  Settings,
  Eye,
  Share2,
  MoreVertical,
  ChevronRight,
} from "lucide-react-native";
import { getProject, Project } from "../../../src/services/api";

export default function ProjectDetailScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  const isFirstChapter = params.firstChapter === "true";
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const [firstChapter, setFirstChapter] = useState(false);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Get project data based on ID from the URL
  const projectId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getProject(projectId);
        setProjectData(project);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (isFirstChapter && projectData) {
      setFirstChapter(true);
      // Automatically open the chapter editor for the first chapter
      setTimeout(() => {
        handleCreateNewChapter();
      }, 500);
    }
  }, [isFirstChapter, projectData]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold" numberOfLines={1}>
            Loading Project...
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="mt-4 text-gray-600">Loading project details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!projectData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold" numberOfLines={1}>
            Error
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-lg text-gray-800 mb-2">Project not found</Text>
          <Text className="text-gray-600 text-center mb-6">
            The project you're looking for doesn't exist or has been removed.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/write")}
            className="bg-primary-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Go to Projects</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBackPress = () => {
    router.back();
  };

  const handleCreateNewChapter = () => {
    router.push({
      pathname: "/write/chapter/new",
      params: { projectId: projectData.id },
    });
  };

  const handleEditChapter = (chapterId: string) => {
    router.push({
      pathname: `/write/chapter/${chapterId}`,
      params: { projectId: projectData.id },
    });
  };

  const handleReadChapter = (chapterId: string) => {
    router.push({
      pathname: `/read/${chapterId}`,
    });
  };

  const handleEditProjectDetails = () => {
    // Navigate to edit project details
    router.push({
      pathname: `/write/edit/${projectData.id}`,
    });
  };

  const handlePublishProject = () => {
    Alert.alert(
      "Publish Project",
      "Are you sure you want to publish this project? Published works will be visible to all users based on your privacy settings.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Publish",
          onPress: () => {
            // In a real app, this would update the project status in the database
            Alert.alert(
              "Success",
              "Your project has been published successfully!",
            );
          },
        },
      ],
    );
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

  // Format the lastEdited date to a relative time string
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={handleBackPress}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold" numberOfLines={1}>
          {projectData.title}
        </Text>
        <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
          <MoreVertical size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Options dropdown */}
      {showOptions && (
        <View className="absolute right-4 top-16 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
          <TouchableOpacity
            onPress={handleEditProjectDetails}
            className="flex-row items-center p-3"
          >
            <Edit3 size={18} color="#4F46E5" />
            <Text className="ml-2 text-gray-800">Edit Project Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Share", "Sharing options would appear here.");
            }}
            className="flex-row items-center p-3"
          >
            <Share2 size={18} color="#4F46E5" />
            <Text className="ml-2 text-gray-800">Share Project</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePublishProject}
            className="flex-row items-center p-3"
          >
            <Eye size={18} color="#4F46E5" />
            <Text className="ml-2 text-gray-800">
              {projectData.status === "Published"
                ? "Unpublish Project"
                : "Publish Project"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Delete Project",
                "Are you sure you want to delete this project? This action cannot be undone.",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    onPress: () => {
                      // In a real app, this would delete the project from the database
                      router.replace("/write");
                    },
                    style: "destructive",
                  },
                ],
              );
            }}
            className="flex-row items-center p-3"
          >
            <Text className="ml-2 text-red-600">Delete Project</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView className="flex-1">
        {/* Project Info */}
        <View className="p-4 flex-row">
          <Image
            source={{ uri: projectData.coverImage }}
            className="w-24 h-36 rounded-lg shadow-sm"
            resizeMode="cover"
          />
          <View className="ml-4 flex-1 justify-center">
            <View className="flex-row items-center mb-1">
              {renderStatusBadge(projectData.status)}
              <Text className="text-gray-500 text-xs ml-2">
                {projectData.isPublic ? "Public" : "Private"}
              </Text>
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-1">
              {projectData.title}
            </Text>
            <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
              {projectData.description}
            </Text>
            <View className="flex-row flex-wrap">
              {projectData.genres.map((genre, index) => (
                <View
                  key={index}
                  className="bg-gray-100 px-2 py-1 rounded-full mr-1 mb-1"
                >
                  <Text className="text-gray-700 text-xs">{genre}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Project Stats */}
        <View className="flex-row justify-around bg-gray-50 py-3 px-4 mx-4 rounded-xl mb-4">
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-800">
              {projectData.chapters.length}
            </Text>
            <Text className="text-xs text-gray-600">Chapters</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-800">
              {projectData.chapters.reduce(
                (sum, chapter) => sum + chapter.wordCount,
                0,
              )}
            </Text>
            <Text className="text-xs text-gray-600">Words</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-800">
              {projectData.views}
            </Text>
            <Text className="text-xs text-gray-600">Views</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-gray-800">
              {projectData.likes}
            </Text>
            <Text className="text-xs text-gray-600">Likes</Text>
          </View>
        </View>

        {/* Chapters Section */}
        <View className="px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Chapters</Text>
            <TouchableOpacity
              onPress={handleCreateNewChapter}
              className="bg-primary-600 px-3 py-1.5 rounded-full flex-row items-center"
            >
              <Plus size={16} color="#ffffff" />
              <Text className="text-white font-medium text-sm ml-1">
                New Chapter
              </Text>
            </TouchableOpacity>
          </View>

          {projectData.chapters.length === 0 ? (
            <View className="bg-gray-50 rounded-xl p-6 items-center justify-center mb-4">
              <Text className="text-gray-500 text-center mb-4">
                You haven't created any chapters yet. Start writing your first
                chapter!
              </Text>
              <TouchableOpacity
                onPress={handleCreateNewChapter}
                className="bg-primary-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">
                  Create First Chapter
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            projectData.chapters.map((chapter, index) => (
              <TouchableOpacity
                key={chapter.id}
                onPress={() => handleEditChapter(chapter.id)}
                className="bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden shadow-sm"
              >
                <View className="p-3">
                  <View className="flex-row justify-between items-start mb-1">
                    <View className="flex-row items-center flex-1">
                      <Text className="text-gray-500 mr-2">{index + 1}.</Text>
                      <Text className="text-lg font-medium text-gray-800 flex-1">
                        {chapter.title}
                      </Text>
                    </View>
                    {renderStatusBadge(chapter.status)}
                  </View>
                  <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-gray-500 text-xs">
                      {chapter.wordCount} words • Last edited{" "}
                      {formatRelativeTime(chapter.lastEdited)}
                    </Text>
                    <View className="flex-row items-center">
                      {chapter.status === "Published" && (
                        <TouchableOpacity
                          onPress={() => handleReadChapter(chapter.id)}
                          className="bg-primary-600 px-3 py-1 rounded-lg mr-2"
                        >
                          <Text className="text-white text-xs font-medium">
                            Read Now
                          </Text>
                        </TouchableOpacity>
                      )}
                      <ChevronRight size={16} color="#6B7280" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Create new chapter button */}
        {projectData.chapters.length > 0 && (
          <TouchableOpacity
            onPress={handleCreateNewChapter}
            className="mx-4 mb-6 bg-primary-600 py-3 rounded-xl mt-2"
          >
            <Text className="text-white font-bold text-center">
              Create New Chapter
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
