import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Image,
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

// Mock data for project details
const projectsData = {
  "1": {
    id: "1",
    title: "The Hidden World",
    coverImage:
      "https://images.unsplash.com/photo-1518744386442-2d48ac47a7eb?w=400&q=80",
    description: "A fantasy novel about a hidden world beneath our own.",
    genres: ["Fantasy", "Adventure", "Young Adult"],
    status: "In Progress",
    views: 245,
    likes: 32,
    comments: 8,
    isPublic: true,
    createdAt: "2023-10-15",
    lastUpdated: "2023-11-02",
    chapters: [
      {
        id: "1-1",
        title: "The Discovery",
        wordCount: 2450,
        lastEdited: "2 days ago",
        status: "Published",
        views: 120,
        likes: 18,
        comments: 5,
      },
      {
        id: "1-2",
        title: "The Entrance",
        wordCount: 1890,
        lastEdited: "3 days ago",
        status: "Published",
        views: 95,
        likes: 12,
        comments: 3,
      },
      {
        id: "1-3",
        title: "New Friends",
        wordCount: 2100,
        lastEdited: "5 days ago",
        status: "Published",
        views: 30,
        likes: 2,
        comments: 0,
      },
      {
        id: "1-4",
        title: "The Challenge",
        wordCount: 1750,
        lastEdited: "1 week ago",
        status: "Draft",
        views: 0,
        likes: 0,
        comments: 0,
      },
      {
        id: "1-5",
        title: "The Return",
        wordCount: 1200,
        lastEdited: "2 days ago",
        status: "Draft",
        views: 0,
        likes: 0,
        comments: 0,
      },
    ],
  },
  "2": {
    id: "2",
    title: "Midnight Memories",
    coverImage:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80",
    description:
      "A collection of short stories about memories that haunt us at night.",
    genres: ["Horror", "Thriller", "Mystery"],
    status: "Published",
    views: 1203,
    likes: 187,
    comments: 42,
    isPublic: true,
    createdAt: "2023-09-05",
    lastUpdated: "2023-10-28",
    chapters: [
      {
        id: "2-1",
        title: "The Forgotten Face",
        wordCount: 1850,
        lastEdited: "2 weeks ago",
        status: "Published",
        views: 450,
        likes: 65,
        comments: 12,
      },
      {
        id: "2-2",
        title: "Whispers in the Dark",
        wordCount: 2100,
        lastEdited: "3 weeks ago",
        status: "Published",
        views: 420,
        likes: 72,
        comments: 18,
      },
      {
        id: "2-3",
        title: "The Last Train Home",
        wordCount: 1950,
        lastEdited: "1 month ago",
        status: "Published",
        views: 333,
        likes: 50,
        comments: 12,
      },
    ],
  },
  "3": {
    id: "3",
    title: "The Science of Tomorrow",
    coverImage:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
    description: "A science fiction novel set in the near future.",
    genres: ["Science Fiction", "Dystopian"],
    status: "Draft",
    views: 0,
    likes: 0,
    comments: 0,
    isPublic: false,
    createdAt: "2023-10-30",
    lastUpdated: "2023-11-01",
    chapters: [
      {
        id: "3-1",
        title: "The New Beginning",
        wordCount: 2200,
        lastEdited: "3 days ago",
        status: "Draft",
        views: 0,
        likes: 0,
        comments: 0,
      },
      {
        id: "3-2",
        title: "The Discovery",
        wordCount: 1800,
        lastEdited: "4 days ago",
        status: "Draft",
        views: 0,
        likes: 0,
        comments: 0,
      },
      {
        id: "3-3",
        title: "The Revelation",
        wordCount: 1500,
        lastEdited: "5 days ago",
        status: "Draft",
        views: 0,
        likes: 0,
        comments: 0,
      },
      {
        id: "3-4",
        title: "The Conflict",
        wordCount: 1900,
        lastEdited: "6 days ago",
        status: "Draft",
        views: 0,
        likes: 0,
        comments: 0,
      },
      {
        id: "3-5",
        title: "The Resolution",
        wordCount: 2100,
        lastEdited: "1 week ago",
        status: "Draft",
        views: 0,
        likes: 0,
        comments: 0,
      },
      {
        id: "3-6",
        title: "The Aftermath",
        wordCount: 1700,
        lastEdited: "1 week ago",
        status: "Draft",
        views: 0,
        likes: 0,
        comments: 0,
      },
      {
        id: "3-7",
        title: "The New World",
        wordCount: 2300,
        lastEdited: "1 week ago",
        status: "Draft",
        views: 0,
        likes: 0,
        comments: 0,
      },
      {
        id: "3-8",
        title: "The Future",
        wordCount: 2000,
        lastEdited: "1 week ago",
        status: "Draft",
        views: 0,
        likes: 0,
        comments: 0,
      },
    ],
  },
  new: {
    id: "new",
    title: "Untitled Project",
    coverImage:
      "https://images.unsplash.com/photo-1518744386442-2d48ac47a7eb?w=400&q=80",
    description: "Start writing your new story...",
    genres: [],
    status: "Draft",
    views: 0,
    likes: 0,
    comments: 0,
    isPublic: true,
    createdAt: new Date().toISOString().split("T")[0],
    lastUpdated: new Date().toISOString().split("T")[0],
    chapters: [],
  },
};

export default function ProjectDetailScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  const isFirstChapter = params.firstChapter === "true";
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const [firstChapter, setFirstChapter] = useState(false);

  // Get project data based on ID from the URL
  const projectId = Array.isArray(id) ? id[0] : id;
  const projectData = projectsData[projectId as keyof typeof projectsData];

  useEffect(() => {
    if (isFirstChapter) {
      setFirstChapter(true);
      // Automatically open the chapter editor for the first chapter
      setTimeout(() => {
        handleCreateNewChapter();
      }, 500);
    }
  }, [isFirstChapter]);

  if (!projectData) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Project not found</Text>
      </View>
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
                      {chapter.lastEdited}
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
