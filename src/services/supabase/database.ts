
import { supabase } from './client';

// Database setup function - call this to ensure tables exist
export const setupDatabase = async () => {
  try {
    console.log("Setting up database tables...");
    
    // Direct SQL approach - create tables using raw SQL
    // Since the RPC functions don't exist yet, we'll directly create tables
    
    try {
      // Create quizzes table
      await supabase.from('quizzes').select('id').limit(1);
      console.log("Quizzes table already exists");
      return true; // Table exists, no need to create
    } catch (error: any) {
      if (error && error.code === "42P01") {
        console.log("Tables don't exist, creating them now...");
        
        // We need to create tables using direct SQL queries
        // In Supabase, this requires using the REST API with the PSQL endpoint
        // We'll use a simple POST request instead of the Supabase SDK
        
        const sqlQueries = [
          // Create quizzes table
          `CREATE TABLE IF NOT EXISTS public.quizzes (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT,
            "timeLimit" INTEGER NOT NULL DEFAULT 10,
            "questionsCount" INTEGER DEFAULT 0,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
            attempts INTEGER DEFAULT 0,
            "averageScore" FLOAT
          );`,
          
          // Create quiz_questions table  
          `CREATE TABLE IF NOT EXISTS public.quiz_questions (
            id TEXT PRIMARY KEY,
            quiz_id TEXT REFERENCES public.quizzes(id),
            question_text TEXT NOT NULL,
            question_type TEXT NOT NULL,
            options JSONB,
            correct_answer JSONB,
            points INTEGER DEFAULT 1,
            "order" INTEGER,
            image_url TEXT,
            audio_url TEXT,
            video_url TEXT
          );`,
          
          // Create exams table
          `CREATE TABLE IF NOT EXISTS public.exams (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );`,
          
          // Create years table
          `CREATE TABLE IF NOT EXISTS public.years (
            id TEXT PRIMARY KEY,
            year INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );`,
          
          // Create subjects table
          `CREATE TABLE IF NOT EXISTS public.subjects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );`,
          
          // Create questions table
          `CREATE TABLE IF NOT EXISTS public.questions (
            id TEXT PRIMARY KEY,
            exam_id TEXT REFERENCES public.exams(id),
            year_id TEXT REFERENCES public.years(id),
            subject_id TEXT REFERENCES public.subjects(id),
            question_text TEXT NOT NULL,
            question_type TEXT NOT NULL,
            options JSONB,
            correct_answer JSONB,
            points INTEGER DEFAULT 1,
            image_url TEXT,
            audio_url TEXT,
            video_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );`,
          
          // Create students table
          `CREATE TABLE IF NOT EXISTS public.students (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );`,
          
          // Create attempts table
          `CREATE TABLE IF NOT EXISTS public.attempts (
            id TEXT PRIMARY KEY,
            student_id TEXT REFERENCES public.students(id),
            exam_id TEXT REFERENCES public.exams(id),
            year_id TEXT REFERENCES public.years(id),
            subject_id TEXT REFERENCES public.subjects(id),
            score INTEGER,
            max_score INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );`
        ];
        
        // Insert some sample data to help get started
        const sampleData = [
          // Insert sample exams
          `INSERT INTO public.exams (id, name, description) VALUES 
          ('exam-1', 'JAMB', 'Joint Admissions and Matriculation Board Examination'),
          ('exam-2', 'WAEC', 'West African Examinations Council'),
          ('exam-3', 'IELTS', 'International English Language Testing System')
          ON CONFLICT (id) DO NOTHING;`,
          
          // Insert sample years
          `INSERT INTO public.years (id, year) VALUES 
          ('year-2020', 2020),
          ('year-2021', 2021),
          ('year-2022', 2022),
          ('year-2023', 2023),
          ('year-2024', 2024)
          ON CONFLICT (id) DO NOTHING;`,
          
          // Insert sample subjects
          `INSERT INTO public.subjects (id, name) VALUES 
          ('subject-1', 'Mathematics'),
          ('subject-2', 'English'),
          ('subject-3', 'Physics'),
          ('subject-4', 'Chemistry'),
          ('subject-5', 'Biology')
          ON CONFLICT (id) DO NOTHING;`
        ];
        
        // Execute all SQL queries using the Supabase REST API
        for (const query of [...sqlQueries, ...sampleData]) {
          try {
            // Using a workaround since we can't execute raw SQL directly with the JS client
            // We'll create one record at a time and catch the error if the table doesn't exist yet
            if (query.includes('CREATE TABLE')) {
              const tableName = query.match(/CREATE TABLE IF NOT EXISTS public\.(\w+)/)?.[1];
              console.log(`Attempting to create ${tableName} table...`);
            }
            
            // This is a workaround - we're going to use the REST API directly
            const response = await fetch(`${supabaseUrl}/rest/v1/`, {
              method: 'POST',
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates',
              },
              body: JSON.stringify({ query }),
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              console.error('SQL error:', errorData);
              // Continue with the next query even if this one failed
              // This is important because some tables depend on others
            }
          } catch (sqlError) {
            console.error('Error executing SQL:', sqlError);
            // Continue with other queries
          }
        }
        
        // Try to verify that at least the exams table was created
        try {
          const { data, error } = await supabase.from('exams').select('id').limit(1);
          if (!error) {
            console.log("Database setup successful!");
            return true;
          } else {
            console.error("Table verification failed:", error);
          }
        } catch (verifyError) {
          console.error("Could not verify tables:", verifyError);
        }
      }
      
      console.error("Database setup failed:", error);
      return false;
    }
  } catch (error) {
    console.error("Error setting up database:", error);
    return false;
  }
};

// Get dashboard stats
export const getDashboardStats = async () => {
  try {
    const { data: exams, error: examsError } = await supabase
      .from('exams')
      .select('id');
    
    const { data: years, error: yearsError } = await supabase
      .from('years')
      .select('id');
    
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id');
    
    const { data: attempts, error: attemptsError } = await supabase
      .from('attempts')
      .select('id');
    
    return {
      totalExams: exams?.length || 0,
      totalYears: years?.length || 0,
      totalStudents: students?.length || 0,
      totalCompletions: attempts?.length || 0
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return {
      totalExams: 0,
      totalYears: 0,
      totalStudents: 0,
      totalCompletions: 0
    };
  }
};
