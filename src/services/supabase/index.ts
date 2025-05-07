
// Re-export client and types
export * from './client';
export * from './types';

// Re-export functions from database.ts but exclude the ones that conflict with user.ts
export { 
  setupDatabase,
  getDashboardStats
} from './database';

// Re-export everything from quiz and exam modules
export * from './quiz';
export * from './exam';

// Re-export everything from user module (this now re-exports from multiple files)
export * from './user';
