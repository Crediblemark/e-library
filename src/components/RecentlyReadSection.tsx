import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { BookOpen, Clock } from "lucide-react-native";

interface BookProgress {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  progress: number;
  lastReadDate: string;
}

interface RecentlyReadSectionProps {
  books?: BookProgress[];
  onContinueReading?: (bookId: string) => void;
}

const RecentlyReadSection = ({
  books = [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverImage:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&q=80",
      progress: 45,
      lastReadDate: "2 days ago",
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      coverImage:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80",
      progress: 78,
      lastReadDate: "Yesterday",
    },
    {
      id: "3",
      title: "1984",
      author: "George Orwell",
      coverImage:
        "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=200&q=80",
      progress: 23,
      lastReadDate: "Just now",
    },
  ],
  onContinueReading = (bookId: string) =>
    console.log(`Continue reading book ${bookId}`),
}: RecentlyReadSectionProps) => {
  return (
    <View className="bg-white p-5 rounded-2xl shadow-sm mb-6 border border-gray-100">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <BookOpen size={22} color="#6366f1" />
          <Text className="text-lg font-semibold ml-2 text-gray-800">
            Recently Read
          </Text>
        </View>
        <TouchableOpacity className="bg-primary-50 px-3 py-1.5 rounded-full">
          <Text className="text-primary-600 text-sm font-medium">See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pb-2"
        contentContainerStyle={{ paddingLeft: 2 }}
      >
        {books.map((book) => (
          <View
            key={book.id}
            className="mr-4 w-44 bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100"
          >
            <Image
              source={{ uri: book.coverImage }}
              className="w-full h-28 rounded-t-xl"
              resizeMode="cover"
            />
            <View className="p-3">
              <Text numberOfLines={1} className="font-medium text-gray-800">
                {book.title}
              </Text>
              <Text numberOfLines={1} className="text-xs text-gray-500">
                {book.author}
              </Text>

              {/* Progress bar */}
              <View className="mt-2.5 bg-gray-200 h-1.5 rounded-full w-full">
                <View
                  className="bg-primary-500 h-1.5 rounded-full"
                  style={{ width: `${book.progress}%` }}
                />
              </View>

              <View className="flex-row justify-between items-center mt-2.5">
                <View className="flex-row items-center">
                  <Clock size={12} color="#9ca3af" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {book.lastReadDate}
                  </Text>
                </View>
                <Text className="text-xs font-medium text-primary-600">
                  {book.progress}%
                </Text>
              </View>

              <TouchableOpacity
                className="mt-3 bg-primary-100 py-2 rounded-lg items-center"
                onPress={() => onContinueReading(book.id)}
              >
                <Text className="text-xs font-medium text-primary-700">
                  Continue Reading
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecentlyReadSection;
