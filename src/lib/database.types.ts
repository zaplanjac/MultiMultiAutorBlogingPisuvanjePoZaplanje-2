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
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'super_admin' | 'editor' | 'author' | 'reader'
          avatar: string | null
          bio: string | null
          joined_at: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'super_admin' | 'editor' | 'author' | 'reader'
          avatar?: string | null
          bio?: string | null
          joined_at?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'super_admin' | 'editor' | 'author' | 'reader'
          avatar?: string | null
          bio?: string | null
          joined_at?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string
          slug: string
          author_id: string
          category: string
          tags: string[]
          status: 'draft' | 'published' | 'archived'
          featured_image: string | null
          published_at: string | null
          scheduled_at: string | null
          view_count: number
          is_feature: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt: string
          slug: string
          author_id: string
          category?: string
          tags?: string[]
          status?: 'draft' | 'published' | 'archived'
          featured_image?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          view_count?: number
          is_feature?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string
          slug?: string
          author_id?: string
          category?: string
          tags?: string[]
          status?: 'draft' | 'published' | 'archived'
          featured_image?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          view_count?: number
          is_feature?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'super_admin' | 'editor' | 'author' | 'reader'
      post_status: 'draft' | 'published' | 'archived'
    }
  }
}