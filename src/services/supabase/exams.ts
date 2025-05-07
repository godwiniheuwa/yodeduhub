
import { supabase } from './client';
import { Exam } from './types';
import { setupExamTables } from './setupTables';

// Exam-related functions
export const getExams = async () => {
  try {
    await setupExamTables();
    
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

export const getExamById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching exam ${id}:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in getExamById for ${id}:`, error);
    return null;
  }
};

export const createExam = async (examData: Partial<Exam>) => {
  try {
    // Generate a unique ID if not provided
    const examWithId = {
      ...examData,
      id: examData.id || `exam-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('exams')
      .insert([examWithId])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createExam:', error);
    throw error;
  }
};

export const updateExam = async (id: string, examData: Partial<Exam>) => {
  try {
    const { data, error } = await supabase
      .from('exams')
      .update(examData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating exam ${id}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in updateExam for ${id}:`, error);
    throw error;
  }
};

export const deleteExam = async (id: string) => {
  try {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting exam ${id}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in deleteExam for ${id}:`, error);
    throw error;
  }
};
