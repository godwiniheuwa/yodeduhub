
import { supabase } from './client';

// Setup tables if they don't exist
export const setupExamTables = async () => {
  try {
    // Create years table
    const { error: yearsError } = await supabase.rpc('create_years_table').maybeSingle();
    if (yearsError) {
      console.error('Error creating years table with RPC:', yearsError);
      
      // Try direct SQL as a fallback
      const { error: directYearsError } = await supabase.from('years').select('count()').limit(1);
      
      if (directYearsError && directYearsError.code === '42P01') {
        // Table doesn't exist, try to create it directly
        const { error } = await supabase.query(`
          CREATE TABLE IF NOT EXISTS years (
            id TEXT PRIMARY KEY,
            year INT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
        `);
        
        if (error) {
          console.error('Error creating years table directly:', error);
        } else {
          console.log('Years table created successfully via direct SQL');
        }
      }
    }

    // Create subjects table (with same fallback pattern)
    const { error: subjectsError } = await supabase.rpc('create_subjects_table').maybeSingle();
    if (subjectsError) {
      const { error: directSubjectsError } = await supabase.from('subjects').select('count()').limit(1);
      
      if (directSubjectsError && directSubjectsError.code === '42P01') {
        const { error } = await supabase.query(`
          CREATE TABLE IF NOT EXISTS subjects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            code TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
        `);
        
        if (!error) console.log('Subjects table created successfully via direct SQL');
      }
    }

    // Create exams table (with same fallback pattern)
    const { error: examsError } = await supabase.rpc('create_exams_table').maybeSingle();
    if (examsError) {
      const { error: directExamsError } = await supabase.from('exams').select('count()').limit(1);
      
      if (directExamsError && directExamsError.code === '42P01') {
        const { error } = await supabase.query(`
          CREATE TABLE IF NOT EXISTS exams (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            year_id TEXT REFERENCES years(id),
            subject_id TEXT REFERENCES subjects(id),
            duration INT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
        `);
        
        if (!error) console.log('Exams table created successfully via direct SQL');
      }
    }

    // Create questions table (with same fallback pattern)
    const { error: questionsError } = await supabase.rpc('create_questions_table').maybeSingle();
    if (questionsError) {
      const { error: directQuestionsError } = await supabase.from('questions').select('count()').limit(1);
      
      if (directQuestionsError && directQuestionsError.code === '42P01') {
        const { error } = await supabase.query(`
          CREATE TABLE IF NOT EXISTS questions (
            id TEXT PRIMARY KEY,
            exam_id TEXT REFERENCES exams(id),
            question_text TEXT NOT NULL,
            question_type TEXT NOT NULL,
            options JSONB,
            correct_answer TEXT,
            marks INT DEFAULT 1,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
        `);
        
        if (!error) console.log('Questions table created successfully via direct SQL');
      }
    }

    return true;
  } catch (error) {
    console.error('Error setting up exam tables:', error);
    return false;
  }
};
