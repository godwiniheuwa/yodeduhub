
import { supabase } from '../client';

// Create years table
export const createYearsTable = async () => {
  try {
    const { data, error } = await supabase
      .from('years')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('Creating years table...');
      const { error: createError } = await supabase.rpc('create_years_table');
      
      if (createError) {
        console.error('Error creating years table:', createError);
        return false;
      }
      
      console.log('Years table created successfully');
      return true;
    } else if (error) {
      console.error('Error checking years table:', error);
      return false;
    } else {
      console.log('Years table already exists');
      return true;
    }
  } catch (error) {
    console.error('Error in createYearsTable:', error);
    return false;
  }
};

// Create subjects table
export const createSubjectsTable = async () => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('Creating subjects table...');
      const { error: createError } = await supabase.rpc('create_subjects_table');
      
      if (createError) {
        console.error('Error creating subjects table:', createError);
        return false;
      }
      
      console.log('Subjects table created successfully');
      return true;
    } else if (error) {
      console.error('Error checking subjects table:', error);
      return false;
    } else {
      console.log('Subjects table already exists');
      return true;
    }
  } catch (error) {
    console.error('Error in createSubjectsTable:', error);
    return false;
  }
};

// Create exams table
export const createExamsTable = async () => {
  try {
    const { data, error } = await supabase
      .from('exams')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('Creating exams table...');
      const { error: createError } = await supabase.rpc('create_exams_table');
      
      if (createError) {
        console.error('Error creating exams table:', createError);
        return false;
      }
      
      console.log('Exams table created successfully');
      return true;
    } else if (error) {
      console.error('Error checking exams table:', error);
      return false;
    } else {
      console.log('Exams table already exists');
      return true;
    }
  } catch (error) {
    console.error('Error in createExamsTable:', error);
    return false;
  }
};

// Create questions table
export const createQuestionsTable = async () => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('Creating questions table...');
      const { error: createError } = await supabase.rpc('create_questions_table');
      
      if (createError) {
        console.error('Error creating questions table:', createError);
        return false;
      }
      
      console.log('Questions table created successfully');
      return true;
    } else if (error) {
      console.error('Error checking questions table:', error);
      return false;
    } else {
      console.log('Questions table already exists');
      return true;
    }
  } catch (error) {
    console.error('Error in createQuestionsTable:', error);
    return false;
  }
};
