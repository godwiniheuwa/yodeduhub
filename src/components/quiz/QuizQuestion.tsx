
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MultipleChoice, 
  MultiSelect, 
  DragDrop, 
  ShortAnswer,
  Question as QuestionType,
  QuestionType as QuestionTypeEnum
} from "./QuestionTypes";

export type Option = {
  id: string;
  text: string;
};

export type Question = QuestionType;

type QuizQuestionProps = {
  question: Question;
  userAnswers: Record<string, any>;
  setUserAnswer: (questionId: string, answer: any) => void;
  onNextQuestion: () => void;
  onPreviousQuestion?: () => void;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
  currentQuestionNumber: number;
  totalQuestions: number;
  isReviewMode?: boolean;
  timeRemaining?: string;
};

export function QuizQuestion({
  question,
  userAnswers,
  setUserAnswer,
  onNextQuestion,
  onPreviousQuestion,
  isLastQuestion,
  isFirstQuestion,
  currentQuestionNumber,
  totalQuestions,
  isReviewMode = false,
  timeRemaining,
}: QuizQuestionProps) {
  // Selected answer state for different question types
  const selectedOptionId = question.type === 'multiple-choice' ? userAnswers[question.id] || null : null;
  const selectedOptionIds = question.type === 'multi-select' ? userAnswers[question.id] || [] : [];
  const userOrder = question.type === 'drag-drop' ? userAnswers[question.id] || [] : [];
  const shortAnswer = question.type === 'short-answer' ? userAnswers[question.id] || "" : "";

  const [isAnswerSelected, setIsAnswerSelected] = useState(
    question.type === 'multiple-choice' ? !!selectedOptionId :
    question.type === 'multi-select' ? selectedOptionIds.length > 0 :
    question.type === 'drag-drop' ? userOrder.length > 0 :
    question.type === 'short-answer' ? shortAnswer.trim() !== "" :
    false
  );

  // Handlers for different question types
  const handleOptionSelect = (optionId: string) => {
    setIsAnswerSelected(true);
    setUserAnswer(question.id, optionId);
  };

  const handleOptionToggle = (optionId: string) => {
    const newSelectedOptionIds = [...selectedOptionIds];
    if (newSelectedOptionIds.includes(optionId)) {
      const index = newSelectedOptionIds.indexOf(optionId);
      newSelectedOptionIds.splice(index, 1);
    } else {
      newSelectedOptionIds.push(optionId);
    }
    setIsAnswerSelected(newSelectedOptionIds.length > 0);
    setUserAnswer(question.id, newSelectedOptionIds);
  };

  const handleUserOrderChange = (order: string[]) => {
    setIsAnswerSelected(true);
    setUserAnswer(question.id, order);
  };

  const handleShortAnswerChange = (answer: string) => {
    setIsAnswerSelected(answer.trim() !== "");
    setUserAnswer(question.id, answer);
  };

  return (
    <div className="space-y-6">
      {/* Question header */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium text-muted-foreground">
          Question {currentQuestionNumber} of {totalQuestions}
        </div>
        {timeRemaining && (
          <div className="flex items-center text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {timeRemaining}
          </div>
        )}
      </div>

      {/* Question progress */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <div 
          className="bg-quiz-primary h-1.5 rounded-full"
          style={{width: `${(currentQuestionNumber / totalQuestions) * 100}%`}}
        />
      </div>
      
      {/* Question text */}
      <h3 className="text-xl font-semibold">{question.text}</h3>
      
      {/* Question type label */}
      <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
        {question.type === 'multiple-choice' && "Multiple Choice"}
        {question.type === 'multi-select' && "Select All That Apply"}
        {question.type === 'drag-drop' && "Drag to Order"}
        {question.type === 'short-answer' && "Short Answer"}
      </div>
      
      {/* Question body based on type */}
      <div className="mt-4">
        {question.type === 'multiple-choice' && (
          <MultipleChoice
            question={question}
            selectedOptionId={selectedOptionId}
            onOptionSelect={handleOptionSelect}
            isReviewMode={isReviewMode}
          />
        )}
        
        {question.type === 'multi-select' && (
          <MultiSelect
            question={question}
            selectedOptionIds={selectedOptionIds}
            onOptionToggle={handleOptionToggle}
            isReviewMode={isReviewMode}
          />
        )}
        
        {question.type === 'drag-drop' && (
          <DragDrop
            question={question}
            userOrder={userOrder}
            setUserOrder={handleUserOrderChange}
            isReviewMode={isReviewMode}
          />
        )}
        
        {question.type === 'short-answer' && (
          <ShortAnswer
            userAnswer={shortAnswer}
            setUserAnswer={handleShortAnswerChange}
            isReviewMode={isReviewMode}
            correctAnswer={question.correctAnswer}
          />
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onPreviousQuestion} 
          disabled={isFirstQuestion || !onPreviousQuestion}
        >
          Previous
        </Button>
        
        <Button 
          className="button-quiz-primary"
          onClick={onNextQuestion} 
          disabled={!isReviewMode && !isAnswerSelected}
        >
          {isLastQuestion ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}
