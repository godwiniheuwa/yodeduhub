
import { supabase } from '../client';

// Function to check if database is ready with all required tables
export const isDatabaseReady = async () => {
  try {
    // Check if users table exists and has records
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError && usersError.code === '42P01') {
      return false; // Table doesn't exist
    }
    
    return true; // Database appears to be ready
  } catch (error) {
    console.error('Error checking database readiness:', error);
    return false;
  }
};

// Function to check the status of all required tables
export const getDbStatus = async () => {
  try {
    // Check each table's existence
    const tables = [
      { name: 'users', variable: 'usersTableExists' },
      { name: 'user_preferences', variable: 'preferencesTableExists' },
      { name: 'user_progress', variable: 'progressTableExists' },
      { name: 'years', variable: 'yearsTableExists' },
      { name: 'subjects', variable: 'subjectsTableExists' },
      { name: 'exams', variable: 'examsTableExists' },
      { name: 'questions', variable: 'questionsTableExists' }
    ];
    
    const status: Record<string, boolean> = {};
    
    // Check each table
    for (const table of tables) {
      const { error } = await supabase
        .from(table.name)
        .select('id')
        .limit(1);
      
      status[table.variable] = !error || error.code !== '42P01';
    }
    
    return status;
  } catch (error) {
    console.error('Error checking database status:', error);
    return {
      usersTableExists: false,
      preferencesTableExists: false,
      progressTableExists: false,
      yearsTableExists: false,
      subjectsTableExists: false,
      examsTableExists: false,
      questionsTableExists: false
    };
  }
};
