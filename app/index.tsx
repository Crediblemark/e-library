import React from "react";
import { View, Text, ScrollView, SafeAreaView, StatusBar } from "react-native";
import { useRouter } from "expo-router";

// Import components
import Header from "../src/components/Header";
import NavigationBar from "../src/components/NavigationBar";
import BookCarousel from "../src/components/BookCarousel";
import CategorySection from "../src/components/CategorySection";
import RecentlyReadSection from "../src/components/RecentlyReadSection";
import WritingProjectsPreview from "../src/components/WritingProjectsPreview";

export default function HomePage() {
  const router = useRouter();

  // Handler functions
  const handleBookPress = (book: any) => {
    console.log("Book pressed:", book.title);
    // Navigate to book details page
    router.push(`/book/${book.id}`);
  };

  const handleCategoryPress = (categoryId: string) => {
    console.log("Category pressed:", categoryId);
    // Navigate to category page
    // router.push(`/category/${categoryId}`);
  };

  const handleContinueReading = (bookId: string) => {
    console.log("Continue reading book:", bookId);
    // Navigate to reading page
    router.push(`/book/${bookId}`);
  };

  const handleCreateNewWritingProject = () => {
    console.log("Create new writing project");
    // Navigate to writing project creation page
    router.push("/write/new");
  };

  const handleContinueWriting = (projectId: string) => {
    console.log("Continue writing project:", projectId);
    // Navigate to writing project editor
    router.push(`/write/project/${projectId}`);
  };

  const handleSearchPress = () => {
    console.log("Search pressed");
    // Navigate to search page
    // router.push('/search');
  };

  const handleProfilePress = () => {
    console.log("Profile pressed");
    // Navigate to profile page
    // router.push('/profile');
  };

  const handleSeeAllBooks = () => {
    console.log("See all books pressed");
    // Navigate to all books page
    // router.push('/books');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Header
        onSearchPress={handleSearchPress}
        onProfilePress={handleProfilePress}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Featured Books Carousel */}
        <BookCarousel
          title="Featured Books"
          description="Discover our top picks for you"
          onBookPress={handleBookPress}
          onSeeAll={handleSeeAllBooks}
        />

        {/* Categories Section */}
        <CategorySection
          title="Browse Categories"
          onCategoryPress={handleCategoryPress}
        />

        {/* Recently Read Section */}
        <RecentlyReadSection onContinueReading={handleContinueReading} />

        {/* New Arrivals Carousel */}
        <BookCarousel
          title="New Arrivals"
          description="Just added to our library"
          onBookPress={handleBookPress}
          onSeeAll={handleSeeAllBooks}
          books={[
            {
              id: "6",
              title: "The Invisible Life of Addie LaRue",
              author: "V.E. Schwab",
              imageUrl:
                "https://images.unsplash.com/photo-1603162617003-eecf7f236bd3?w=400&q=80",
            },
            {
              id: "7",
              title: "Klara and the Sun",
              author: "Kazuo Ishiguro",
              imageUrl:
                "https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=400&q=80",
            },
            {
              id: "8",
              title: "The Four Winds",
              author: "Kristin Hannah",
              imageUrl:
                "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80",
            },
            {
              id: "9",
              title: "The Midnight Library",
              author: "Matt Haig",
              imageUrl:
                "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80",
            },
          ]}
        />

        {/* Popular Among Students Carousel */}
        <BookCarousel
          title="Popular Among Students"
          description="What your classmates are reading"
          onBookPress={handleBookPress}
          onSeeAll={handleSeeAllBooks}
          books={[
            {
              id: "10",
              title: "Harry Potter and the Sorcerer's Stone",
              author: "J.K. Rowling",
              imageUrl:
                "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=400&q=80",
            },
            {
              id: "11",
              title: "Percy Jackson & The Lightning Thief",
              author: "Rick Riordan",
              imageUrl:
                "https://images.unsplash.com/photo-1518744386442-2d48ac47a7eb?w=400&q=80",
            },
            {
              id: "12",
              title: "The Hunger Games",
              author: "Suzanne Collins",
              imageUrl:
                "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=400&q=80",
            },
            {
              id: "13",
              title: "Diary of a Wimpy Kid",
              author: "Jeff Kinney",
              imageUrl:
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
            },
          ]}
        />

        {/* Writing Projects Preview */}
        <View className="px-4 mt-4">
          <WritingProjectsPreview
            onCreateNew={handleCreateNewWritingProject}
            onContinueWriting={handleContinueWriting}
          />
        </View>
      </ScrollView>

      <NavigationBar activeTab="home" />
    </SafeAreaView>
  );
}
