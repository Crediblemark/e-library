import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { Lock, Mail, Eye, EyeOff } from "lucide-react-native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        // Small delay to ensure context is updated before navigation
        setTimeout(() => {
          router.replace("/");
        }, 100);
      } else {
        Alert.alert("Login Failed", "Invalid username or password");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during login");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-8 pt-10 pb-20">
          {/* Logo and Header */}
          <View className="items-center mb-10">
            <Image
              source={require("../assets/images/icon.png")}
              className="w-24 h-24 mb-4"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-primary-600 mb-2">
              School E-Library
            </Text>
            <Text className="text-gray-500 text-center">
              Sign in to access your digital library
            </Text>
          </View>

          {/* Login Form */}
          <View className="space-y-4 mb-6">
            <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center border border-gray-200">
              <Mail size={20} color="#6366f1" className="mr-2" />
              <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                className="flex-1 text-gray-800 ml-2"
              />
            </View>

            <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center border border-gray-200">
              <Lock size={20} color="#6366f1" className="mr-2" />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="flex-1 text-gray-800 ml-2"
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                {showPassword ? (
                  <EyeOff size={20} color="#6366f1" />
                ) : (
                  <Eye size={20} color="#6366f1" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`bg-primary-600 py-4 rounded-xl items-center ${isLoading ? "opacity-70" : ""}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Demo Credentials */}
          <View className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <Text className="text-gray-700 font-medium mb-2">
              Demo Credentials:
            </Text>
            <Text className="text-gray-600">
              Student: student1 / password123
            </Text>
            <Text className="text-gray-600">
              Librarian: librarian1 / password123
            </Text>
            <Text className="text-gray-600">Admin: admin / admin123</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
