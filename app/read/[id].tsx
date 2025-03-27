import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  TextQuote,
} from "lucide-react-native";

const ReadScreen = () => {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState({
    id: id,
    title: "Sample Book",
    author: "Author Name",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    ],
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [darkMode, setDarkMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [readingTime, setReadingTime] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const [showHighlightOptions, setShowHighlightOptions] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const controlsTimeout = useRef(null);

  useEffect(() => {
    // Start reading time counter
    const interval = setInterval(() => {
      setReadingTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const nextPage = () => {
    if (currentPage < book.content.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const calculateProgress = () => {
    return Math.round(((currentPage + 1) / book.content.length) * 100);
  };

  const formatReadingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleTextSelection = (text) => {
    setSelectedText(text);
    if (text) {
      setShowHighlightOptions(true);
    } else {
      setShowHighlightOptions(false);
    }
  };

  const handleHighlight = (color) => {
    // Here you would implement the actual highlighting logic
    Alert.alert("Highlighted", `Text "${selectedText}" has been highlighted.`);
    setShowHighlightOptions(false);
  };

  const handleAddNote = () => {
    Alert.alert("Note", "Add a note to this selection", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Save",
        onPress: () => {
          Alert.alert("Note saved", "Your note has been saved.");
          setShowHighlightOptions(false);
        },
      },
    ]);
  };

  const toggleControls = () => {
    if (showControls) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    } else {
      setShowControls(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Auto-hide controls after 3 seconds
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }

      controlsTimeout.current = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setShowControls(false));
      }, 3000);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={toggleControls}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="py-4">
            <Text
              className={`text-center text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Page {currentPage + 1} of {book.content.length} •{" "}
              {calculateProgress()}% complete • Reading time:{" "}
              {formatReadingTime(readingTime)}
            </Text>
            <Text
              style={{ fontSize }}
              className={`leading-7 ${darkMode ? "text-white" : "text-black"}`}
              selectable={true}
              onSelectionChange={(event) => {
                const { selection, text } = event.nativeEvent;
                if (selection.start !== selection.end) {
                  const selectedText = text.substring(
                    selection.start,
                    selection.end,
                  );
                  handleTextSelection(selectedText);
                } else {
                  handleTextSelection("");
                }
              }}
            >
              {book.content[currentPage]}
            </Text>
          </View>
        </ScrollView>
      </TouchableOpacity>

      {/* Text selection options */}
      {showHighlightOptions && (
        <View
          className={`absolute bottom-20 left-0 right-0 mx-auto w-4/5 bg-white rounded-xl shadow-lg p-4 border border-gray-200 ${darkMode ? "bg-gray-800 border-gray-700" : ""}`}
        >
          <Text
            className={`text-sm mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            numberOfLines={2}
          >
            "{selectedText}"
          </Text>
          <View className="flex-row justify-around">
            <TouchableOpacity
              onPress={() => handleHighlight("yellow")}
              className="bg-yellow-100 px-3 py-2 rounded-lg"
            >
              <Text className="text-yellow-800 font-medium">Highlight</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddNote}
              className="bg-blue-100 px-3 py-2 rounded-lg"
            >
              <Text className="text-blue-800 font-medium">Add Note</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowHighlightOptions(false)}
              className="bg-gray-100 px-3 py-2 rounded-lg"
            >
              <Text className="text-gray-800 font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom controls */}
      {showControls && (
        <Animated.View
          style={{ opacity: fadeAnim }}
          className={`flex-row justify-between items-center p-4 border-t ${darkMode ? "border-gray-800" : "border-gray-200"}`}
        >
          <TouchableOpacity
            onPress={prevPage}
            disabled={currentPage === 0}
            className={`p-2 ${currentPage === 0 ? "opacity-50" : ""}`}
          >
            <ChevronLeft size={24} color={darkMode ? "#ffffff" : "#000000"} />
          </TouchableOpacity>

          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Highlight",
                  "Text has been highlighted and saved to your notes.",
                );
              }}
            >
              <TextQuote size={22} color={darkMode ? "#ffffff" : "#000000"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Share", "Sharing options would appear here.");
              }}
            >
              <Share2 size={22} color={darkMode ? "#ffffff" : "#000000"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Favorite",
                  "This book has been added to your favorites.",
                );
              }}
            >
              <Heart size={22} color={darkMode ? "#ffffff" : "#000000"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize(fontSize + 1)}>
              <Text
                className={`text-lg font-bold ${darkMode ? "text-white" : "text-black"}`}
              >
                A+
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFontSize(Math.max(12, fontSize - 1))}
            >
              <Text
                className={`text-lg font-bold ${darkMode ? "text-white" : "text-black"}`}
              >
                A-
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={nextPage}
            disabled={currentPage === book.content.length - 1}
            className={`p-2 ${currentPage === book.content.length - 1 ? "opacity-50" : ""}`}
          >
            <ChevronRight size={24} color={darkMode ? "#ffffff" : "#000000"} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default ReadScreen;
