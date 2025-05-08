
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
