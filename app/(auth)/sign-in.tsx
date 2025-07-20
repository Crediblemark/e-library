import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Lock, Mail, Eye, EyeOff, BookOpen } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!emailAddress.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSignInPress = async () => {
    if (!isLoaded || !validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({ email: '', password: '' });

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error('Sign-in not complete:', signInAttempt);
        Alert.alert('Login Failed', 'Sign-in process not complete. Please try again.');
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'An error occurred during sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-8 py-12">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-3xl shadow-lg mb-6">
              <BookOpen size={48} color="white" />
            </View>
            <Text className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</Text>
            <Text className="text-lg text-gray-600 text-center">
              Sign in to continue your reading journey
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6">
            {/* Email Input */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2 text-base">Email</Text>
              <View className={`flex-row items-center bg-white rounded-2xl px-4 py-4 shadow-sm border-2 ${
                errors.email ? 'border-red-300' : 'border-gray-200'
              }`}>
                <Mail size={20} color={errors.email ? '#ef4444' : '#6b7280'} />
                <TextInput
                  className="flex-1 ml-3 text-gray-800 text-base font-medium"
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email ? (
                <Text className="text-red-500 text-sm mt-1 ml-1">{errors.email}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-gray-700 font-semibold mb-2 text-base">Password</Text>
              <View className={`flex-row items-center bg-white rounded-2xl px-4 py-4 shadow-sm border-2 ${
                errors.password ? 'border-red-300' : 'border-gray-200'
              }`}>
                <Lock size={20} color={errors.password ? '#ef4444' : '#6b7280'} />
                <TextInput
                  className="flex-1 ml-3 text-gray-800 text-base font-medium"
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity onPress={togglePasswordVisibility} className="ml-2">
                  {showPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text className="text-red-500 text-sm mt-1 ml-1">{errors.password}</Text>
              ) : null}
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={onSignInPress}
              disabled={isLoading || !isLoaded}
              className={`bg-gradient-to-r from-blue-600 to-indigo-600 py-5 rounded-2xl items-center shadow-lg ${
                (isLoading || !isLoaded) ? 'opacity-60' : 'opacity-100'
              }`}
              style={{
                boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
                elevation: 6,
              }}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-bold text-lg ml-2">Signing In...</Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-lg">Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600 text-base">Don't have an account? </Text>
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 font-semibold text-base">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Demo Credentials */}
          <View className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-sm mt-8">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 p-2 rounded-full mr-3">
                <Mail size={16} color="#3b82f6" />
              </View>
              <Text className="text-blue-800 font-bold text-lg">Demo Credentials</Text>
            </View>
            
            <View className="space-y-3">
              <View className="bg-white p-4 rounded-xl border border-blue-100">
                <Text className="text-blue-700 font-semibold text-sm mb-1">Student Account</Text>
                <Text className="text-gray-600 text-sm">Email: student@demo.com</Text>
                <Text className="text-gray-600 text-sm">Password: demo123</Text>
              </View>
              
              <View className="bg-white p-4 rounded-xl border border-blue-100">
                <Text className="text-blue-700 font-semibold text-sm mb-1">Librarian Account</Text>
                <Text className="text-gray-600 text-sm">Email: librarian@demo.com</Text>
                <Text className="text-gray-600 text-sm">Password: demo123</Text>
              </View>
              
              <View className="bg-white p-4 rounded-xl border border-blue-100">
                <Text className="text-blue-700 font-semibold text-sm mb-1">Admin Account</Text>
                <Text className="text-gray-600 text-sm">Email: admin@demo.com</Text>
                <Text className="text-gray-600 text-sm">Password: demo123</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}