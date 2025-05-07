import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define types for our database tables
export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  timeLimit: number;
  questionsCount: number;
  createdAt: string;
  attempts: number;
  averageScore: number | null;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  correct_answer: string | string[];
  points: number;
  order: number;
  image_url?: string;
  audio_url?: string;
  video_url?: string;
}

// Initialize Supabase client with provided values
const supabaseUrl = 'https://evbznrkdjwzmhbokxtjd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2Ynpucmtkand6bWhib2t4dGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTUxMDIsImV4cCI6MjA2MjIzMTEwMn0.ESnOCWrRkeNxei-ASUCjr5x1rrL4gog_uHHAxM9rerk';

// Create a client with error handling
let supabase: SupabaseClient;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Supabase client initialized");
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  
  // Create a mock client with dummy methods to prevent app crashes
  supabase = {
    from: () => ({
      insert: () => ({ 
        select: () => ({ single: () => Promise.resolve({ data: null, error: new Error("Not connected to Supabase") }) }) 
      }),
      update: () => Promise.resolve({ data: null, error: new Error("Not connected to Supabase") }),
      select: () => Promise.resolve({ data: [], error: null }),
      eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) })
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: new Error("Not connected to Supabase") }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    rpc: () => Promise.resolve()
  } as unknown as SupabaseClient;
}

export { supabase };

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

// Quiz-related functions
export const createQuiz = async (quizData: Omit<Quiz, 'id' | 'questionsCount' | 'attempts' | 'averageScore'>): Promise<Quiz | null> => {
  try {
    const newQuiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      questionsCount: 0,
      attempts: 0,
      averageScore: null,
    };

    const { data, error } = await supabase
      .from('quizzes')
      .insert(newQuiz)
      .select()
      .single();

    if (error) {
      console.error('Error creating quiz:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createQuiz:', error);
    return null;
  }
};

// Question-related functions
export const addQuestionToQuiz = async (questionData: Omit<QuizQuestion, 'id'>): Promise<QuizQuestion | null> => {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert({
        ...questionData,
        id: `question-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding question:', error);
      return null;
    }

    // Update question count in the quiz
    await supabase
      .from('quizzes')
      .update({ questionsCount: supabase.rpc('increment', { count: 1 }) })
      .eq('id', questionData.quiz_id);

    return data;
  } catch (error) {
    console.error('Error in addQuestionToQuiz:', error);
    return null;
  }
};

export const getQuizQuestions = async (quizId: string): Promise<QuizQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching questions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getQuizQuestions:', error);
    return [];
  }
};

// File upload functions for multimedia content
export const uploadQuestionMedia = async (file: File, quizId: string, questionId: string, fileType: 'image' | 'audio' | 'video'): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `quiz_media/${quizId}/${questionId}/${fileType}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('quiz_media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error(`Error uploading ${fileType}:`, error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('quiz_media')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`Error in upload${fileType.charAt(0).toUpperCase() + fileType.slice(1)}:`, error);
    return null;
  }
};

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
