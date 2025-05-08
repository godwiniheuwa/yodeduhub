
import { supabase } from './client';

// Setup tables if they don't exist
export const setupExamTables = async () => {
  try {
    console.log('Setting up database tables...');
    
    // Create users table first
    const createUsersTable = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (error && error.code === '42P01') {  // Table doesn't exist
        console.log('Creating users table...');
        
        // We need to create the table via SQL since it doesn't exist
        const { error: createError } = await supabase.rpc('create_users_table');
        
        if (createError) {
          console.error('Error creating users table:', createError);
          return false;
        }
        
        console.log('Users table created successfully');
        return true;
      } else if (error) {
        console.error('Error checking users table:', error);
        return false;
      } else {
        console.log('Users table already exists');
        return true;
      }
    };
    
    // Create user_preferences table
    const createPreferencesTable = async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('user_id')
        .limit(1);
      
      if (error && error.code === '42P01') {  // Table doesn't exist
        console.log('Creating user_preferences table...');
        
        // We need to create the table via SQL since it doesn't exist
        const { error: createError } = await supabase.rpc('create_preferences_table');
        
        if (createError) {
          console.error('Error creating user_preferences table:', createError);
          return false;
        }
        
        console.log('User_preferences table created successfully');
        return true;
      } else if (error) {
        console.error('Error checking user_preferences table:', error);
        return false;
      } else {
        console.log('User_preferences table already exists');
        return true;
      }
    };
    
    // Create user_progress table
    const createProgressTable = async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('user_id')
        .limit(1);
      
      if (error && error.code === '42P01') {  // Table doesn't exist
        console.log('Creating user_progress table...');
        
        // We need to create the table via SQL since it doesn't exist
        const { error: createError } = await supabase.rpc('create_progress_table');
        
        if (createError) {
          console.error('Error creating user_progress table:', createError);
          return false;
        }
        
        console.log('User_progress table created successfully');
        return true;
      } else if (error) {
        console.error('Error checking user_progress table:', error);
        return false;
      } else {
        console.log('User_progress table already exists');
        return true;
      }
    };
    
    // Create years table
    const createYearsTable = async () => {
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
    };
    
    // Create subjects table
    const createSubjectsTable = async () => {
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
    };
    
    // Create exams table
    const createExamsTable = async () => {
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
    };
    
    // Create questions table
    const createQuestionsTable = async () => {
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
    };
    
    // Check and create all tables
    const usersCreated = await createUsersTable();
    const prefsCreated = await createPreferencesTable();
    const progressCreated = await createProgressTable();
    const yearsCreated = await createYearsTable();
    const subjectsCreated = await createSubjectsTable();
    const examsCreated = await createExamsTable();
    const questionsCreated = await createQuestionsTable();
    
    // Log setup results
    console.log('Database setup complete:');
    console.log('- Users table:', usersCreated ? 'OK' : 'Failed');
    console.log('- Preferences table:', prefsCreated ? 'OK' : 'Failed');
    console.log('- Progress table:', progressCreated ? 'OK' : 'Failed');
    console.log('- Years table:', yearsCreated ? 'OK' : 'Failed');
    console.log('- Subjects table:', subjectsCreated ? 'OK' : 'Failed');
    console.log('- Exams table:', examsCreated ? 'OK' : 'Failed');
    console.log('- Questions table:', questionsCreated ? 'OK' : 'Failed');
    
    // Return success if all critical tables are created
    return usersCreated && prefsCreated && progressCreated;
  } catch (error) {
    console.error('Error setting up database tables:', error);
    return false;
  }
};

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
