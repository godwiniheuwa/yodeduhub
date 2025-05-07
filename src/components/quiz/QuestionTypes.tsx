
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Input } from "@/components/ui/input";

export type Option = {
  id: string;
  text: string;
};

export type QuestionType = 'multiple-choice' | 'multi-select' | 'drag-drop' | 'short-answer';

export type Question = {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
  correctOptionId?: string; // For multiple choice
  correctOptionIds?: string[]; // For multi-select
  correctOrder?: string[]; // For drag and drop
  correctAnswer?: string; // For short answer
};

type MultipleChoiceProps = {
  question: Question;
  selectedOptionId: string | null;
  onOptionSelect: (optionId: string) => void;
  isReviewMode?: boolean;
};

export function MultipleChoice({ 
  question, 
  selectedOptionId, 
  onOptionSelect,
  isReviewMode = false 
}: MultipleChoiceProps) {
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
    <RadioGroup 
      value={selectedOptionId || ""} 
      onValueChange={onOptionSelect}
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
  );
}

type MultiSelectProps = {
  question: Question;
  selectedOptionIds: string[];
  onOptionToggle: (optionId: string) => void;
  isReviewMode?: boolean;
};

export function MultiSelect({ 
  question, 
  selectedOptionIds, 
  onOptionToggle,
  isReviewMode = false 
}: MultiSelectProps) {
  const getOptionClass = (optionId: string) => {
    if (!isReviewMode || !question.correctOptionIds) return "";
    
    const isCorrect = question.correctOptionIds.includes(optionId);
    const isSelected = selectedOptionIds.includes(optionId);
    
    if (isCorrect && isSelected) {
      return "border-green-500 bg-green-50 dark:bg-green-900/20";
    }
    
    if (!isCorrect && isSelected) {
      return "border-red-500 bg-red-50 dark:bg-red-900/20";
    }
    
    if (isCorrect && !isSelected) {
      return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"; // Missed correct answer
    }
    
    return "";
  };

  return (
    <div className="space-y-3">
      {question.options.map((option) => (
        <div 
          key={option.id}
          className={`flex items-center border rounded-lg p-4 cursor-pointer transition-all hover:border-quiz-primary ${
            getOptionClass(option.id)
          }`}
          onClick={() => !isReviewMode && onOptionToggle(option.id)}
        >
          <Checkbox 
            id={option.id} 
            checked={selectedOptionIds.includes(option.id)} 
            onCheckedChange={() => !isReviewMode && onOptionToggle(option.id)}
            disabled={isReviewMode}
            className="mr-3"
          />
          <Label 
            htmlFor={option.id} 
            className="flex-grow cursor-pointer"
          >
            {option.text}
          </Label>
        </div>
      ))}
    </div>
  );
}

type DragDropProps = {
  question: Question;
  userOrder: string[];
  setUserOrder: (order: string[]) => void;
  isReviewMode?: boolean;
};

export function DragDrop({ 
  question, 
  userOrder, 
  setUserOrder,
  isReviewMode = false 
}: DragDropProps) {
  // Initialize with options in their initial order if userOrder is empty
  const currentOrder = userOrder.length ? userOrder : question.options.map(opt => opt.id);
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(currentOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setUserOrder(items);
  };

  // Get options in current order for display
  const orderedOptions = currentOrder
    .map(id => question.options.find(opt => opt.id === id))
    .filter(opt => opt) as Option[];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {!isReviewMode ? (
              // Draggable items
              orderedOptions.map((option, index) => (
                <Draggable
                  key={option.id}
                  draggableId={option.id}
                  index={index}
                  isDragDisabled={isReviewMode}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="border rounded-lg p-4 bg-white dark:bg-gray-800 cursor-move"
                    >
                      <div className="flex items-center">
                        <div className="mr-3 text-gray-400">
                          {index + 1}.
                        </div>
                        <div>{option.text}</div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              // Review mode - show correct vs. selected order
              orderedOptions.map((option, index) => {
                const correctIndex = question.correctOrder?.indexOf(option.id);
                const isCorrectPosition = correctIndex === index;
                
                return (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 ${
                      isCorrectPosition 
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                        : "border-red-500 bg-red-50 dark:bg-red-900/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 text-gray-400">
                        {index + 1}.
                      </div>
                      <div>{option.text}</div>
                      {!isCorrectPosition && (
                        <div className="ml-auto text-sm text-gray-500">
                          Correct position: {(correctIndex || 0) + 1}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

type ShortAnswerProps = {
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isReviewMode?: boolean;
  correctAnswer?: string;
};

export function ShortAnswer({ 
  userAnswer, 
  setUserAnswer,
  isReviewMode = false,
  correctAnswer
}: ShortAnswerProps) {
  const isCorrect = isReviewMode && 
    correctAnswer && 
    userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

  return (
    <div className="space-y-3">
      <Input
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer here..."
        disabled={isReviewMode}
        className={isReviewMode ? (isCorrect ? "border-green-500" : "border-red-500") : ""}
      />
      {isReviewMode && correctAnswer && (
        <div className="text-sm mt-2">
          <span className="font-semibold">Correct answer:</span> {correctAnswer}
        </div>
      )}
    </div>
  );
}
