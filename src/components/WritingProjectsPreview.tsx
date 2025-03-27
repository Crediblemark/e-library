import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { PlusCircle, Edit3, BookOpen } from "lucide-react-native";
import { useRouter } from "expo-router";

interface WritingProject {
  id: string;
  title: string;
  lastEdited: string;
  chaptersCount: number;
  progress: number;
}

interface WritingProjectsPreviewProps {
  projects?: WritingProject[];
  onCreateNew?: () => void;
  onContinueWriting?: (projectId: string) => void;
}

const WritingProjectsPreview = ({
  projects = [
    {
      id: "1",
      title: "My First Novel",
      lastEdited: "2 days ago",
      chaptersCount: 5,
      progress: 60,
    },
    {
      id: "2",
      title: "Short Story Collection",
      lastEdited: "Yesterday",
      chaptersCount: 3,
      progress: 30,
    },
  ],
  onCreateNew = () => {},
  onContinueWriting = () => {},
}: WritingProjectsPreviewProps) => {
  const router = useRouter();

  const handleCreateNew = () => {
    router.push("/write/new");
  };

  const handleContinueWriting = (projectId: string) => {
    router.push(`/write/project/${projectId}`);
  };

  return (
    <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-800">
          My Writing Projects
        </Text>
        <TouchableOpacity
          onPress={onCreateNew || handleCreateNew}
          className="flex-row items-center bg-primary-50 px-3 py-1.5 rounded-full"
        >
          <PlusCircle size={18} color="#4f46e5" />
          <Text className="text-primary-600 ml-1.5 font-medium">New</Text>
        </TouchableOpacity>
      </View>

      {projects.length === 0 ? (
        <View className="py-8 items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
          <BookOpen size={36} color="#6366f1" />
          <Text className="text-gray-500 mt-3 text-center">
            No writing projects yet
          </Text>
          <TouchableOpacity
            onPress={onCreateNew || handleCreateNew}
            className="mt-4 bg-primary-600 px-5 py-2.5 rounded-full shadow-sm"
          >
            <Text className="text-white font-medium">Start Writing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-1 pb-2"
          contentContainerStyle={{ paddingLeft: 2 }}
        >
          {projects.map((project) => (
            <TouchableOpacity
              key={project.id}
              onPress={() =>
                (onContinueWriting || handleContinueWriting)(project.id)
              }
              className="bg-gray-50 p-4 rounded-xl mr-4 w-52 border border-gray-100 shadow-sm"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-2">
                  <Text
                    className="font-medium text-gray-800 text-base"
                    numberOfLines={1}
                  >
                    {project.title}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1.5">
                    {project.chaptersCount} chapters
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    Last edited: {project.lastEdited}
                  </Text>
                </View>
                <Edit3 size={18} color="#6366f1" />
              </View>

              {/* Progress bar */}
              <View className="mt-4 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <View
                  className="bg-primary-600 h-full rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </View>

              <TouchableOpacity
                onPress={() =>
                  (onContinueWriting || handleContinueWriting)(project.id)
                }
                className="mt-4 bg-primary-100 py-2 rounded-lg items-center"
              >
                <Text className="text-primary-700 text-sm font-medium">
                  Continue Writing
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default WritingProjectsPreview;
