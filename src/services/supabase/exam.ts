
import { supabase } from './client';
import { Exam, Year, Subject, Question } from './types';

// Setup tables if they don't exist
export const setupExamTables = async () => {
  try {
    // Check if years table exists
    const { error: yearsCheckError } = await supabase.rpc('check_table_exists', {
      table_name: 'years'
    });

    // If there's an error, we need to create the table
    if (yearsCheckError) {
      console.log('Creating years table...');
      await supabase.rpc('create_years_table');
    }

    // Check if subjects table exists
    const { error: subjectsCheckError } = await supabase.rpc('check_table_exists', {
      table_name: 'subjects'
    });

    // If there's an error, we need to create the table
    if (subjectsCheckError) {
      console.log('Creating subjects table...');
      await supabase.rpc('create_subjects_table');
    }

    // Check if exams table exists
    const { error: examsCheckError } = await supabase.rpc('check_table_exists', {
      table_name: 'exams'
    });

    // If there's an error, we need to create the table
    if (examsCheckError) {
      console.log('Creating exams table...');
      await supabase.rpc('create_exams_table');
    }

    // Check if questions table exists
    const { error: questionsCheckError } = await supabase.rpc('check_table_exists', {
      table_name: 'questions'
    });

    // If there's an error, we need to create the table
    if (questionsCheckError) {
      console.log('Creating questions table...');
      await supabase.rpc('create_questions_table');
    }

    return true;
  } catch (error) {
    console.error('Error setting up exam tables:', error);
    return false;
  }
};

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

export const getYears = async () => {
  try {
    // Try to setup tables first
    await setupExamTables();
    
    // Now try to get years
    const { data, error } = await supabase
      .from('years')
      .select('*')
      .order('year', { ascending: false });
    
    if (error) {
      console.error('Error fetching years:', error);
      // If table doesn't exist or other error, return empty array
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

export const addYear = async (year: number) => {
  try {
    // Try to setup tables first
    await setupExamTables();
    
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
