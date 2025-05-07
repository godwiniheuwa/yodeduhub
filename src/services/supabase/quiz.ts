
import { supabase } from './client';
import { Quiz, QuizQuestion } from './types';

// Quiz-related functions
export const createQuiz = async (quizData: Omit<Quiz, 'id' | 'questionsCount' | 'attempts' | 'averageScore'>): Promise<Quiz | null> => {
  try {
    const newQuiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      questionsCount: 0,
      attempts: 0,
      averageScore: null,
    };

    const { data, error } = await supabase
      .from('quizzes')
      .insert(newQuiz)
      .select()
      .single();

    if (error) {
      console.error('Error creating quiz:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createQuiz:', error);
    return null;
  }
};

// Question-related functions
export const addQuestionToQuiz = async (questionData: Omit<QuizQuestion, 'id'>): Promise<QuizQuestion | null> => {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert({
        ...questionData,
        id: `question-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding question:', error);
      return null;
    }

    // Update question count in the quiz
    await supabase
      .from('quizzes')
      .update({ questionsCount: supabase.rpc('increment', { count: 1 }) })
      .eq('id', questionData.quiz_id);

    return data;
  } catch (error) {
    console.error('Error in addQuestionToQuiz:', error);
    return null;
  }
};

export const getQuizQuestions = async (quizId: string): Promise<QuizQuestion[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching questions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getQuizQuestions:', error);
    return [];
  }
};

// File upload functions for multimedia content
export const uploadQuestionMedia = async (file: File, quizId: string, questionId: string, fileType: 'image' | 'audio' | 'video'): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `quiz_media/${quizId}/${questionId}/${fileType}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('quiz_media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error(`Error uploading ${fileType}:`, error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('quiz_media')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`Error in upload${fileType.charAt(0).toUpperCase() + fileType.slice(1)}:`, error);
    return null;
  }
};
