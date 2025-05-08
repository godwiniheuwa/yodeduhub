
import { supabase } from '../client';

// Create users table
export const createUsersTable = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {  // Table doesn't exist
      console.log('Creating users table...');
      
      // We need to create the table via SQL since it doesn't exist
      const { error: createError } = await supabase.rpc('create_users_table_with_username');
      
      if (createError) {
        console.error('Error creating users table:', createError);
        
        // Try the original function if the new one doesn't exist
        const { error: fallbackError } = await supabase.rpc('create_users_table');
        
        if (fallbackError) {
          console.error('Error creating users table (fallback):', fallbackError);
          return false;
        }
        
        // If fallback succeeded, we need to add username column
        try {
          const { error: alterError } = await supabase.rpc('add_username_column');
          if (alterError) {
            console.error('Error adding username column:', alterError);
          }
        } catch (e) {
          console.error('Error in adding username column:', e);
        }
      }
      
      console.log('Users table created successfully');
      return true;
    } else if (error) {
      console.error('Error checking users table:', error);
      return false;
    } else {
      console.log('Users table already exists');
      
      // Check if we need to add the username column to an existing table
      try {
        const { error: checkColumnError } = await supabase.rpc('check_column_exists', { 
          p_table_name: 'users',
          p_column_name: 'username'
        });
        
        if (checkColumnError) {
          // If the function doesn't exist or failed, try to add the column directly
          try {
            const { error: alterError } = await supabase.rpc('add_username_column');
            if (alterError) {
              console.error('Error adding username column:', alterError);
            }
          } catch (e) {
            console.error('Error in adding username column:', e);
          }
        }
      } catch (e) {
        console.error('Error checking username column:', e);
      }
      
      return true;
    }
  } catch (error) {
    console.error('Error in createUsersTable:', error);
    return false;
  }
};

// Create user_preferences table
export const createPreferencesTable = async () => {
  try {
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
  } catch (error) {
    console.error('Error in createPreferencesTable:', error);
    return false;
  }
};

// Create user_progress table
export const createProgressTable = async () => {
  try {
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
  } catch (error) {
    console.error('Error in createProgressTable:', error);
    return false;
  }
};
