import { supabase, handleSupabaseError } from '../lib/supabase';
import { User } from '../types';

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, userData: { name: string; bio?: string; avatar?: string }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            bio: userData.bio,
            avatar: userData.avatar
          }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Get current user profile
  async getCurrentUserProfile(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        avatar: profile.avatar || undefined,
        bio: profile.bio || undefined,
        joinedAt: profile.joined_at,
        isActive: profile.is_active
      };
    } catch (error) {
      console.error('Error getting current user profile:', error);
      return null;
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getCurrentUserProfile();
        callback(profile);
      } else {
        callback(null);
      }
    });
  }
};