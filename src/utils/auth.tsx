import AsyncStorage from "@react-native-async-storage/async-storage";

// User roles
export enum UserRole {
  READER = "reader",
  LIBRARIAN = "librarian",
  ADMIN = "admin",
}

// User interface
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: "1",
    username: "student1",
    password: "password123",
    email: "student1@school.edu",
    role: UserRole.READER,
    name: "Alex Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    id: "2",
    username: "librarian1",
    password: "password123",
    email: "librarian@school.edu",
    role: UserRole.LIBRARIAN,
    name: "Jamie Librarian",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
  },
  {
    id: "3",
    username: "admin",
    password: "admin123",
    email: "admin@school.edu",
    role: UserRole.ADMIN,
    name: "Sam Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
  },
];

// Authentication functions
export const login = async (
  username: string,
  password: string,
): Promise<User | null> => {
  // In a real app, this would be an API call
  const user = MOCK_USERS.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    const { password, ...userWithoutPassword } = user;
    await AsyncStorage.setItem("user", JSON.stringify(userWithoutPassword));
    return userWithoutPassword as User;
  }

  return null;
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem("user");
};

export const getCurrentUser = async (): Promise<User | null> => {
  const userJson = await AsyncStorage.getItem("user");
  if (userJson) {
    return JSON.parse(userJson) as User;
  }
  return null;
};

export const hasPermission = (
  requiredRole: UserRole,
  userRole: UserRole,
): boolean => {
  // Role hierarchy: ADMIN > LIBRARIAN > READER
  if (userRole === UserRole.ADMIN) return true;
  if (userRole === UserRole.LIBRARIAN && requiredRole !== UserRole.ADMIN)
    return true;
  if (userRole === UserRole.READER && requiredRole === UserRole.READER)
    return true;
  return false;
};
