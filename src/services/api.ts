import { UserRole } from "../utils/auth";
import { supabase } from "./supabase";

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

// API functions using Supabase
export const getProjects = async (): Promise<Project[]> => {
  try {
    const { data: projectsData, error: projectsError } = await supabase
      .from("projects")
      .select("*");

    if (projectsError) {
      console.error("Error fetching projects:", projectsError);
      return [];
    }

    // For each project, fetch its chapters
    const projectsWithChapters = await Promise.all(
      projectsData.map(async (project) => {
        const { data: chaptersData, error: chaptersError } = await supabase
          .from("chapters")
          .select("*")
          .eq("project_id", project.id);

        if (chaptersError) {
          console.error(
            `Error fetching chapters for project ${project.id}:`,
            chaptersError,
          );
          return { ...project, chapters: [] };
        }

        // For each chapter, fetch its blocks
        const chaptersWithBlocks = await Promise.all(
          chaptersData.map(async (chapter) => {
            const { data: blocksData, error: blocksError } = await supabase
              .from("blocks")
              .select("*")
              .eq("chapter_id", chapter.id)
              .order("position", { ascending: true });

            if (blocksError) {
              console.error(
                `Error fetching blocks for chapter ${chapter.id}:`,
                blocksError,
              );
              return { ...chapter, blocks: [] };
            }

            // Transform from database format to application format
            return {
              id: chapter.id,
              projectId: chapter.project_id,
              title: chapter.title,
              status: chapter.status,
              lastEdited: chapter.last_edited,
              wordCount: chapter.word_count,
              views: chapter.views,
              likes: chapter.likes,
              comments: chapter.comments,
              blocks: blocksData.map((block) => ({
                id: block.id,
                type: block.type as BlockType,
                content: block.content,
                checked: block.checked,
                imageUrl: block.image_url,
              })),
            };
          }),
        );

        // Transform from database format to application format
        return {
          id: project.id,
          title: project.title,
          coverImage: project.cover_image,
          description: project.description,
          genres: project.genres,
          status: project.status,
          views: project.views,
          likes: project.likes,
          comments: project.comments,
          isPublic: project.is_public,
          createdAt: project.created_at,
          lastUpdated: project.last_updated,
          chapters: chaptersWithBlocks,
        };
      }),
    );

    return projectsWithChapters;
  } catch (error) {
    console.error("Error in getProjects:", error);
    return [];
  }
};

export const getProject = async (id: string): Promise<Project | null> => {
  try {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (projectError) {
      console.error(`Error fetching project ${id}:`, projectError);
      return null;
    }

    // Fetch chapters for this project
    const { data: chaptersData, error: chaptersError } = await supabase
      .from("chapters")
      .select("*")
      .eq("project_id", id);

    if (chaptersError) {
      console.error(
        `Error fetching chapters for project ${id}:`,
        chaptersError,
      );
      return { ...project, chapters: [] };
    }

    // For each chapter, fetch its blocks
    const chaptersWithBlocks = await Promise.all(
      chaptersData.map(async (chapter) => {
        const { data: blocksData, error: blocksError } = await supabase
          .from("blocks")
          .select("*")
          .eq("chapter_id", chapter.id)
          .order("position", { ascending: true });

        if (blocksError) {
          console.error(
            `Error fetching blocks for chapter ${chapter.id}:`,
            blocksError,
          );
          return { ...chapter, blocks: [] };
        }

        // Transform from database format to application format
        return {
          id: chapter.id,
          projectId: chapter.project_id,
          title: chapter.title,
          status: chapter.status,
          lastEdited: chapter.last_edited,
          wordCount: chapter.word_count,
          views: chapter.views,
          likes: chapter.likes,
          comments: chapter.comments,
          blocks: blocksData.map((block) => ({
            id: block.id,
            type: block.type as BlockType,
            content: block.content,
            checked: block.checked,
            imageUrl: block.image_url,
          })),
        };
      }),
    );

    // Transform from database format to application format
    return {
      id: project.id,
      title: project.title,
      coverImage: project.cover_image,
      description: project.description,
      genres: project.genres,
      status: project.status,
      views: project.views,
      likes: project.likes,
      comments: project.comments,
      isPublic: project.is_public,
      createdAt: project.created_at,
      lastUpdated: project.last_updated,
      chapters: chaptersWithBlocks,
    };
  } catch (error) {
    console.error(`Error in getProject for id ${id}:`, error);
    return null;
  }
};

export const getChapter = async (
  projectId: string,
  chapterId: string,
): Promise<Chapter | null> => {
  try {
    const { data: chapter, error: chapterError } = await supabase
      .from("chapters")
      .select("*")
      .eq("id", chapterId)
      .eq("project_id", projectId)
      .single();

    if (chapterError) {
      console.error(`Error fetching chapter ${chapterId}:`, chapterError);
      return null;
    }

    // Fetch blocks for this chapter
    const { data: blocksData, error: blocksError } = await supabase
      .from("blocks")
      .select("*")
      .eq("chapter_id", chapterId)
      .order("position", { ascending: true });

    if (blocksError) {
      console.error(
        `Error fetching blocks for chapter ${chapterId}:`,
        blocksError,
      );
      return { ...chapter, blocks: [] };
    }

    // Transform from database format to application format
    return {
      id: chapter.id,
      projectId: chapter.project_id,
      title: chapter.title,
      status: chapter.status,
      lastEdited: chapter.last_edited,
      wordCount: chapter.word_count,
      views: chapter.views,
      likes: chapter.likes,
      comments: chapter.comments,
      blocks: blocksData.map((block) => ({
        id: block.id,
        type: block.type as BlockType,
        content: block.content,
        checked: block.checked,
        imageUrl: block.image_url,
      })),
    };
  } catch (error) {
    console.error(`Error in getChapter for id ${chapterId}:`, error);
    return null;
  }
};

export const saveChapter = async (chapter: Chapter): Promise<boolean> => {
  try {
    // First, update the chapter metadata
    const { error: chapterError } = await supabase.from("chapters").upsert({
      id: chapter.id,
      project_id: chapter.projectId,
      title: chapter.title,
      status: chapter.status,
      last_edited: new Date().toISOString(),
      word_count: chapter.wordCount,
      views: chapter.views || 0,
      likes: chapter.likes || 0,
      comments: chapter.comments || 0,
    });

    if (chapterError) {
      console.error(`Error saving chapter ${chapter.id}:`, chapterError);
      return false;
    }

    // Then, update all blocks
    // First, delete existing blocks for this chapter
    const { error: deleteError } = await supabase
      .from("blocks")
      .delete()
      .eq("chapter_id", chapter.id);

    if (deleteError) {
      console.error(
        `Error deleting blocks for chapter ${chapter.id}:`,
        deleteError,
      );
      return false;
    }

    // Then, insert new blocks
    const blocksToInsert = chapter.blocks.map((block, index) => ({
      id: block.id,
      chapter_id: chapter.id,
      type: block.type,
      content: block.content,
      checked: block.checked,
      image_url: block.imageUrl,
      position: index,
    }));

    const { error: insertError } = await supabase
      .from("blocks")
      .insert(blocksToInsert);

    if (insertError) {
      console.error(
        `Error inserting blocks for chapter ${chapter.id}:`,
        insertError,
      );
      return false;
    }

    // Update the project's last_updated field
    const { error: projectError } = await supabase
      .from("projects")
      .update({ last_updated: new Date().toISOString() })
      .eq("id", chapter.projectId);

    if (projectError) {
      console.error(
        `Error updating project ${chapter.projectId}:`,
        projectError,
      );
      // Not returning false here as the chapter was saved successfully
    }

    return true;
  } catch (error) {
    console.error(`Error in saveChapter for id ${chapter.id}:`, error);
    return false;
  }
};

export const getBorrowedBooks = async (): Promise<BorrowedBook[]> => {
  try {
    const { data: borrowedBooks, error } = await supabase.from("borrowed_books")
      .select(`
        *,
        books:book_id(*)
      `);

    if (error) {
      console.error("Error fetching borrowed books:", error);
      return [];
    }

    // Transform from database format to application format
    return borrowedBooks.map((item) => ({
      id: item.books.id,
      title: item.books.title,
      author: item.books.author,
      coverImage: item.books.cover_image,
      description: item.books.description,
      genres: item.books.genres,
      pageCount: item.books.page_count,
      publishedDate: item.books.published_date,
      publisher: item.books.publisher,
      rating: item.books.rating,
      status: "Borrowed",
      borrowDate: item.borrow_date,
      dueDate: item.due_date,
    }));
  } catch (error) {
    console.error("Error in getBorrowedBooks:", error);
    return [];
  }
};

export const getReadingHistory = async (): Promise<ReadingHistory[]> => {
  try {
    const { data: readingHistory, error } = await supabase.from(
      "reading_history",
    ).select(`
        *,
        books:book_id(*)
      `);

    if (error) {
      console.error("Error fetching reading history:", error);
      return [];
    }

    // Transform from database format to application format
    return readingHistory.map((item) => ({
      bookId: item.book_id,
      bookTitle: item.books.title,
      coverImage: item.books.cover_image,
      lastReadDate: item.last_read_date,
      progress: item.progress,
    }));
  } catch (error) {
    console.error("Error in getReadingHistory:", error);
    return [];
  }
};

export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const { data: achievements, error } = await supabase
      .from("achievements")
      .select("*");

    if (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }

    // Transform from database format to application format
    return achievements.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: item.icon,
      dateEarned: item.date_earned || "",
      progress: item.progress,
      isCompleted: item.is_completed,
    }));
  } catch (error) {
    console.error("Error in getAchievements:", error);
    return [];
  }
};

export const getReadingStats = async (): Promise<ReadingStats> => {
  try {
    const { data: stats, error } = await supabase
      .from("reading_stats")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching reading stats:", error);
      return { booksRead: 0, pagesRead: 0, hoursRead: 0 };
    }

    // Transform from database format to application format
    return {
      booksRead: stats.books_read,
      pagesRead: stats.pages_read,
      hoursRead: stats.hours_read,
    };
  } catch (error) {
    console.error("Error in getReadingStats:", error);
    return { booksRead: 0, pagesRead: 0, hoursRead: 0 };
  }
};
