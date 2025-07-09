import { supabase, handleSupabaseError } from '../lib/supabase';
import { User } from '../types';

export const profileService = {
  // Get all profiles
  async getAllProfiles(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(profile => ({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        avatar: profile.avatar || undefined,
        bio: profile.bio || undefined,
        joinedAt: profile.joined_at,
        isActive: profile.is_active
      }));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  },

  // Get profile by ID
  async getProfileById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        avatar: data.avatar || undefined,
        bio: data.bio || undefined,
        joinedAt: data.joined_at,
        isActive: data.is_active
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },

  // Update profile
  async updateProfile(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          bio: updates.bio,
          avatar: updates.avatar,
          role: updates.role,
          is_active: updates.isActive
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        avatar: data.avatar || undefined,
        bio: data.bio || undefined,
        joinedAt: data.joined_at,
        isActive: data.is_active
      };
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  },

  // Delete profile
  async deleteProfile(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  }
};