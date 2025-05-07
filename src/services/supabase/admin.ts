
import { supabase } from './client';
import { User } from './types';

// Admin-specific user functions
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as User[];
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return [];
  }
};
