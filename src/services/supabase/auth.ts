
import { supabase } from './client';
import { User } from './types';

// User authentication functions
export const signUp = async (email: string, password: string, userDetails: Partial<User>) => {
  try {
    console.log('Starting signup process for:', email);
    
    // Create the user with Supabase auth, enabling email confirmation
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/login',
        data: {
          name: userDetails.name,
          username: userDetails.username || email.split('@')[0], // Use first part of email as default username
          role: userDetails.role || 'student'
        }
      }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      throw authError;
    }

    if (!authData.user) {
      console.error('No user returned from auth signup');
      throw new Error('User creation failed');
    }

    console.log('Auth signup successful, user created:', authData.user.id);

    // Store additional user information in the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        { 
          id: authData.user.id,
          name: userDetails.name,
          username: userDetails.username || email.split('@')[0], // Use first part of email as default username 
          email,
          role: userDetails.role || 'student',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (userError) {
      console.error('Error inserting user data:', userError);
      throw userError;
    }

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

    console.log('User successfully created with preferences:', userData);
    return userData;
  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
};

export const signIn = async (identifier: string, password: string) => {
  try {
    console.log('Attempting sign in for identifier:', identifier);
    
    // Check if the identifier is an email address
    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    
    let authResponse;
    
    if (isEmail) {
      // Sign in with email
      authResponse = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });
    } else {
      // For username login, we need to first find the user's email
      const { data: userData, error: userLookupError } = await supabase
        .from('users')
        .select('email')
        .eq('username', identifier)
        .single();
      
      if (userLookupError || !userData) {
        console.error('Username lookup error or user not found:', userLookupError);
        throw new Error('Invalid username or password');
      }
      
      // Sign in with email retrieved from username lookup
      authResponse = await supabase.auth.signInWithPassword({
        email: userData.email,
        password,
      });
    }
    
    const { data, error } = authResponse;
    
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    // Update last_login timestamp
    if (data.user) {
      console.log('Updating last login timestamp for user:', data.user.id);
      await supabase
        .from('users')
        .update({ 
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', data.user.id);
    }
    
    console.log('Sign in successful');
    return data;
  } catch (error) {
    console.error('Error in signIn:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    console.log('User signed out successfully');
    return true;
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Get auth user error:', authError);
      return null;
    }
    
    if (!user) {
      console.log('No authenticated user found');
      return null;
    }
    
    console.log('Current authenticated user:', user.id);
    
    // Get user profile from our users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    console.log('User profile retrieved successfully');
    return data as User;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};
