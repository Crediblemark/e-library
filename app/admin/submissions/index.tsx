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
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react-native";

// Mock data for demonstration
const initialSubmissions = [
  {
    id: "1",
    title: "The Mystery of the Hidden Lake",
    author: "Alex Student",
    authorId: "1",
    submittedDate: "2023-11-15",
    status: "pending",
    chapters: 5,
    wordCount: 12500,
    genre: "Mystery",
    coverImage:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80",
  },
  {
    id: "2",
    title: "Journey to the Stars",
    author: "Taylor Student",
    authorId: "4",
    submittedDate: "2023-11-10",
    status: "approved",
    chapters: 8,
    wordCount: 24300,
    genre: "Science Fiction",
    coverImage:
      "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&q=80",
  },
  {
    id: "3",
    title: "The Last Dragon",
    author: "Jordan Student",
    authorId: "5",
    submittedDate: "2023-11-05",
    status: "rejected",
    chapters: 12,
    wordCount: 35000,
    genre: "Fantasy",
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
  },
  {
    id: "4",
    title: "Echoes of the Past",
    author: "Alex Student",
    authorId: "1",
    submittedDate: "2023-11-01",
    status: "pending",
    chapters: 6,
    wordCount: 18200,
    genre: "Historical Fiction",
    coverImage:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80",
  },
];

export default function ManageSubmissions() {
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    // Check if user has librarian or admin role
    if (!user || !hasRole(UserRole.LIBRARIAN)) {
      Alert.alert(
        "Access Denied",
        "You do not have permission to access this area.",
      );
      router.replace("/admin");
    }
  }, [hasRole, router, user]);

  const statuses = ["All", "pending", "approved", "rejected"];

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || submission.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApproveSubmission = (id) => {
    // In a real app, this would call an API
    setSubmissions(
      submissions.map((submission) =>
        submission.id === id
          ? { ...submission, status: "approved" }
          : submission,
      ),
    );
    Alert.alert(
      "Submission Approved",
      "The submission has been approved and will be published to the library.",
    );
  };

  const handleRejectSubmission = (id) => {
    // In a real app, this would call an API
    Alert.alert(
      "Confirm Rejection",
      "Are you sure you want to reject this submission?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reject",
          onPress: () => {
            setSubmissions(
              submissions.map((submission) =>
                submission.id === id
                  ? { ...submission, status: "rejected" }
                  : submission,
              ),
            );
            Alert.alert(
              "Submission Rejected",
              "The submission has been rejected. The author will be notified.",
            );
          },
          style: "destructive",
        },
      ],
    );
  };

  const handleViewSubmission = (id) => {
    // In a real app, this would navigate to a detailed view
    Alert.alert(
      "View Submission",
      "This would open the full submission for review.",
    );
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} color="#16a34a" />;
      case "rejected":
        return <XCircle size={16} color="#dc2626" />;
      default:
        return <Clock size={16} color="#ca8a04" />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#4f46e5" />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1">Student Submissions</Text>
      </View>

      {/* Search and Filter */}
      <View className="p-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
          <Search size={20} color="#6b7280" />
          <TextInput
            placeholder="Search submissions..."
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
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setSelectedStatus(status)}
              className={`mr-2 px-4 py-2 rounded-full ${selectedStatus === status ? "bg-primary-600" : "bg-gray-200"}`}
            >
              <Text
                className={`${selectedStatus === status ? "text-white" : "text-gray-700"} capitalize`}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 p-4">
        {filteredSubmissions.length === 0 ? (
          <View className="items-center justify-center py-10">
            <Text className="text-gray-500 text-lg">No submissions found</Text>
          </View>
        ) : (
          filteredSubmissions.map((submission) => (
            <View
              key={submission.id}
              className="bg-white rounded-xl p-4 mb-4 flex-row shadow-sm border border-gray-100"
            >
              <Image
                source={{ uri: submission.coverImage }}
                className="w-20 h-28 rounded-md"
              />
              <View className="flex-1 ml-4 justify-between">
                <View>
                  <Text className="text-lg font-bold">{submission.title}</Text>
                  <View className="flex-row items-center">
                    <User size={14} color="#6b7280" className="mr-1" />
                    <Text className="text-gray-600">{submission.author}</Text>
                  </View>
                  <View className="flex-row mt-1">
                    <View
                      className={`px-2 py-1 rounded-full ${getStatusBadgeStyle(submission.status)} mr-2 flex-row items-center`}
                    >
                      {getStatusIcon(submission.status)}
                      <Text className={`text-xs ml-1 capitalize`}>
                        {submission.status}
                      </Text>
                    </View>
                    <View className="px-2 py-1 rounded-full bg-gray-100">
                      <Text className="text-xs text-gray-800">
                        {submission.genre}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-500 mt-1">
                    Submitted: {submission.submittedDate}
                  </Text>
                  <Text className="text-gray-500">
                    {submission.chapters} chapters • {submission.wordCount}{" "}
                    words
                  </Text>
                </View>
                <View className="flex-row mt-2">
                  <TouchableOpacity
                    onPress={() => handleViewSubmission(submission.id)}
                    className="bg-gray-100 p-2 rounded-full mr-2"
                  >
                    <FileText size={18} color="#4f46e5" />
                  </TouchableOpacity>
                  {submission.status === "pending" && (
                    <>
                      <TouchableOpacity
                        onPress={() => handleApproveSubmission(submission.id)}
                        className="bg-green-100 p-2 rounded-full mr-2"
                      >
                        <CheckCircle size={18} color="#16a34a" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRejectSubmission(submission.id)}
                        className="bg-red-100 p-2 rounded-full"
                      >
                        <XCircle size={18} color="#dc2626" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
