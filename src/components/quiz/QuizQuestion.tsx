
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type Option = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  text: string;
  options: Option[];
  correctOptionId?: string; // Only used in review mode
};

type QuizQuestionProps = {
  question: Question;
  selectedOptionId: string | null;
  onOptionSelect: (optionId: string) => void;
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
  selectedOptionId,
  onOptionSelect,
  onNextQuestion,
  onPreviousQuestion,
  isLastQuestion,
  isFirstQuestion,
  currentQuestionNumber,
  totalQuestions,
  isReviewMode = false,
  timeRemaining,
}: QuizQuestionProps) {
  const [isAnswerSelected, setIsAnswerSelected] = useState(!!selectedOptionId);

  const handleOptionChange = (optionId: string) => {
    setIsAnswerSelected(true);
    onOptionSelect(optionId);
  };

  const getOptionClass = (optionId: string) => {
    if (!isReviewMode || !question.correctOptionId) return "";
    
    if (optionId === question.correctOptionId) {
      return "border-green-500 bg-green-50 dark:bg-green-900/20";
    }
    
    if (optionId === selectedOptionId && optionId !== question.correctOptionId) {
      return "border-red-500 bg-red-50 dark:bg-red-900/20";
    }
    
    return "";
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
      
      {/* Options */}
      <RadioGroup 
        value={selectedOptionId || ""} 
        onValueChange={handleOptionChange}
        className="space-y-3"
        disabled={isReviewMode}
      >
        {question.options.map((option) => (
          <div 
            key={option.id}
            className={`flex items-center border rounded-lg p-4 cursor-pointer transition-all hover:border-quiz-primary ${
              getOptionClass(option.id)
            }`}
          >
            <RadioGroupItem value={option.id} id={option.id} className="mr-3" />
            <Label 
              htmlFor={option.id} 
              className="flex-grow cursor-pointer"
            >
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
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
