import { supabase, handleSupabaseError } from '../lib/supabase';
import { BlogPost } from '../types';

export const postService = {
  // Get all published posts
  async getPublishedPosts(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            name,
            avatar
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      return data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        authorId: post.author_id,
        category: post.category,
        tags: post.tags,
        status: post.status as 'draft' | 'published' | 'archived',
        featuredImage: post.featured_image || undefined,
        publishedAt: post.published_at || undefined,
        scheduledAt: post.scheduled_at || undefined,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        viewCount: post.view_count,
        isFeature: post.is_feature
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  // Get posts by author
  async getPostsByAuthor(authorId: string): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', authorId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        authorId: post.author_id,
        category: post.category,
        tags: post.tags,
        status: post.status as 'draft' | 'published' | 'archived',
        featuredImage: post.featured_image || undefined,
        publishedAt: post.published_at || undefined,
        scheduledAt: post.scheduled_at || undefined,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        viewCount: post.view_count,
        isFeature: post.is_feature
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  // Get all posts (for admins/editors)
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        authorId: post.author_id,
        category: post.category,
        tags: post.tags,
        status: post.status as 'draft' | 'published' | 'archived',
        featuredImage: post.featured_image || undefined,
        publishedAt: post.published_at || undefined,
        scheduledAt: post.scheduled_at || undefined,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        viewCount: post.view_count,
        isFeature: post.is_feature
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  // Get post by ID
  async getPostById(id: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        slug: data.slug,
        authorId: data.author_id,
        category: data.category,
        tags: data.tags,
        status: data.status as 'draft' | 'published' | 'archived',
        featuredImage: data.featured_image || undefined,
        publishedAt: data.published_at || undefined,
        scheduledAt: data.scheduled_at || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        viewCount: data.view_count,
        isFeature: data.is_feature
      };
    } catch (error) {
      console.error('Error getting post:', error);
      return null;
    }
  },

  // Create new post
  async createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          slug: post.slug,
          author_id: post.authorId,
          category: post.category,
          tags: post.tags,
          status: post.status,
          featured_image: post.featuredImage,
          published_at: post.publishedAt,
          scheduled_at: post.scheduledAt,
          is_feature: post.isFeature
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        slug: data.slug,
        authorId: data.author_id,
        category: data.category,
        tags: data.tags,
        status: data.status as 'draft' | 'published' | 'archived',
        featuredImage: data.featured_image || undefined,
        publishedAt: data.published_at || undefined,
        scheduledAt: data.scheduled_at || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        viewCount: data.view_count,
        isFeature: data.is_feature
      };
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  },

  // Update post
  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          title: updates.title,
          content: updates.content,
          excerpt: updates.excerpt,
          slug: updates.slug,
          category: updates.category,
          tags: updates.tags,
          status: updates.status,
          featured_image: updates.featuredImage,
          published_at: updates.publishedAt,
          scheduled_at: updates.scheduledAt,
          is_feature: updates.isFeature
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        slug: data.slug,
        authorId: data.author_id,
        category: data.category,
        tags: data.tags,
        status: data.status as 'draft' | 'published' | 'archived',
        featuredImage: data.featured_image || undefined,
        publishedAt: data.published_at || undefined,
        scheduledAt: data.scheduled_at || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        viewCount: data.view_count,
        isFeature: data.is_feature
      };
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  },

  // Delete post
  async deletePost(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  },

  // Increment view count
  async incrementViewCount(id: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_view_count', { post_id: id });
      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }
};