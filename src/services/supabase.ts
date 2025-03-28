import { createClient } from "@supabase/supabase-js";

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

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Log Supabase initialization
console.log("Supabase client initialized");

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
