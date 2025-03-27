import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Star,
  Clock,
  Download,
  BookOpen,
} from "lucide-react-native";

interface BookDetailsProps {
  id?: string;
  title?: string;
  author?: string;
  coverImage?: string;
  rating?: number;
  totalRatings?: number;
  pageCount?: number;
  description?: string;
  publishedDate?: string;
  genre?: string[];
  onBackPress?: () => void;
  onBorrowPress?: () => void;
  onBookmarkPress?: () => void;
  onSharePress?: () => void;
  onReadPress?: () => void;
}

const BookDetails = ({
  id = "1",
  title = "The Great Gatsby",
  author = "F. Scott Fitzgerald",
  coverImage = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
  rating = 4.5,
  totalRatings = 2453,
  pageCount = 218,
  description = "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
  publishedDate = "April 10, 1925",
  genre = ["Classic", "Fiction", "Literary Fiction"],
  onBackPress = () => {},
  onBorrowPress = () => {},
  onBookmarkPress = () => {},
  onSharePress = () => {},
  onReadPress = () => {},
}: BookDetailsProps) => {
  // Function to render stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} color="#FBBF24" fill="#FBBF24" />);
      } else if (i === fullStars && hasHalfStar) {
        // For simplicity, we'll just use a full star for half stars in this example
        stars.push(
          <Star
            key={i}
            size={16}
            color="#FBBF24"
            fill="#FBBF24"
            opacity={0.5}
          />,
        );
      } else {
        stars.push(<Star key={i} size={16} color="#D1D5DB" />);
      }
    }
    return stars;
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header with back button */}
      <View className="flex-row items-center justify-between p-5 bg-white border-b border-gray-100 shadow-sm">
        <TouchableOpacity
          onPress={() => {
            if (onBackPress) {
              onBackPress();
            }
          }}
          className="p-2"
        >
          <ArrowLeft size={24} color="#4f46e5" />
        </TouchableOpacity>
        <View className="flex-row space-x-4">
          <TouchableOpacity
            onPress={() => {
              if (onBookmarkPress) {
                onBookmarkPress();
              } else {
                Alert.alert(
                  "Bookmarked",
                  "This book has been added to your bookmarks",
                );
              }
            }}
            className="p-2"
          >
            <Bookmark size={24} color="#4f46e5" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (onSharePress) {
                onSharePress();
              } else {
                Alert.alert("Share", "Sharing options would appear here");
              }
            }}
            className="p-2"
          >
            <Share2 size={24} color="#4f46e5" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Book cover and basic info */}
        <View className="p-6 items-center">
          <Image
            source={{ uri: coverImage }}
            className="w-44 h-64 rounded-xl shadow-lg mb-5 border border-gray-100"
            resizeMode="cover"
          />
          <Text className="text-2xl font-bold text-center text-gray-800 mb-1.5">
            {title}
          </Text>
          <Text className="text-lg text-gray-600 mb-3">{author}</Text>

          {/* Rating */}
          <View className="flex-row items-center mb-5 bg-amber-50 px-3 py-1.5 rounded-full">
            <View className="flex-row mr-2">{renderStars()}</View>
            <Text className="text-amber-700 font-medium">
              {rating} ({totalRatings})
            </Text>
          </View>

          {/* Book metadata */}
          <View className="flex-row justify-around w-full mb-6 px-4">
            <View className="items-center bg-gray-50 px-4 py-3 rounded-xl">
              <Clock size={20} color="#6366f1" />
              <Text className="text-sm text-gray-700 mt-1 font-medium">
                {pageCount} pages
              </Text>
            </View>
            <View className="items-center bg-gray-50 px-4 py-3 rounded-xl">
              <Download size={20} color="#6366f1" />
              <Text className="text-sm text-gray-700 mt-1 font-medium">
                PDF, EPUB
              </Text>
            </View>
            <View className="items-center bg-gray-50 px-4 py-3 rounded-xl">
              <BookOpen size={20} color="#6366f1" />
              <Text className="text-sm text-gray-700 mt-1 font-medium">
                {publishedDate}
              </Text>
            </View>
          </View>

          {/* Genres */}
          <View className="flex-row flex-wrap justify-center mb-6">
            {genre.map((item, index) => (
              <View
                key={index}
                className="bg-primary-100 px-4 py-1.5 rounded-full mr-2 mb-2"
              >
                <Text className="text-primary-700 text-sm font-medium">
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Borrow button */}
          <View className="flex-row space-x-4 w-4/5 mb-6">
            <TouchableOpacity
              onPress={() => {
                if (onBorrowPress) {
                  onBorrowPress();
                } else {
                  Alert.alert(
                    "Success",
                    "Book has been borrowed and added to your library. It will be available for 14 days.",
                  );
                }
              }}
              className="bg-primary-600 py-3.5 px-6 rounded-xl flex-1 shadow-sm"
            >
              <Text className="text-white font-bold text-center text-lg">
                Borrow
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (onReadPress) {
                  onReadPress();
                } else {
                  Alert.alert("Read Now", "Opening book for reading...");
                }
              }}
              className="bg-secondary-600 py-3.5 px-6 rounded-xl flex-1 shadow-sm"
            >
              <Text className="text-white font-bold text-center text-lg">
                Read Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View className="px-6 pb-8">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            Description
          </Text>
          <Text className="text-gray-700 leading-6 text-base">
            {description}
          </Text>
        </View>

        {/* Additional sections could be added here: reviews, similar books, etc. */}
      </ScrollView>
    </View>
  );
};

export default BookDetails;
