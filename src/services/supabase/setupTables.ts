
import { supabase } from './client';

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
