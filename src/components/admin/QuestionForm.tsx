
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

type Option = {
  id: string;
  text: string;
};

type QuestionFormProps = {
  onSubmit: (questionData: any) => void;
  isLoading?: boolean;
  initialData?: any;
};

export function QuestionForm({ onSubmit, isLoading = false, initialData }: QuestionFormProps) {
  const [questionText, setQuestionText] = useState(initialData?.text || "");
  const [options, setOptions] = useState<Option[]>(
    initialData?.options || [
      { id: "opt1", text: "" },
      { id: "opt2", text: "" },
      { id: "opt3", text: "" },
      { id: "opt4", text: "" },
    ]
  );
  const [correctOptionId, setCorrectOptionId] = useState(
    initialData?.correctOptionId || "opt1"
  );
  const [errors, setErrors] = useState<{
    questionText?: string;
    options?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: {
      questionText?: string;
      options?: string;
    } = {};
    
    if (!questionText.trim()) {
      newErrors.questionText = "Question text is required";
    }
    
    const emptyOptions = options.filter(opt => !opt.text.trim());
    if (emptyOptions.length > 0) {
      newErrors.options = "All options must have text";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const questionData = {
        text: questionText,
        options: [...options],
        correctOptionId,
        id: initialData?.id || undefined,
      };
      
      onSubmit(questionData);
    } else {
      toast({
        title: "Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Question" : "Add New Question"}</CardTitle>
        <CardDescription>
          {initialData 
            ? "Update the question and its options." 
            : "Create a new question with multiple-choice answers."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="questionText">Question Text</Label>
            <Textarea
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question here"
              className="resize-none"
              rows={2}
              disabled={isLoading}
              aria-invalid={errors.questionText ? "true" : "false"}
            />
            {errors.questionText && <p className="text-sm text-destructive">{errors.questionText}</p>}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Answer Options</Label>
              <Label className="text-sm text-muted-foreground">Select Correct Answer</Label>
            </div>
            {errors.options && <p className="text-sm text-destructive">{errors.options}</p>}
            
            <RadioGroup value={correctOptionId} onValueChange={setCorrectOptionId}>
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.id}
                    id={option.id}
                    disabled={isLoading}
                    className="mt-3"
                  />
                  <div className="flex-grow">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => window.history.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="button-quiz-primary" 
            disabled={isLoading}
          >
            {isLoading 
              ? (initialData ? "Updating..." : "Adding...")
              : (initialData ? "Update Question" : "Add Question")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
