import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import BookCover from "./BookCover";

interface Book {
  id: string;
  title: string;
  author: string;
  imageUrl?: string;
}

interface BookCarouselProps {
  title?: string;
  description?: string;
  books?: Book[];
  onSeeAll?: () => void;
  onBookPress?: (book: Book) => void;
}

const BookCarousel = ({
  title = "Featured Books",
  description = "Discover our top picks for you",
  books = [
    {
      id: "1",
      title: "The Midnight Library",
      author: "Matt Haig",
      imageUrl:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
    },
    {
      id: "2",
      title: "Educated",
      author: "Tara Westover",
      imageUrl:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
    },
    {
      id: "3",
      title: "Atomic Habits",
      author: "James Clear",
      imageUrl:
        "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80",
    },
    {
      id: "4",
      title: "Project Hail Mary",
      author: "Andy Weir",
      imageUrl:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
    },
    {
      id: "5",
      title: "The Song of Achilles",
      author: "Madeline Miller",
      imageUrl:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80",
    },
  ],
  onSeeAll = () => {},
  onBookPress = () => {},
}: BookCarouselProps) => {
  return (
    <View className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-xl font-bold text-gray-800">{title}</Text>
          <Text className="text-sm text-gray-500">{description}</Text>
        </View>
        <TouchableOpacity
          onPress={onSeeAll}
          className="flex-row items-center bg-primary-50 px-3 py-1.5 rounded-full"
          activeOpacity={0.7}
        >
          <Text className="text-primary-600 mr-1 font-medium">See all</Text>
          <ChevronRight size={16} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pt-2"
        contentContainerStyle={{ paddingRight: 20, paddingLeft: 2 }}
      >
        {books.map((book) => (
          <BookCover
            key={book.id}
            title={book.title}
            author={book.author}
            imageUrl={book.imageUrl}
            onPress={() => onBookPress(book)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default BookCarousel;
