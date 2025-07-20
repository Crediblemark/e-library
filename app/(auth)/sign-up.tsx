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
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Lock, Mail, Eye, EyeOff, BookOpen, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({ 
    email: '', 
    password: '', 
    code: ''
  });

  const validateForm = () => {
    const newErrors = { 
      email: '', 
      password: '', 
      code: ''
    };
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
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSignUpPress = async () => {
    if (!isLoaded || !validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({ email: '', password: '', code: '' });

    try {
      // Create sign up with only email and password (Clerk standard)
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Sign-up error:', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'An error occurred during sign-up');
    } finally {
      setIsLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    if (!code.trim()) {
      setErrors(prev => ({ ...prev, code: 'Verification code is required' }));
      return;
    }

    setIsLoading(true);
    setErrors(prev => ({ ...prev, code: '' }));

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/');
      } else {
        console.error('Sign-up not complete:', completeSignUp);
        Alert.alert('Verification Failed', 'Sign-up process not complete. Please try again.');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (pendingVerification) {
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
              <View className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-3xl shadow-lg mb-6">
                <Mail size={48} color="white" />
              </View>
              <Text className="text-4xl font-bold text-gray-800 mb-2">Check Your Email</Text>
              <Text className="text-lg text-gray-600 text-center">
                We've sent a verification code to {emailAddress}
              </Text>
            </View>

            {/* Verification Form */}
            <View className="space-y-6">
              <View>
                <Text className="text-gray-700 font-semibold mb-2 text-base">Verification Code</Text>
                <View className={`flex-row items-center bg-white rounded-2xl px-4 py-4 shadow-sm border-2 ${
                  errors.code ? 'border-red-300' : 'border-gray-200'
                }`}>
                  <Lock size={20} color={errors.code ? '#ef4444' : '#6b7280'} />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 text-base font-medium text-center"
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="#9ca3af"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
                {errors.code ? (
                  <Text className="text-red-500 text-sm mt-1 ml-1">{errors.code}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                onPress={onPressVerify}
                disabled={isLoading}
                className={`bg-gradient-to-r from-green-600 to-emerald-600 py-5 rounded-2xl items-center shadow-lg ${
                  isLoading ? 'opacity-60' : 'opacity-100'
                }`}
              >
                {isLoading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white font-bold text-lg ml-2">Verifying...</Text>
                  </View>
                ) : (
                  <Text className="text-white font-bold text-lg">Verify Email</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

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
            <Text className="text-4xl font-bold text-gray-800 mb-2">Join E-Library</Text>
            <Text className="text-lg text-gray-600 text-center">
              Create your account to start reading
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
                  placeholder="Create a password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
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
              <Text className="text-gray-500 text-sm mt-1 ml-1">
                Password must be at least 8 characters
              </Text>
            </View>

            {/* CAPTCHA Widget - For web platform only */}
            {Platform.OS === 'web' && (
              <View className="items-center my-4">
                <div 
                  id="clerk-captcha"
                  data-cl-theme="auto"
                  data-cl-size="normal"
                  style={{ width: '100%', minHeight: 65 }}
                />
              </View>
            )}

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={onSignUpPress}
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
                  <Text className="text-white font-bold text-lg ml-2">Creating Account...</Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-lg">Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600 text-base">Already have an account? </Text>
              <Link href="/(auth)/sign-in" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 font-semibold text-base">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}