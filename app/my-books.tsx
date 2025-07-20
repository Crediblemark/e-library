import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Header from "../src/components/Header";
import NavigationBar from "../src/components/NavigationBar";
import {
  getBorrowedBooks,
  getReadingHistory,
  BorrowedBook,
  ReadingHistory,
} from "../src/services/api";
import { useRouter } from "expo-router";
import { useAuth as useClerkAuth } from '@clerk/clerk-expo';
import { BookOpen, Clock } from "lucide-react-native";

export default function MyBooksScreen() {
  const { getToken } = useClerkAuth();
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token;
        try {
          token = await getToken({ template: 'supabase' });
        } catch (tokenError) {
          console.error('Error getting Supabase token - JWT template may not be configured:', tokenError);
          console.warn('Please configure JWT template in Clerk dashboard. See CLERK_JWT_TEMPLATE_FIX.md for instructions.');
          setIsLoading(false);
          return;
        }
        
        if (!token) {
          console.error('No authentication token available - check Clerk JWT template configuration');
          setIsLoading(false);
          return;
        }
        const books = await getBorrowedBooks(token);
        const history = await getReadingHistory(token);
        setBorrowedBooks(books);
        setReadingHistory(history);
      } catch (error) {
        console.error("Error fetching book data:", error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookPress = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title="My Books" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="mt-4 text-gray-600">Loading your books...</Text>
        </View>
        <NavigationBar activeTab="myBooks" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="My Books" />
      <ScrollView className="flex-1 p-4">
        <View className="py-6">
          <Text className="text-2xl font-bold text-primary-600 mb-4">
            My Books
          </Text>
          <Text className="text-gray-500 mb-6">
            Here you'll find all your borrowed books and reading history.
          </Text>

          {/* Currently Borrowed Books */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <BookOpen size={20} color="#4F46E5" />
              <Text className="text-lg font-medium text-gray-800 ml-2">
                Currently Borrowed
              </Text>
            </View>

            {borrowedBooks.length === 0 ? (
              <View className="p-4 bg-gray-50 rounded-xl">
                <Text className="text-gray-500 text-center">
                  You don't have any borrowed books at the moment.
                </Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-2"
              >
                {borrowedBooks.map((book: BorrowedBook) => (
                  <TouchableOpacity
                    key={book.id}
                    onPress={() => handleBookPress(book.id)}
                    className="mr-4 w-32"
                  >
                    <Image
                      source={{ uri: book.coverImage }}
                      className="w-32 h-48 rounded-lg mb-2"
                      resizeMode="cover"
                    />
                    <Text numberOfLines={2} className="text-sm font-medium">
                      {book.title}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      Due: {book.dueDate}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Reading History */}
          <View>
            <View className="flex-row items-center mb-4">
              <Clock size={20} color="#4F46E5" />
              <Text className="text-lg font-medium text-gray-800 ml-2">
                Reading History
              </Text>
            </View>

            {readingHistory.length === 0 ? (
              <View className="p-4 bg-gray-50 rounded-xl">
                <Text className="text-gray-500 text-center">
                  Your reading history will appear here.
                </Text>
              </View>
            ) : (
              readingHistory.map((item: ReadingHistory) => (
                <TouchableOpacity
                  key={item.bookId}
                  onPress={() => handleBookPress(item.bookId)}
                  className="flex-row items-center p-3 bg-gray-50 rounded-xl mb-3"
                >
                  <Image
                    source={{ uri: item.coverImage }}
                    className="w-16 h-24 rounded-md"
                    resizeMode="cover"
                  />
                  <View className="ml-3 flex-1">
                    <Text className="font-medium">{item.bookTitle}</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      Last read: {item.lastReadDate}
                    </Text>
                    <View className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <View
                        className="bg-primary-600 h-full rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </View>
                    <Text className="text-xs text-right mt-1">
                      {item.progress}% complete
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
      <NavigationBar activeTab="myBooks" />
    </SafeAreaView>
  );
}
