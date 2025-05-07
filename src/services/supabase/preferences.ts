
import { supabase } from './client';
import { UserPreferences } from './types';

export const getUserPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return data as UserPreferences;
  } catch (error) {
    console.error('Error in getUserPreferences:', error);
    return null;
  }
};

export const updateUserPreferences = async (userId: string, preferences: Partial<UserPreferences>) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as UserPreferences;
  } catch (error) {
    console.error('Error in updateUserPreferences:', error);
    throw error;
  }
};
