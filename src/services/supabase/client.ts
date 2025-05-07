
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client with provided values
const supabaseUrl = 'https://evbznrkdjwzmhbokxtjd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2Ynpucmtkand6bWhib2t4dGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NTUxMDIsImV4cCI6MjA2MjIzMTEwMn0.ESnOCWrRkeNxei-ASUCjr5x1rrL4gog_uHHAxM9rerk';

// Create a client with error handling
let supabase: SupabaseClient;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Supabase client initialized");
  
  // Create SQL functions for table operations using createClient options
  const setupFunctions = async () => {
    try {
      // Function to check if a table exists
      await supabase.rpc('create_check_table_exists_function');
    } catch (err) {
      // If function doesn't exist, warn in console
      console.log('Note: check_table_exists function might need to be created manually');
    }

    try {
      // Function to create years table
      await supabase.rpc('create_years_table_function');
    } catch (err) {
      console.log('Note: create_years_table function might need to be created manually');
    }

    try {
      // Function to create subjects table
      await supabase.rpc('create_subjects_table_function');
    } catch (err) {
      console.log('Note: create_subjects_table function might need to be created manually');
    }

    try {
      // Function to create exams table
      await supabase.rpc('create_exams_table_function');
    } catch (err) {
      console.log('Note: create_exams_table function might need to be created manually');
    }

    try {
      // Function to create questions table
      await supabase.rpc('create_questions_table_function');
    } catch (err) {
      console.log('Note: create_questions_table function might need to be created manually');
    }
  };

  // Run setup on initialization
  setupFunctions().then(() => {
    console.log("SQL functions initialized");
  }).catch(err => {
    console.error("Error initializing SQL functions:", err);
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
