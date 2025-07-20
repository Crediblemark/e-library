import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../src/context/AuthContext";
import { UserRole } from "../../../src/utils/auth";
import { ArrowLeft, Upload, BookCopy, Check } from "lucide-react-native";

export default function AddNewBook() {
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    category: "Fiction",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
    pageCount: "",
    publishedDate: "",
  });

  useEffect(() => {
    // Check if user has librarian or admin role
    if (!user || !hasRole(UserRole.LIBRARIAN)) {
      Alert.alert(
        "Access Denied",
        "You do not have permission to access this area.",
      );
      router.replace("/admin");
    }
  }, [hasRole, router, user]);

  const handleInputChange = (field: string, value: string) => {
    setBookData({
      ...bookData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!bookData.title || !bookData.author || !bookData.description) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Book has been added to the library", [
        {
          text: "OK",
          onPress: () => router.replace("/admin/books"),
        },
      ]);
    }, 1500);
  };

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Romance",
    "Mystery",
    "Biography",
    "History",
    "Self-Help",
    "Children's",
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#4f46e5" />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1">Add New Book</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Book Cover Preview */}
        <View className="items-center mb-6">
          <Image
            source={{ uri: bookData.coverImage }}
            className="w-32 h-48 rounded-lg shadow-md mb-2"
          />
          <TouchableOpacity
            className="flex-row items-center bg-gray-200 px-4 py-2 rounded-full"
            onPress={() =>
              Alert.alert("Upload", "This would open an image picker")
            }
          >
            <Upload size={16} color="#4f46e5" className="mr-2" />
            <Text className="text-primary-600 font-medium">Upload Cover</Text>
          </TouchableOpacity>
        </View>

        {/* Book Details Form */}
        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-medium mb-1">Title *</Text>
            <TextInput
              value={bookData.title}
              onChangeText={(text) => handleInputChange("title", text)}
              placeholder="Enter book title"
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-1">Author *</Text>
            <TextInput
              value={bookData.author}
              onChangeText={(text) => handleInputChange("author", text)}
              placeholder="Enter author name"
              className="bg-white border border-gray-300 rounded-lg px-4 py-3"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-1">
              Description *
            </Text>
            <TextInput
              value={bookData.description}
              onChangeText={(text) => handleInputChange("description", text)}
              placeholder="Enter book description"
              multiline
              numberOfLines={4}
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 h-32 text-base"
              textAlignVertical="top"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-1">Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="py-2"
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => handleInputChange("category", category)}
                  className={`mr-2 px-4 py-2 rounded-full ${bookData.category === category ? "bg-primary-600" : "bg-gray-200"}`}
                >
                  <Text
                    className={`${bookData.category === category ? "text-white" : "text-gray-700"}`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-gray-700 font-medium mb-1">Page Count</Text>
              <TextInput
                value={bookData.pageCount}
                onChangeText={(text) =>
                  handleInputChange("pageCount", text.replace(/[^0-9]/g, ""))
                }
                placeholder="Pages"
                keyboardType="numeric"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              />
            </View>

            <View className="flex-1">
              <Text className="text-gray-700 font-medium mb-1">
                Published Date
              </Text>
              <TextInput
                value={bookData.publishedDate}
                onChangeText={(text) =>
                  handleInputChange("publishedDate", text)
                }
                placeholder="YYYY-MM-DD"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className={`bg-primary-600 py-4 rounded-xl items-center mt-6 ${isLoading ? "opacity-70" : ""}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="flex-row items-center">
                <BookCopy size={20} color="white" className="mr-2" />
                <Text className="text-white font-bold text-lg">
                  Add Book to Library
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
