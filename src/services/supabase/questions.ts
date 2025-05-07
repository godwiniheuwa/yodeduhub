
import { supabase } from './client';
import { Question } from './types';
import { setupExamTables } from './setupTables';

export const addQuestion = async (questionData: Partial<Question>) => {
  try {
    // Try to setup tables first
    await setupExamTables();
    
    // Generate a unique ID if not provided
    const questionWithId = {
      ...questionData,
      id: questionData.id || `question-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('questions')
      .insert([questionWithId])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding question:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addQuestion:', error);
    throw error;
  }
};

export const getQuestions = async (examId?: string, yearId?: string, subjectId?: string) => {
  try {
    // Try to setup tables first
    await setupExamTables();
    
    let query = supabase.from('questions').select('*');
    
    if (examId) {
      query = query.eq('exam_id', examId);
    }
    
    if (yearId) {
      query = query.eq('year_id', yearId);
    }
    
    if (subjectId) {
      query = query.eq('subject_id', subjectId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getQuestions:', error);
    return [];
  }
};
