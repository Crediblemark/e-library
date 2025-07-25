import { createClient } from "@supabase/supabase-js";
import { safeStorage } from '../utils/storage';
import { AppState } from 'react-native';
import { clerkService } from "./clerk";

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

console.log("Supabase URL available:", !!supabaseUrl);
console.log("Supabase Anon Key available:", !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials are missing. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables.",
  );
}

// Create standard Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Alternative Supabase client for Clerk third-party auth
export const createSupabaseWithClerk = (sessionToken: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    accessToken: async () => sessionToken,
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
};

// Legacy function for backward compatibility (deprecated)
export const createSupabaseWithAuth0 = (accessToken: string) => {
  console.warn('createSupabaseWithAuth0 is deprecated. Use createSupabaseWithClerk instead.');
  return createSupabaseWithClerk(accessToken);
};

// Setup AppState listener for auto-refresh
// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// Log Supabase initialization
console.log("Supabase client initialized with AppState auto-refresh");

// Authentication functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

// Database functions
export const fetchBooks = async () => {
  const { data, error } = await supabase.from("books").select("*");
  return { data, error };
};

export const fetchBook = async (id: string) => {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();
  return { data, error };
};

export const fetchUserProjects = async (userId: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId);
  return { data, error };
};

export const createProject = async (project: any) => {
  const { data, error } = await supabase
    .from("projects")
    .insert([project])
    .select();
  return { data, error };
};

export const updateProject = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select();
  return { data, error };
};

export const fetchChapters = async (projectId: string) => {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("project_id", projectId);
  return { data, error };
};

export const createChapter = async (chapter: any) => {
  const { data, error } = await supabase
    .from("chapters")
    .insert([chapter])
    .select();
  return { data, error };
};

export const updateChapter = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from("chapters")
    .update(updates)
    .eq("id", id)
    .select();
  return { data, error };
};
