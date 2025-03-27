import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";
import {
  Book,
  Home,
  BookOpen,
  Trophy,
  User,
  Shield,
  Edit3,
} from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../utils/auth";

interface NavigationBarProps {
  activeTab?: "home" | "myBooks" | "write" | "achievements" | "profile";
}

const NavigationBar = ({ activeTab = "home" }: NavigationBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useAuth();

  const tabs = [
    {
      name: "home",
      label: "Library",
      icon: Home,
      route: "/",
    },
    {
      name: "myBooks",
      label: "My Books",
      icon: Book,
      route: "/my-books",
    },
    {
      name: "write",
      label: "Write",
      icon: Edit3,
      route: "/write",
    },
    {
      name: "achievements",
      label: "Achievements",
      icon: Trophy,
      route: "/achievements",
    },
    {
      name: "profile",
      label: "Profile",
      icon: User,
      route: "/profile",
    },
  ];

  // Add admin tab for librarians and admins
  if (
    user &&
    (user.role === UserRole.LIBRARIAN || user.role === UserRole.ADMIN)
  ) {
    tabs.push({
      name: "admin",
      label: "Admin",
      icon: Shield,
      route: "/admin",
    });
  }

  const handleNavigation = (route: string) => {
    try {
      router.push(route);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <View className="flex-row justify-between items-center bg-white border-t border-gray-100 h-[75px] px-2 pt-1 pb-2 shadow-lg shadow-gray-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name || pathname === tab.route;
        const IconComponent = tab.icon;

        return (
          <TouchableOpacity
            key={tab.name}
            className={`flex-1 items-center justify-center py-2 mx-1 ${isActive ? "bg-primary-50 rounded-xl" : ""}`}
            onPress={() => handleNavigation(tab.route)}
          >
            <IconComponent
              size={24}
              color={isActive ? "#4f46e5" : "#64748b"}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <Text
              className={`text-xs mt-1 ${isActive ? "text-primary-600 font-medium" : "text-gray-500"}`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default NavigationBar;
