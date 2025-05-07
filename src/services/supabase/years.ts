
import { supabase } from './client';
import { setupExamTables } from './setupTables';

export const getYears = async () => {
  try {
    // Setup tables first to ensure they exist
    await setupExamTables();
    
    // Now try to get years
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

export const addYear = async (year: number) => {
  try {
    // Setup tables first to ensure they exist
    await setupExamTables();
    
    const yearData = {
      id: `year-${year}`,
      year: year,
      created_at: new Date().toISOString()
    };
    
    console.log('Attempting to add year:', yearData);
    
    const { data, error } = await supabase
      .from('years')
      .insert([yearData])
      .select();
    
    if (error) {
      console.error('Error adding year:', error);
      throw error;
    }
    
    console.log('Year added successfully:', data);
    return data[0];
  } catch (error) {
    console.error('Error in addYear:', error);
    throw error;
  }
};

export const deleteYear = async (id: string) => {
  try {
    console.log('Attempting to delete year with ID:', id);
    
    const { error } = await supabase
      .from('years')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting year:', error);
      throw error;
    }
    
    console.log('Year deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteYear:', error);
    throw error;
  }
};
