import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  Book,
  BookOpen,
  Bookmark,
  Coffee,
  Compass,
  Flame,
  Heart,
  Lightbulb,
  Music,
  Star,
} from "lucide-react-native";

interface CategoryProps {
  categories?: Array<{
    id: string;
    name: string;
    icon:
      | "book"
      | "bookOpen"
      | "bookmark"
      | "coffee"
      | "compass"
      | "flame"
      | "heart"
      | "lightbulb"
      | "music"
      | "star";
  }>;
  onCategoryPress?: (categoryId: string) => void;
  title?: string;
}

const CategorySection = ({
  categories = [
    { id: "1", name: "Fiction", icon: "book" },
    { id: "2", name: "Non-Fiction", icon: "bookOpen" },
    { id: "3", name: "Romance", icon: "heart" },
    { id: "4", name: "Adventure", icon: "compass" },
    { id: "5", name: "Sci-Fi", icon: "star" },
    { id: "6", name: "Mystery", icon: "lightbulb" },
    { id: "7", name: "Poetry", icon: "music" },
    { id: "8", name: "Biography", icon: "coffee" },
    { id: "9", name: "Fantasy", icon: "flame" },
    { id: "10", name: "Classics", icon: "bookmark" },
  ],
  onCategoryPress = (categoryId) =>
    console.log(`Category pressed: ${categoryId}`),
  title = "Browse Categories",
}: CategoryProps) => {
  // Function to render the appropriate icon based on the category icon name
  const renderIcon = (iconName: string) => {
    const iconProps = { size: 24, color: "#6366f1", strokeWidth: 2 };

    switch (iconName) {
      case "book":
        return <Book {...iconProps} />;
      case "bookOpen":
        return <BookOpen {...iconProps} />;
      case "bookmark":
        return <Bookmark {...iconProps} />;
      case "coffee":
        return <Coffee {...iconProps} />;
      case "compass":
        return <Compass {...iconProps} />;
      case "flame":
        return <Flame {...iconProps} />;
      case "heart":
        return <Heart {...iconProps} />;
      case "lightbulb":
        return <Lightbulb {...iconProps} />;
      case "music":
        return <Music {...iconProps} />;
      case "star":
        return <Star {...iconProps} />;
      default:
        return <Book {...iconProps} />;
    }
  };

  return (
    <View className="bg-white p-5 mb-6 rounded-2xl shadow-sm border border-gray-100">
      <Text className="text-xl font-bold mb-4 text-gray-800">{title}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pb-2"
        contentContainerStyle={{ paddingLeft: 2 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => onCategoryPress(category.id)}
            className="mr-5 items-center"
            activeOpacity={0.7}
          >
            <View className="bg-primary-50 rounded-full p-4 mb-2 w-[68px] h-[68px] items-center justify-center shadow-sm">
              {renderIcon(category.icon)}
            </View>
            <Text className="text-sm font-medium text-gray-700 text-center max-w-[70px]">
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategorySection;
