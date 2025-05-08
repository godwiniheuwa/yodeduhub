
import { supabase } from './client';
import { 
  createUsersTable, 
  createPreferencesTable, 
  createProgressTable 
} from './tableSetup/userTables';
import { 
  createYearsTable, 
  createSubjectsTable, 
  createExamsTable, 
  createQuestionsTable 
} from './tableSetup/examTables';
import { isDatabaseReady } from './tableSetup/dbStatus';

// Setup tables if they don't exist
export const setupExamTables = async () => {
  try {
    console.log('Setting up database tables...');
    
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

// Re-export the database status check function
export { isDatabaseReady };
