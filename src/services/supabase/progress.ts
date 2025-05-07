
import { supabase } from './client';
import { UserProgress } from './types';

export const getUserProgress = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        subjects:subject_id (name)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data as UserProgress[];
  } catch (error) {
    console.error('Error in getUserProgress:', error);
    return [];
  }
};

export const updateUserProgress = async (
  userId: string, 
  subjectId: string, 
  progressData: Partial<UserProgress>
) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        subject_id: subjectId,
        ...progressData,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as UserProgress;
  } catch (error) {
    console.error('Error in updateUserProgress:', error);
    throw error;
  }
};
