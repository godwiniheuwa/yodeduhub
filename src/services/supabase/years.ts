
import { supabase } from './client';
import { setupExamTables } from './setupTables';

export const getYears = async () => {
  try {
    // Try to setup tables first
    await setupExamTables();
    
    // Now try to get years
    const { data, error } = await supabase
      .from('years')
      .select('*')
      .order('year', { ascending: false });
    
    if (error) {
      console.error('Error fetching years:', error);
      // If table doesn't exist or other error, return empty array
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getYears:', error);
    return [];
  }
};

export const addYear = async (year: number) => {
  try {
    // Try to setup tables first
    await setupExamTables();
    
    const yearData = {
      id: `year-${year}`,
      year: year,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('years')
      .insert([yearData])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding year:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in addYear:', error);
    throw error;
  }
};
