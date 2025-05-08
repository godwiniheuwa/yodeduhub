import { createUsersTable, createPreferencesTable, createProgressTable } from './tableSetup/userTables';
import { createYearsTable, createSubjectsTable, createExamsTable, createQuestionsTable } from './tableSetup/examTables';
import { getDbStatus, isDatabaseReady } from './tableSetup/dbStatus';

// Main function to set up exam tables and necessary structures
export const setupExamTables = async () => {
  try {
    // Try to create user-related tables
    try {
      await createUsersTable();
    } catch (error) {
      console.log('Users table may already exist or creation failed:', error);
    }
    
    try {
      await createPreferencesTable();
    } catch (error) {
      console.log('Preferences table may already exist or creation failed:', error);
    }
    
    try {
      await createProgressTable();
    } catch (error) {
      console.log('Progress table may already exist or creation failed:', error);
    }
    
    // Try to create exam-related tables
    try {
      await createYearsTable();
    } catch (error) {
      console.log('Years table may already exist or creation failed:', error);
    }
    
    try {
      await createSubjectsTable();
    } catch (error) {
      console.log('Subjects table may already exist or creation failed:', error);
    }
    
    try {
      await createExamsTable();
    } catch (error) {
      console.log('Exams table may already exist or creation failed:', error);
    }
    
    try {
      await createQuestionsTable();
    } catch (error) {
      console.log('Questions table may already exist or creation failed:', error);
    }

    // Check database status after setup attempts
    const status = await getDbStatus();
    console.log('Database setup complete:');
    console.log(`- Users table: ${status.usersTableExists ? 'Exists' : 'Failed'}`);
    console.log(`- Preferences table: ${status.preferencesTableExists ? 'Exists' : 'Failed'}`);
    console.log(`- Progress table: ${status.progressTableExists ? 'Exists' : 'Failed'}`);
    console.log(`- Years table: ${status.yearsTableExists ? 'Exists' : 'Failed'}`);
    console.log(`- Subjects table: ${status.subjectsTableExists ? 'Exists' : 'Failed'}`);
    console.log(`- Exams table: ${status.examsTableExists ? 'Exists' : 'Failed'}`);
    console.log(`- Questions table: ${status.questionsTableExists ? 'Exists' : 'Failed'}`);
    
    return status;
  } catch (error) {
    console.error('Error setting up exam tables:', error);
    throw error;
  }
};

// Export isDatabaseReady function from dbStatus
export { isDatabaseReady } from './tableSetup/dbStatus';
