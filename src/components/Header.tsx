import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Search, User } from "lucide-react-native";

interface HeaderProps {
  title?: string;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
}

const Header = ({
  title = "E-Library",
  onSearchPress = () => console.log("Search pressed"),
  onProfilePress = () => console.log("Profile pressed"),
}: HeaderProps) => {
  return (
    <SafeAreaView className="bg-white">
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-100 shadow-sm">
        <View>
          <Text className="text-xl font-bold text-primary-600">{title}</Text>
        </View>

        <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            onPress={onSearchPress}
            className="p-2.5 rounded-full bg-primary-50 active:bg-primary-100"
          >
            <Search size={20} color="#4f46e5" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onProfilePress}
            className="p-2.5 rounded-full bg-primary-50 active:bg-primary-100"
          >
            <User size={20} color="#4f46e5" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;
