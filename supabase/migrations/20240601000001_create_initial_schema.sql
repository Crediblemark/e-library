-- Create profiles table to store user profile information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  role TEXT DEFAULT 'reader',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_image TEXT,
  description TEXT,
  genres TEXT[] DEFAULT '{}',
  page_count INTEGER DEFAULT 0,
  published_date TEXT,
  publisher TEXT,
  rating DECIMAL(3,1) DEFAULT 0,
  status TEXT DEFAULT 'Available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create borrowed_books table
CREATE TABLE IF NOT EXISTS borrowed_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  book_id UUID REFERENCES books(id) NOT NULL,
  borrow_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  returned_date TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, book_id, borrow_date)
);

-- Create reading_history table
CREATE TABLE IF NOT EXISTS reading_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  book_id UUID REFERENCES books(id) NOT NULL,
  last_read_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, book_id)
);

-- Create reading_stats table
CREATE TABLE IF NOT EXISTS reading_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  books_read INTEGER DEFAULT 0,
  pages_read INTEGER DEFAULT 0,
  hours_read INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  date_earned TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  cover_image TEXT,
  description TEXT,
  genres TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'Draft',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'Draft',
  last_edited TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  word_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0
);

-- Create blocks table
CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID REFERENCES chapters(id) NOT NULL,
  type TEXT NOT NULL,
  content TEXT,
  checked BOOLEAN,
  image_url TEXT,
  position INTEGER NOT NULL
);

-- Create RLS policies

-- Profiles table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Books table policies
DROP POLICY IF EXISTS "Everyone can view books" ON books;
CREATE POLICY "Everyone can view books"
  ON books FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Librarians and admins can manage books" ON books;
CREATE POLICY "Librarians and admins can manage books"
  ON books FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'librarian' OR profiles.role = 'admin')
    )
  );

-- Borrowed books policies
DROP POLICY IF EXISTS "Users can view their borrowed books" ON borrowed_books;
CREATE POLICY "Users can view their borrowed books"
  ON borrowed_books FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Librarians and admins can manage borrowed books" ON borrowed_books;
CREATE POLICY "Librarians and admins can manage borrowed books"
  ON borrowed_books FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'librarian' OR profiles.role = 'admin')
    )
  );

-- Reading history policies
DROP POLICY IF EXISTS "Users can view their reading history" ON reading_history;
CREATE POLICY "Users can view their reading history"
  ON reading_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their reading history" ON reading_history;
CREATE POLICY "Users can update their reading history"
  ON reading_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their reading history" ON reading_history;
CREATE POLICY "Users can update their reading history"
  ON reading_history FOR UPDATE
  USING (auth.uid() = user_id);

-- Reading stats policies
DROP POLICY IF EXISTS "Users can view their reading stats" ON reading_stats;
CREATE POLICY "Users can view their reading stats"
  ON reading_stats FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their reading stats" ON reading_stats;
CREATE POLICY "Users can update their reading stats"
  ON reading_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Achievements policies
DROP POLICY IF EXISTS "Users can view their achievements" ON achievements;
CREATE POLICY "Users can view their achievements"
  ON achievements FOR SELECT
  USING (auth.uid() = user_id);

-- Projects policies
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view public projects" ON projects;
CREATE POLICY "Users can view public projects"
  ON projects FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS "Users can manage their own projects" ON projects;
CREATE POLICY "Users can manage their own projects"
  ON projects FOR ALL
  USING (auth.uid() = user_id);

-- Chapters policies
DROP POLICY IF EXISTS "Users can view chapters of their own projects" ON chapters;
CREATE POLICY "Users can view chapters of their own projects"
  ON chapters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = chapters.project_id
      AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view chapters of public projects" ON chapters;
CREATE POLICY "Users can view chapters of public projects"
  ON chapters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = chapters.project_id
      AND projects.is_public = true
    )
  );

DROP POLICY IF EXISTS "Users can manage chapters of their own projects" ON chapters;
CREATE POLICY "Users can manage chapters of their own projects"
  ON chapters FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = chapters.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Blocks policies
DROP POLICY IF EXISTS "Users can view blocks of their own chapters" ON blocks;
CREATE POLICY "Users can view blocks of their own chapters"
  ON blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chapters
      JOIN projects ON chapters.project_id = projects.id
      WHERE blocks.chapter_id = chapters.id
      AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view blocks of public chapters" ON blocks;
CREATE POLICY "Users can view blocks of public chapters"
  ON blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chapters
      JOIN projects ON chapters.project_id = projects.id
      WHERE blocks.chapter_id = chapters.id
      AND projects.is_public = true
    )
  );

DROP POLICY IF EXISTS "Users can manage blocks of their own chapters" ON blocks;
CREATE POLICY "Users can manage blocks of their own chapters"
  ON blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM chapters
      JOIN projects ON chapters.project_id = projects.id
      WHERE blocks.chapter_id = chapters.id
      AND projects.user_id = auth.uid()
    )
  );

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowed_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- Enable realtime subscriptions
alter publication supabase_realtime add table projects;
alter publication supabase_realtime add table chapters;
alter publication supabase_realtime add table blocks;
alter publication supabase_realtime add table books;
alter publication supabase_realtime add table borrowed_books;
alter publication supabase_realtime add table reading_history;
alter publication supabase_realtime add table reading_stats;
alter publication supabase_realtime add table achievements;

-- Create trigger to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'reader',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || split_part(NEW.email, '@', 1)
  );
  
  INSERT INTO public.reading_stats (user_id, books_read, pages_read, hours_read)
  VALUES (NEW.id, 0, 0, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
