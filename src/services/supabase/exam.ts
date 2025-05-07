
import { supabase } from './client';
import { Exam, Year, Subject, Question } from './types';

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

export const addQuestion = async (questionData: Partial<Question>) => {
  try {
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

export const addYear = async (year: number) => {
  try {
    const yearData = {
      id: `year-${year}`,
      year: year,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('years')
      .insert([yearData])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding year:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addYear:', error);
    throw error;
  }
};

export const addSubject = async (name: string) => {
  try {
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
