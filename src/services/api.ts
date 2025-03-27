import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, UserRole, getCurrentUser } from "../utils/auth";

// Types for our data models
export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  genres: string[];
  pageCount: number;
  publishedDate: string;
  publisher: string;
  rating: number;
  status: "Available" | "Borrowed";
}

export interface BorrowedBook extends Book {
  borrowDate: string;
  dueDate: string;
}

export interface ReadingHistory {
  bookId: string;
  bookTitle: string;
  coverImage: string;
  lastReadDate: string;
  progress: number; // 0-100
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string;
  progress: number; // 0-100
  isCompleted: boolean;
}

export interface ReadingStats {
  booksRead: number;
  pagesRead: number;
  hoursRead: number;
}

export interface Project {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  genres: string[];
  status: "Draft" | "In Progress" | "Published";
  views: number;
  likes: number;
  comments: number;
  isPublic: boolean;
  createdAt: string;
  lastUpdated: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  projectId: string;
  title: string;
  blocks: Block[];
  status: "Draft" | "Published";
  lastEdited: string;
  wordCount: number;
  views?: number;
  likes?: number;
  comments?: number;
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean; // For todo blocks
  imageUrl?: string; // For image blocks
}

export type BlockType =
  | "paragraph"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "bulleted-list"
  | "numbered-list"
  | "quote"
  | "code"
  | "image"
  | "todo";

// Mock data storage (in a real app, this would be API calls)
const STORAGE_KEYS = {
  BORROWED_BOOKS: "borrowed_books",
  READING_HISTORY: "reading_history",
  ACHIEVEMENTS: "achievements",
  READING_STATS: "reading_stats",
  PROJECTS: "projects",
  CHAPTERS: "chapters",
};

// Initialize with some data if none exists
const initializeData = async () => {
  const user = await getCurrentUser();
  if (!user) return;

  // Check if we already have data
  const hasData = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS);
  if (hasData) return;

  // Sample projects based on user role
  let sampleProjects: Project[] = [];

  if (
    user.role === UserRole.READER ||
    user.role === UserRole.LIBRARIAN ||
    user.role === UserRole.ADMIN
  ) {
    sampleProjects = [
      {
        id: "1",
        title: "The Hidden World",
        coverImage:
          "https://images.unsplash.com/photo-1518744386442-2d48ac47a7eb?w=400&q=80",
        description: "A fantasy novel about a hidden world beneath our own.",
        genres: ["Fantasy", "Adventure", "Young Adult"],
        status: "In Progress",
        views: 245,
        likes: 32,
        comments: 8,
        isPublic: true,
        createdAt: "2023-10-15",
        lastUpdated: "2023-11-02",
        chapters: [
          {
            id: "1-1",
            projectId: "1",
            title: "The Discovery",
            wordCount: 2450,
            lastEdited: "2023-11-02",
            status: "Published",
            views: 120,
            likes: 18,
            comments: 5,
            blocks: [
              {
                id: "b1",
                type: "paragraph",
                content:
                  "It all began on a rainy Tuesday afternoon. The kind of rain that doesn't pour but persists, a constant drizzle that soaks through everything eventually. I was in the basement of my grandmother's old house, sorting through decades of accumulated memories after her passing.",
              },
              {
                id: "b2",
                type: "paragraph",
                content:
                  "The house itself was a relic, built in the early 1900s with all the character and quirks you'd expect. Creaking floorboards that announced your presence no matter how carefully you stepped. Doors that would swing open or closed seemingly of their own accord. Windows that whistled when the wind blew from the east.",
              },
              {
                id: "b3",
                type: "heading-2",
                content: "The Basement",
              },
              {
                id: "b4",
                type: "paragraph",
                content:
                  "But it was the basement that always fascinated me as a child. Forbidden territory, of course, which only added to its mystique. Now, as an adult tasked with clearing out the house before it was sold, I finally had free reign to explore its secrets.",
              },
            ],
          },
          {
            id: "1-2",
            projectId: "1",
            title: "The Entrance",
            wordCount: 1890,
            lastEdited: "2023-11-01",
            status: "Published",
            views: 95,
            likes: 12,
            comments: 3,
            blocks: [
              {
                id: "b1",
                type: "paragraph",
                content:
                  "The flashlight beam cut through the darkness, revealing stone steps descending steeply into the earth. They were worn in the middle, suggesting countless feet had traversed them over the years.",
              },
              {
                id: "b2",
                type: "heading-2",
                content: "The Descent",
              },
              {
                id: "b3",
                type: "paragraph",
                content:
                  "As I descended, the temperature dropped noticeably. By the time I reached the bottom – some thirty steps down – I could see my breath forming small clouds in the beam of light.",
              },
            ],
          },
        ],
      },
    ];
  }

  // Sample borrowed books
  const sampleBorrowedBooks: BorrowedBook[] = [
    {
      id: "b1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverImage:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
      description:
        "A novel about the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
      genres: ["Classic", "Fiction"],
      pageCount: 180,
      publishedDate: "1925-04-10",
      publisher: "Charles Scribner's Sons",
      rating: 4.5,
      status: "Borrowed",
      borrowDate: "2023-10-15",
      dueDate: "2023-11-15",
    },
    {
      id: "b2",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      coverImage:
        "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&q=80",
      description:
        "The story of racial injustice and the destruction of innocence in a small Southern town during the Depression.",
      genres: ["Classic", "Fiction"],
      pageCount: 281,
      publishedDate: "1960-07-11",
      publisher: "J. B. Lippincott & Co.",
      rating: 4.8,
      status: "Borrowed",
      borrowDate: "2023-10-20",
      dueDate: "2023-11-20",
    },
  ];

  // Sample reading history
  const sampleReadingHistory: ReadingHistory[] = [
    {
      bookId: "h1",
      bookTitle: "1984",
      coverImage:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80",
      lastReadDate: "2023-10-01",
      progress: 100,
    },
    {
      bookId: "h2",
      bookTitle: "Pride and Prejudice",
      coverImage:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
      lastReadDate: "2023-09-15",
      progress: 100,
    },
    {
      bookId: "h3",
      bookTitle: "The Hobbit",
      coverImage:
        "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=400&q=80",
      lastReadDate: "2023-08-20",
      progress: 100,
    },
  ];

  // Sample achievements
  const sampleAchievements: Achievement[] = [
    {
      id: "a1",
      title: "Bookworm",
      description: "Read 5 books",
      icon: "📚",
      dateEarned: "2023-09-15",
      progress: 100,
      isCompleted: true,
    },
    {
      id: "a2",
      title: "Speed Reader",
      description: "Finish a book in less than 3 days",
      icon: "⚡",
      dateEarned: "2023-10-01",
      progress: 100,
      isCompleted: true,
    },
    {
      id: "a3",
      title: "Genre Explorer",
      description: "Read books from 5 different genres",
      icon: "🧭",
      dateEarned: "",
      progress: 60,
      isCompleted: false,
    },
  ];

  // Sample reading stats
  const sampleReadingStats: ReadingStats = {
    booksRead: 8,
    pagesRead: 2156,
    hoursRead: 72,
  };

  // Store the sample data
  await AsyncStorage.setItem(
    STORAGE_KEYS.PROJECTS,
    JSON.stringify(sampleProjects),
  );
  await AsyncStorage.setItem(
    STORAGE_KEYS.BORROWED_BOOKS,
    JSON.stringify(sampleBorrowedBooks),
  );
  await AsyncStorage.setItem(
    STORAGE_KEYS.READING_HISTORY,
    JSON.stringify(sampleReadingHistory),
  );
  await AsyncStorage.setItem(
    STORAGE_KEYS.ACHIEVEMENTS,
    JSON.stringify(sampleAchievements),
  );
  await AsyncStorage.setItem(
    STORAGE_KEYS.READING_STATS,
    JSON.stringify(sampleReadingStats),
  );
};

// API functions
export const getProjects = async (): Promise<Project[]> => {
  await initializeData();
  const projectsJson = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS);
  return projectsJson ? JSON.parse(projectsJson) : [];
};

export const getProject = async (id: string): Promise<Project | null> => {
  const projects = await getProjects();
  return projects.find((project) => project.id === id) || null;
};

export const getChapter = async (
  projectId: string,
  chapterId: string,
): Promise<Chapter | null> => {
  const project = await getProject(projectId);
  if (!project) return null;

  return project.chapters.find((chapter) => chapter.id === chapterId) || null;
};

export const saveChapter = async (chapter: Chapter): Promise<boolean> => {
  try {
    const projects = await getProjects();
    const projectIndex = projects.findIndex((p) => p.id === chapter.projectId);

    if (projectIndex === -1) return false;

    const chapterIndex = projects[projectIndex].chapters.findIndex(
      (c) => c.id === chapter.id,
    );

    if (chapterIndex === -1) {
      // New chapter
      projects[projectIndex].chapters.push(chapter);
    } else {
      // Update existing chapter
      projects[projectIndex].chapters[chapterIndex] = chapter;
    }

    // Update last updated date
    projects[projectIndex].lastUpdated = new Date().toISOString().split("T")[0];

    await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return true;
  } catch (error) {
    console.error("Error saving chapter:", error);
    return false;
  }
};

export const getBorrowedBooks = async (): Promise<BorrowedBook[]> => {
  await initializeData();
  const booksJson = await AsyncStorage.getItem(STORAGE_KEYS.BORROWED_BOOKS);
  return booksJson ? JSON.parse(booksJson) : [];
};

export const getReadingHistory = async (): Promise<ReadingHistory[]> => {
  await initializeData();
  const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.READING_HISTORY);
  return historyJson ? JSON.parse(historyJson) : [];
};

export const getAchievements = async (): Promise<Achievement[]> => {
  await initializeData();
  const achievementsJson = await AsyncStorage.getItem(
    STORAGE_KEYS.ACHIEVEMENTS,
  );
  return achievementsJson ? JSON.parse(achievementsJson) : [];
};

export const getReadingStats = async (): Promise<ReadingStats> => {
  await initializeData();
  const statsJson = await AsyncStorage.getItem(STORAGE_KEYS.READING_STATS);
  return statsJson
    ? JSON.parse(statsJson)
    : { booksRead: 0, pagesRead: 0, hoursRead: 0 };
};

// Initialize data when the app starts
initializeData();
