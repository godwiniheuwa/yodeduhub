
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

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
  const [showCsvDialog, setShowCsvDialog] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
  };

  const parseCsv = (csvText: string) => {
    // Simple CSV parser
    const lines = csvText.split("\n").filter(line => line.trim() !== "");
    const headers = lines[0].split(",").map(h => h.trim());
    
    const parsedData = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split(",").map(v => v.trim());
      
      if (values.length === headers.length) {
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        parsedData.push(row);
      }
    }
    
    return parsedData;
  };

  const handleImportCsv = () => {
    if (!csvFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // Show progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 10;
          setImportProgress(progress);
          if (progress >= 100) {
            clearInterval(progressInterval);
          }
        }, 100);

        const csvText = event.target?.result as string;
        const parsedData = parseCsv(csvText);
        
        // Validate CSV format
        if (parsedData.length === 0) {
          throw new Error("No valid data found in CSV file");
        }
        
        // Check for required columns
        const requiredColumns = ['question', 'option1', 'option2', 'option3', 'option4', 'answer'];
        const headers = Object.keys(parsedData[0]);
        
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
          throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
        }
        
        setCsvData(parsedData);
        
        toast({
          title: "CSV imported successfully",
          description: `${parsedData.length} questions imported.`,
        });
        
        setShowCsvDialog(false);
        
      } catch (error: any) {
        toast({
          title: "Import error",
          description: error.message || "Failed to parse CSV file",
          variant: "destructive",
        });
        setImportProgress(0);
      }
    };
    
    reader.readAsText(csvFile);
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

          {/* CSV Import Dialog */}
          <Dialog open={showCsvDialog} onOpenChange={setShowCsvDialog}>
            <DialogTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setShowCsvDialog(true)}
              >
                Import Questions from CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Import Questions from CSV</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with questions and answers. The CSV should have columns: question, option1, option2, option3, option4, answer
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="csvFile">Select CSV file</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </div>
                
                {importProgress > 0 && importProgress < 100 && (
                  <div className="space-y-2">
                    <div className="text-sm">Importing...</div>
                    <Progress value={importProgress} className="h-2" />
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs">
                  <p className="font-medium mb-2">CSV Format Example:</p>
                  <pre className="overflow-x-auto">
                    question,option1,option2,option3,option4,answer,type<br/>
                    "What is the capital of France?","London","Paris","Berlin","Madrid","Paris","multiple-choice"<br/>
                    "Select all prime numbers:","2","4","7","9","2,7","multi-select"
                  </pre>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCsvDialog(false)}>Cancel</Button>
                <Button onClick={handleImportCsv}>Import</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
