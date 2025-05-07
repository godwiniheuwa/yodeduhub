
// Re-export all user-related functions from the separate files
export { signUp, signIn, signOut, getCurrentUser } from './auth';
export { updateUserProfile, getUserById } from './profile';
export { getUserPreferences, updateUserPreferences } from './preferences';
export { getUserProgress, updateUserProgress } from './progress';
export { getAllUsers } from './admin';
