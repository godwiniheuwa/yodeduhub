
import { supabase } from './client';

// Setup tables if they don't exist
export const setupExamTables = async () => {
  try {
    // Instead of relying on RPC functions that don't exist, create tables directly with SQL
    // Create years table
    const { error: yearsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS years (
          id TEXT PRIMARY KEY,
          year INT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );`
    });
    
    if (yearsError) {
      console.error('Error creating years table:', yearsError);
    } else {
      console.log('Years table created or already exists');
    }

    // Create subjects table
    const { error: subjectsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS subjects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          code TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );`
    });
    
    if (subjectsError) {
      console.error('Error creating subjects table:', subjectsError);
    } else {
      console.log('Subjects table created or already exists');
    }

    // Create exams table
    const { error: examsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS exams (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          year_id TEXT REFERENCES years(id),
          subject_id TEXT REFERENCES subjects(id),
          duration INT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );`
    });
    
    if (examsError) {
      console.error('Error creating exams table:', examsError);
    } else {
      console.log('Exams table created or already exists');
    }

    // Create questions table
    const { error: questionsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS questions (
          id TEXT PRIMARY KEY,
          exam_id TEXT REFERENCES exams(id),
          question_text TEXT NOT NULL,
          question_type TEXT NOT NULL,
          options JSONB,
          correct_answer TEXT,
          marks INT DEFAULT 1,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );`
    });
    
    if (questionsError) {
      console.error('Error creating questions table:', questionsError);
    } else {
      console.log('Questions table created or already exists');
    }

    // Also create users table if it doesn't exist
    const { error: usersError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          role TEXT DEFAULT 'student',
          last_login TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );`
    });
    
    if (usersError) {
      console.error('Error creating users table:', usersError);
    } else {
      console.log('Users table created or already exists');
    }

    return true;
  } catch (error) {
    console.error('Error setting up exam tables:', error);
    return false;
  }
};
