export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          date_earned: string | null
          description: string | null
          icon: string | null
          id: string
          is_completed: boolean | null
          progress: number | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_earned?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_earned?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      blocks: {
        Row: {
          chapter_id: string
          checked: boolean | null
          content: string | null
          id: string
          image_url: string | null
          position: number
          type: string
        }
        Insert: {
          chapter_id: string
          checked?: boolean | null
          content?: string | null
          id?: string
          image_url?: string | null
          position: number
          type: string
        }
        Update: {
          chapter_id?: string
          checked?: boolean | null
          content?: string | null
          id?: string
          image_url?: string | null
          position?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          cover_image: string | null
          created_at: string | null
          description: string | null
          genres: string[] | null
          id: string
          page_count: number | null
          published_date: string | null
          publisher: string | null
          rating: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          genres?: string[] | null
          id?: string
          page_count?: number | null
          published_date?: string | null
          publisher?: string | null
          rating?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          genres?: string[] | null
          id?: string
          page_count?: number | null
          published_date?: string | null
          publisher?: string | null
          rating?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      borrowed_books: {
        Row: {
          book_id: string
          borrow_date: string | null
          due_date: string
          id: string
          returned_date: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          borrow_date?: string | null
          due_date: string
          id?: string
          returned_date?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          borrow_date?: string | null
          due_date?: string
          id?: string
          returned_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "borrowed_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          comments: number | null
          id: string
          last_edited: string | null
          likes: number | null
          project_id: string
          status: string | null
          title: string
          views: number | null
          word_count: number | null
        }
        Insert: {
          comments?: number | null
          id?: string
          last_edited?: string | null
          likes?: number | null
          project_id: string
          status?: string | null
          title: string
          views?: number | null
          word_count?: number | null
        }
        Update: {
          comments?: number | null
          id?: string
          last_edited?: string | null
          likes?: number | null
          project_id?: string
          status?: string | null
          title?: string
          views?: number | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          comments: number | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          genres: string[] | null
          id: string
          is_public: boolean | null
          last_updated: string | null
          likes: number | null
          status: string | null
          title: string
          user_id: string
          views: number | null
        }
        Insert: {
          comments?: number | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          genres?: string[] | null
          id?: string
          is_public?: boolean | null
          last_updated?: string | null
          likes?: number | null
          status?: string | null
          title: string
          user_id: string
          views?: number | null
        }
        Update: {
          comments?: number | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          genres?: string[] | null
          id?: string
          is_public?: boolean | null
          last_updated?: string | null
          likes?: number | null
          status?: string | null
          title?: string
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      reading_history: {
        Row: {
          book_id: string
          id: string
          last_read_date: string | null
          progress: number | null
          user_id: string
        }
        Insert: {
          book_id: string
          id?: string
          last_read_date?: string | null
          progress?: number | null
          user_id: string
        }
        Update: {
          book_id?: string
          id?: string
          last_read_date?: string | null
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_history_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_stats: {
        Row: {
          books_read: number | null
          hours_read: number | null
          id: string
          pages_read: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          books_read?: number | null
          hours_read?: number | null
          id?: string
          pages_read?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          books_read?: number | null
          hours_read?: number | null
          id?: string
          pages_read?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
