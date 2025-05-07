
import { supabase } from './client';
import { User } from './types';

// User authentication functions
export const signUp = async (email: string, password: string, userDetails: Partial<User>) => {
  try {
    // Create the user with Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userDetails.name,
          role: userDetails.role || 'student'
        }
      }
    });

    if (authError) throw authError;

    if (!authData.user) throw new Error('User creation failed');

    // Store additional user information in the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        { 
          id: authData.user.id,
          name: userDetails.name, 
          email,
          role: userDetails.role || 'student',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (userError) throw userError;

    // Create default preferences for the user
    await supabase
      .from('user_preferences')
      .insert([
        {
          user_id: authData.user.id,
          theme: 'light',
          notifications_enabled: true,
          email_notifications: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

    return userData;
  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;

    // Update last_login timestamp
    if (data.user) {
      await supabase
        .from('users')
        .update({ 
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', data.user.id);
    }
    
    return data;
  } catch (error) {
    console.error('Error in signIn:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    
    return data as User;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};
