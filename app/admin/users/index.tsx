import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../src/context/AuthContext";
import { UserRole } from "../../../src/utils/auth";
import {
  ArrowLeft,
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Filter,
  User,
  BookOpen,
  Shield,
} from "lucide-react-native";

// Mock data for demonstration
const initialUsers = [
  {
    id: "1",
    name: "Alex Student",
    email: "student1@school.edu",
    role: UserRole.READER,
    booksRead: 12,
    booksCheckedOut: 2,
    joinDate: "2023-09-01",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    id: "2",
    name: "Jamie Librarian",
    email: "librarian@school.edu",
    role: UserRole.LIBRARIAN,
    booksRead: 45,
    booksCheckedOut: 0,
    joinDate: "2022-08-15",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
  },
  {
    id: "3",
    name: "Sam Admin",
    email: "admin@school.edu",
    role: UserRole.ADMIN,
    booksRead: 23,
    booksCheckedOut: 1,
    joinDate: "2022-01-10",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
  },
  {
    id: "4",
    name: "Taylor Student",
    email: "student2@school.edu",
    role: UserRole.READER,
    booksRead: 8,
    booksCheckedOut: 3,
    joinDate: "2023-10-05",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
  },
  {
    id: "5",
    name: "Jordan Student",
    email: "student3@school.edu",
    role: UserRole.READER,
    booksRead: 15,
    booksCheckedOut: 1,
    joinDate: "2023-08-20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
  },
];

export default function ManageUsers() {
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  useEffect(() => {
    // Check if user has admin role
    if (!user || !hasRole(UserRole.ADMIN)) {
      Alert.alert("Access Denied", "Only administrators can manage users.");
      router.replace("/admin");
    }
  }, [hasRole, router, user]);

  const roles = ["All", "reader", "librarian", "admin"];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "All" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = (id: string) => {
    // Prevent deleting yourself
    if (id === user?.id) {
      Alert.alert("Error", "You cannot delete your own account");
      return;
    }

    // In a real app, this would call an API
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => setUsers(users.filter((u) => u.id !== id)),
          style: "destructive",
        },
      ],
    );
  };

  const handleEditUser = (id: string) => {
    // In a real app, this would navigate to an edit screen
    Alert.alert("Edit User", "This would navigate to edit user screen");
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Shield size={18} color="#9333ea" />;
      case UserRole.LIBRARIAN:
        return <BookOpen size={18} color="#0891b2" />;
      default:
        return <User size={18} color="#4f46e5" />;
    }
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-purple-100 text-purple-800";
      case UserRole.LIBRARIAN:
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#4f46e5" />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1">Manage Users</Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Add User", "This would open a form to add a new user")
          }
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
            placeholder="Search users..."
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
          {roles.map((role) => (
            <TouchableOpacity
              key={role}
              onPress={() => setSelectedRole(role)}
              className={`mr-2 px-4 py-2 rounded-full ${selectedRole === role ? "bg-primary-600" : "bg-gray-200"}`}
            >
              <Text
                className={`${selectedRole === role ? "text-white" : "text-gray-700"} capitalize`}
              >
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 p-4">
        {filteredUsers.length === 0 ? (
          <View className="items-center justify-center py-10">
            <Text className="text-gray-500 text-lg">No users found</Text>
          </View>
        ) : (
          filteredUsers.map((u) => (
            <View
              key={u.id}
              className="bg-white rounded-xl p-4 mb-4 flex-row shadow-sm border border-gray-100"
            >
              <Image
                source={{ uri: u.avatar }}
                className="w-16 h-16 rounded-full"
              />
              <View className="flex-1 ml-4 justify-between">
                <View>
                  <Text className="text-lg font-bold">{u.name}</Text>
                  <Text className="text-gray-600">{u.email}</Text>
                  <View className="flex-row mt-1">
                    <View
                      className={`px-2 py-1 rounded-full ${getRoleBadgeStyle(u.role)} mr-2 flex-row items-center`}
                    >
                      {getRoleIcon(u.role)}
                      <Text className={`text-xs ml-1 capitalize`}>
                        {u.role}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-500 mt-1">
                    Joined: {u.joinDate}
                  </Text>
                  <Text className="text-gray-500">
                    Books read: {u.booksRead} | Checked out: {u.booksCheckedOut}
                  </Text>
                </View>
                <View className="flex-row mt-2">
                  <TouchableOpacity
                    onPress={() => handleEditUser(u.id)}
                    className="bg-blue-100 p-2 rounded-full mr-2"
                  >
                    <Edit size={18} color="#4f46e5" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteUser(u.id)}
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
