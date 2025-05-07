
import { supabase } from './client';
import { User, UserPreferences, UserProgress } from './types';

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

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as User;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

export const getUserPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return data as UserPreferences;
  } catch (error) {
    console.error('Error in getUserPreferences:', error);
    return null;
  }
};

export const updateUserPreferences = async (userId: string, preferences: Partial<UserPreferences>) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as UserPreferences;
  } catch (error) {
    console.error('Error in updateUserPreferences:', error);
    throw error;
  }
};

export const getUserProgress = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        subjects:subject_id (name)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data as UserProgress[];
  } catch (error) {
    console.error('Error in getUserProgress:', error);
    return [];
  }
};

export const updateUserProgress = async (
  userId: string, 
  subjectId: string, 
  progressData: Partial<UserProgress>
) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        subject_id: subjectId,
        ...progressData,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as UserProgress;
  } catch (error) {
    console.error('Error in updateUserProgress:', error);
    throw error;
  }
};

// Admin-specific user functions
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as User[];
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return [];
  }
};

export const getUserById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as User;
  } catch (error) {
    console.error('Error in getUserById:', error);
    return null;
  }
};
