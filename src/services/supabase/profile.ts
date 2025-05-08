
import { supabase } from './client';
import { User } from './types';

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    console.log('Updating user profile for:', userId, updates);
    
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
    
    console.log('User profile updated successfully');
    return data as User;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    console.log('Fetching user by ID:', id);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
    
    console.log('User retrieved successfully');
    return data as User;
  } catch (error) {
    console.error('Error in getUserById:', error);
    return null;
  }
};
