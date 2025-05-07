
// This file now re-exports all exam-related functions from smaller files
export { setupExamTables } from './setupTables';
export { getExams, getExamById, createExam, updateExam, deleteExam } from './exams';
export { getYears, addYear } from './years';
export { getSubjects, addSubject } from './subjects';
export { addQuestion, getQuestions } from './questions';
