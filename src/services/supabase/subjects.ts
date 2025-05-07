
import { supabase } from './client';
import { setupExamTables } from './setupTables';

export const getSubjects = async () => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*');
    
    if (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getSubjects:', error);
    return [];
  }
};

export const addSubject = async (name: string) => {
  try {
    // Try to setup tables first
    await setupExamTables();
    
    const subjectData = {
      id: `subject-${Date.now()}`,
      name: name,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('subjects')
      .insert([subjectData])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding subject:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addSubject:', error);
    throw error;
  }
};
