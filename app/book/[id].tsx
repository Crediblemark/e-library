import React from "react";
import { View, SafeAreaView, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BookDetails from "../../src/components/BookDetails";

// Mock data for demonstration
const booksData = {
  "1": {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
    rating: 4.5,
    totalRatings: 2453,
    pageCount: 218,
    description:
      "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    publishedDate: "April 10, 1925",
    genre: ["Classic", "Fiction", "Literary Fiction"],
  },
  "2": {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
    rating: 4.8,
    totalRatings: 3782,
    pageCount: 281,
    description:
      "To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature. The plot and characters are loosely based on Lee's observations of her family, her neighbors and an event that occurred near her hometown of Monroeville, Alabama, in 1936, when she was ten.",
    publishedDate: "July 11, 1960",
    genre: ["Classic", "Historical Fiction", "Coming-of-age"],
  },
  "3": {
    id: "3",
    title: "1984",
    author: "George Orwell",
    coverImage:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&q=80",
    rating: 4.6,
    totalRatings: 3125,
    pageCount: 328,
    description:
      "1984 is a dystopian novel by English novelist George Orwell. It was published on 8 June 1949 by Secker & Warburg as Orwell's ninth and final book completed in his lifetime. Thematically, 1984 centres on the consequences of totalitarianism, mass surveillance, and repressive regimentation of persons and behaviours within society.",
    publishedDate: "June 8, 1949",
    genre: ["Dystopian", "Science Fiction", "Political Fiction"],
  },
};

export default function BookDetailsPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Get book data based on ID from the URL
  const bookId = Array.isArray(id) ? id[0] : id;
  const bookData =
    booksData[bookId as keyof typeof booksData] || booksData["1"];

  const handleBackPress = () => {
    router.back();
  };

  const handleBorrowPress = () => {
    // In a real app, this would handle the borrowing process
    console.log(`Borrowing book: ${bookData.title}`);
    // Could navigate to a confirmation screen
    // router.push(`/borrow-confirmation/${bookId}`);
  };

  const handleReadPress = () => {
    // Navigate to the reading experience
    router.push(`/read/${bookId}`);
  };

  const handleBookmarkPress = () => {
    console.log(`Bookmarking: ${bookData.title}`);
    // In a real app, this would save the book to the user's bookmarks
  };

  const handleSharePress = () => {
    console.log(`Sharing: ${bookData.title}`);
    // In a real app, this would open a share dialog
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <BookDetails
        {...bookData}
        onBackPress={handleBackPress}
        onBorrowPress={handleBorrowPress}
        onBookmarkPress={handleBookmarkPress}
        onSharePress={handleSharePress}
        onReadPress={handleReadPress}
      />
    </SafeAreaView>
  );
}
