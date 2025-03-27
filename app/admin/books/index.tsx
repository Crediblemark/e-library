import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Filter,
} from "lucide-react-native";

// Mock data for demonstration
const initialBooks = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
    status: "Available",
    category: "Fiction",
    borrowCount: 24,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverImage:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    status: "Available",
    category: "Fiction",
    borrowCount: 32,
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    coverImage:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&q=80",
    status: "Checked Out",
    category: "Science Fiction",
    borrowCount: 18,
  },
  {
    id: "4",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    coverImage:
      "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=400&q=80",
    status: "Available",
    category: "Fantasy",
    borrowCount: 27,
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    coverImage:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80",
    status: "Available",
    category: "Romance",
    borrowCount: 15,
  },
];

export default function ManageBooks() {
  const router = useRouter();
  const [books, setBooks] = useState(initialBooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Fiction",
    "Science Fiction",
    "Fantasy",
    "Romance",
    "Non-Fiction",
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteBook = (id: string) => {
    // In a real app, this would call an API
    setBooks(books.filter((book) => book.id !== id));
  };

  const handleEditBook = (id: string) => {
    router.push(`/admin/books/edit/${id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#4f46e5" />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1">Manage Books</Text>
        <TouchableOpacity
          onPress={() => router.push("/admin/books/new")}
          className="bg-primary-600 p-2 rounded-full"
        >
          <PlusCircle size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View className="p-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
          <Search size={20} color="#6b7280" />
          <TextInput
            placeholder="Search books..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-gray-800"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pb-2"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`mr-2 px-4 py-2 rounded-full ${selectedCategory === category ? "bg-primary-600" : "bg-gray-200"}`}
            >
              <Text
                className={`${selectedCategory === category ? "text-white" : "text-gray-700"}`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 p-4">
        {filteredBooks.length === 0 ? (
          <View className="items-center justify-center py-10">
            <Text className="text-gray-500 text-lg">No books found</Text>
          </View>
        ) : (
          filteredBooks.map((book) => (
            <View
              key={book.id}
              className="bg-white rounded-xl p-4 mb-4 flex-row shadow-sm border border-gray-100"
            >
              <Image
                source={{ uri: book.coverImage }}
                className="w-20 h-28 rounded-md"
              />
              <View className="flex-1 ml-4 justify-between">
                <View>
                  <Text className="text-lg font-bold">{book.title}</Text>
                  <Text className="text-gray-600">{book.author}</Text>
                  <View className="flex-row mt-1">
                    <View
                      className={`px-2 py-1 rounded-full ${book.status === "Available" ? "bg-green-100" : "bg-amber-100"} mr-2`}
                    >
                      <Text
                        className={`text-xs ${book.status === "Available" ? "text-green-800" : "text-amber-800"}`}
                      >
                        {book.status}
                      </Text>
                    </View>
                    <View className="px-2 py-1 rounded-full bg-gray-100">
                      <Text className="text-xs text-gray-800">
                        {book.category}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-500 mt-1">
                    Borrowed {book.borrowCount} times
                  </Text>
                </View>
                <View className="flex-row mt-2">
                  <TouchableOpacity
                    onPress={() => handleEditBook(book.id)}
                    className="bg-blue-100 p-2 rounded-full mr-2"
                  >
                    <Edit size={18} color="#4f46e5" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteBook(book.id)}
                    className="bg-red-100 p-2 rounded-full"
                  >
                    <Trash2 size={18} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
