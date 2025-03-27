import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Book } from "lucide-react-native";

interface BookCoverProps {
  imageUrl?: string;
  title?: string;
  author?: string;
  onPress?: () => void;
}

const BookCover = ({
  imageUrl,
  title = "The Great Adventure",
  author = "Jane Doe",
  onPress = () => {},
}: BookCoverProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-[130px] h-[190px] bg-white rounded-xl overflow-hidden shadow-lg mr-4 border border-gray-100"
      activeOpacity={0.8}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-[140px] rounded-t-xl"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-[140px] bg-gray-100 items-center justify-center rounded-t-xl">
          <Book size={40} color="#6366f1" />
        </View>
      )}
      <View className="p-2.5">
        <Text
          className="text-sm font-bold text-gray-800 mb-1"
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text className="text-xs text-gray-500" numberOfLines={1}>
          {author}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default BookCover;
