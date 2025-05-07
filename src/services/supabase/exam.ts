
import { supabase } from './client';

// Exam-related functions
export const getExams = async () => {
  try {
    const { data, error } = await supabase
      .from('exams')
      .select('*');
    
    if (error) {
      console.error('Error fetching exams:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getExams:', error);
    return [];
  }
};

export const getYears = async () => {
  try {
    const { data, error } = await supabase
      .from('years')
      .select('*')
      .order('year', { ascending: false });
    
    if (error) {
      console.error('Error fetching years:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getYears:', error);
    return [];
  }
};

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
