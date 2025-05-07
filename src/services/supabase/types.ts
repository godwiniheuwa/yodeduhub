
// Define types for our database tables
export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  timeLimit: number;
  questionsCount: number;
  createdAt: string;
  attempts: number;
  averageScore: number | null;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  correct_answer: string | string[];
  points: number;
  order: number;
  image_url?: string;
  audio_url?: string;
  video_url?: string;
}

export interface Exam {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Year {
  id: string;
  year: number;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  created_at: string;
}

export interface Question {
  id: string;
  exam_id: string;
  year_id: string;
  subject_id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: any;
  points: number;
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  created_at: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Attempt {
  id: string;
  student_id: string;
  exam_id: string;
  year_id: string;
  subject_id: string;
  score: number;
  max_score: number;
  created_at: string;
}
