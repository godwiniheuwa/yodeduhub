
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

type QuizFormProps = {
  onSubmit: (quizData: any) => void;
  isLoading?: boolean;
  initialData?: any;
};

export function QuizForm({ onSubmit, isLoading = false, initialData }: QuizFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [timeLimit, setTimeLimit] = useState(initialData?.timeLimit || 30);
  const [category, setCategory] = useState(initialData?.category || "general");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    timeLimit?: string;
  }>({});
  
  const categories = [
    { value: "general", label: "General Knowledge" },
    { value: "science", label: "Science" },
    { value: "math", label: "Mathematics" },
    { value: "language", label: "Language & Literature" },
    { value: "history", label: "History" },
    { value: "tech", label: "Technology" },
    { value: "business", label: "Business & Economics" },
  ];

  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      description?: string;
      timeLimit?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = "Quiz title is required";
    }
    
    if (!description.trim()) {
      newErrors.description = "Quiz description is required";
    }
    
    if (!timeLimit) {
      newErrors.timeLimit = "Time limit is required";
    } else if (isNaN(Number(timeLimit)) || Number(timeLimit) <= 0) {
      newErrors.timeLimit = "Time limit must be a positive number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const quizData = {
        title,
        description,
        timeLimit: Number(timeLimit),
        category,
        id: initialData?.id || undefined,
      };
      
      onSubmit(quizData);
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
        <CardTitle>{initialData ? "Edit Quiz" : "Create New Quiz"}</CardTitle>
        <CardDescription>
          {initialData 
            ? "Update the information for your quiz." 
            : "Fill in the details to create a new quiz."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the quiz title"
              disabled={isLoading}
              aria-invalid={errors.title ? "true" : "false"}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of the quiz"
              className="resize-none"
              rows={3}
              disabled={isLoading}
              aria-invalid={errors.description ? "true" : "false"}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                disabled={isLoading}
                aria-invalid={errors.timeLimit ? "true" : "false"}
              />
              {errors.timeLimit && <p className="text-sm text-destructive">{errors.timeLimit}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category} 
                onValueChange={setCategory}
                disabled={isLoading}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              ? (initialData ? "Updating..." : "Creating...")
              : (initialData ? "Update Quiz" : "Create Quiz")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
