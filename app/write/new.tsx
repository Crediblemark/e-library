import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Image as ImageIcon,
  X,
  ChevronDown,
  Check,
} from "lucide-react-native";

// Sample genre options
const genreOptions = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Horror",
  "Adventure",
  "Historical Fiction",
  "Young Adult",
  "Non-fiction",
  "Poetry",
  "Drama",
  "Thriller",
  "Comedy",
];

// Sample cover images
const sampleCoverImages = [
  "https://images.unsplash.com/photo-1518744386442-2d48ac47a7eb?w=400&q=80",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80",
];

export default function NewWritingProject() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [coverImage, setCoverImage] = useState(sampleCoverImages[0]);
  const [isPublic, setIsPublic] = useState(true);

  const handleBackPress = () => {
    router.back();
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      if (selectedGenres.length < 3) {
        setSelectedGenres([...selectedGenres, genre]);
      } else {
        Alert.alert("Limit Reached", "You can select up to 3 genres");
      }
    }
  };

  const handleCreateProject = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your project");
      return;
    }

    // In a real app, this would save the project to a database
    console.log({
      title,
      description,
      genres: selectedGenres,
      coverImage,
      isPublic,
    });

    // Navigate to the project detail page with firstChapter flag
    router.push({
      pathname: "/write/project/new",
      params: { firstChapter: "true" },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={handleBackPress}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Create New Project</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Cover Image Selection */}
        <View className="items-center mb-6">
          <Text className="text-lg font-bold text-gray-800 self-start mb-3">
            Cover Image
          </Text>
          <Image
            source={{ uri: coverImage }}
            className="w-40 h-56 rounded-lg shadow-md mb-3"
            resizeMode="cover"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="self-start"
          >
            {sampleCoverImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCoverImage(image)}
                className={`mr-3 rounded-md overflow-hidden border-2 ${coverImage === image ? "border-primary-600" : "border-transparent"}`}
              >
                <Image
                  source={{ uri: image }}
                  className="w-16 h-24"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
            <TouchableOpacity className="w-16 h-24 bg-gray-100 rounded-md items-center justify-center mr-3">
              <ImageIcon size={24} color="#6B7280" />
              <Text className="text-xs text-gray-500 mt-1">Upload</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Title Input */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter your story title"
            className="border border-gray-300 rounded-lg p-3 text-base"
            maxLength={100}
          />
          <Text className="text-right text-gray-500 text-xs mt-1">
            {title.length}/100
          </Text>
        </View>

        {/* Description Input */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What is your story about?"
            multiline
            numberOfLines={4}
            className="border border-gray-300 rounded-lg p-3 text-base h-32 textAlignVertical-top"
            maxLength={500}
            textAlignVertical="top"
          />
          <Text className="text-right text-gray-500 text-xs mt-1">
            {description.length}/500
          </Text>
        </View>

        {/* Genre Selection */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">Genres</Text>
          <TouchableOpacity
            onPress={() => setShowGenreDropdown(!showGenreDropdown)}
            className="border border-gray-300 rounded-lg p-3 flex-row justify-between items-center"
          >
            <Text
              className={
                selectedGenres.length === 0 ? "text-gray-400" : "text-gray-800"
              }
            >
              {selectedGenres.length === 0
                ? "Select up to 3 genres"
                : selectedGenres.join(", ")}
            </Text>
            <ChevronDown size={20} color="#6B7280" />
          </TouchableOpacity>

          {showGenreDropdown && (
            <View className="border border-gray-300 rounded-lg mt-1 p-2 bg-white shadow-md">
              {genreOptions.map((genre) => (
                <TouchableOpacity
                  key={genre}
                  onPress={() => toggleGenre(genre)}
                  className="flex-row justify-between items-center p-2 border-b border-gray-100"
                >
                  <Text className="text-gray-800">{genre}</Text>
                  {selectedGenres.includes(genre) && (
                    <Check size={18} color="#4F46E5" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Privacy Setting */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Privacy Setting
          </Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={() => setIsPublic(true)}
              className={`flex-1 border rounded-lg p-3 ${isPublic ? "bg-primary-50 border-primary-300" : "border-gray-300"}`}
            >
              <Text
                className={`text-center font-medium ${isPublic ? "text-primary-700" : "text-gray-700"}`}
              >
                Public
              </Text>
              <Text
                className={`text-center text-xs mt-1 ${isPublic ? "text-primary-600" : "text-gray-500"}`}
              >
                Anyone can read
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsPublic(false)}
              className={`flex-1 border rounded-lg p-3 ${!isPublic ? "bg-primary-50 border-primary-300" : "border-gray-300"}`}
            >
              <Text
                className={`text-center font-medium ${!isPublic ? "text-primary-700" : "text-gray-700"}`}
              >
                Private
              </Text>
              <Text
                className={`text-center text-xs mt-1 ${!isPublic ? "text-primary-600" : "text-gray-500"}`}
              >
                Only you can read
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          onPress={handleCreateProject}
          className="bg-primary-600 py-3.5 rounded-xl mb-6"
        >
          <Text className="text-white font-bold text-center text-lg">
            Create Project & Start Writing
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
