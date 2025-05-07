
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client with provided values
const supabaseUrl = 'https://evbznrkdjwzmhbokxtjd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2Ynpucmtkand6bWhib2t4dGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTUxMDIsImV4cCI6MjA2MjIzMTEwMn0.ESnOCWrRkeNxei-ASUCjr5x1rrL4gog_uHHAxM9rerk';

// Create a client with error handling
let supabase: SupabaseClient;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Supabase client initialized");
  
  // Create SQL functions for table operations
  const setupFunctions = async () => {
    // Function to check if a table exists
    await supabase.rpc('create_check_table_exists_function', {}, {
      count: 'exact'
    }).catch(() => {
      // If function doesn't exist, create it
      return supabase.sql(`
        create or replace function check_table_exists(table_name text)
        returns boolean
        language plpgsql
        as $$
        declare
          table_exists boolean;
        begin
          select exists(
            select 1
            from information_schema.tables
            where table_schema = 'public'
            and table_name = $1
          ) into table_exists;
          return table_exists;
        end;
        $$;
      `).catch(err => console.log('Error creating check_table_exists function:', err));
    });

    // Function to create years table
    await supabase.rpc('create_years_table_function', {}, {
      count: 'exact'
    }).catch(() => {
      // If function doesn't exist, create it
      return supabase.sql(`
        create or replace function create_years_table()
        returns void
        language plpgsql
        as $$
        begin
          create table if not exists public.years (
            id text primary key,
            year integer not null,
            created_at timestamp with time zone default timezone('utc'::text, now()) not null
          );
        end;
        $$;
      `).catch(err => console.log('Error creating create_years_table function:', err));
    });

    // Function to create subjects table
    await supabase.rpc('create_subjects_table_function', {}, {
      count: 'exact'
    }).catch(() => {
      // If function doesn't exist, create it
      return supabase.sql(`
        create or replace function create_subjects_table()
        returns void
        language plpgsql
        as $$
        begin
          create table if not exists public.subjects (
            id text primary key,
            name text not null,
            created_at timestamp with time zone default timezone('utc'::text, now()) not null
          );
        end;
        $$;
      `).catch(err => console.log('Error creating create_subjects_table function:', err));
    });

    // Function to create exams table
    await supabase.rpc('create_exams_table_function', {}, {
      count: 'exact'
    }).catch(() => {
      // If function doesn't exist, create it
      return supabase.sql(`
        create or replace function create_exams_table()
        returns void
        language plpgsql
        as $$
        begin
          create table if not exists public.exams (
            id text primary key,
            name text not null,
            description text,
            created_at timestamp with time zone default timezone('utc'::text, now()) not null
          );
        end;
        $$;
      `).catch(err => console.log('Error creating create_exams_table function:', err));
    });

    // Function to create questions table
    await supabase.rpc('create_questions_table_function', {}, {
      count: 'exact'
    }).catch(() => {
      // If function doesn't exist, create it
      return supabase.sql(`
        create or replace function create_questions_table()
        returns void
        language plpgsql
        as $$
        begin
          create table if not exists public.questions (
            id text primary key,
            exam_id text references public.exams(id),
            year_id text references public.years(id),
            subject_id text references public.subjects(id),
            question_text text not null,
            question_type text not null,
            options jsonb,
            correct_answer jsonb,
            points integer default 1,
            image_url text,
            audio_url text,
            video_url text,
            created_at timestamp with time zone default timezone('utc'::text, now()) not null
          );
        end;
        $$;
      `).catch(err => console.log('Error creating create_questions_table function:', err));
    });
  };

  // Run setup on initialization
  setupFunctions().then(() => {
    console.log("SQL functions created successfully");
  }).catch(err => {
    console.error("Error creating SQL functions:", err);
  });
  
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
