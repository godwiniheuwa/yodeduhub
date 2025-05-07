
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import Papa from 'papaparse';

interface QuizImportProps {
  onImportSuccess: (questions: any[]) => void;
}

export function QuizImport({ onImportSuccess }: QuizImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleImport = () => {
    if (!file) {
      setError('Please select a CSV file to import');
      return;
    }

    setImporting(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const { data, errors } = results;
          
          if (errors.length > 0) {
            setError(`CSV parsing error: ${errors[0].message}`);
            setImporting(false);
            return;
          }

          // Validate CSV structure
          const requiredColumns = ['question', 'options', 'correct_answer', 'question_type', 'points'];
          const firstRow = data[0];
          
          if (!firstRow || requiredColumns.some(col => !(col in firstRow))) {
            setError('Invalid CSV format. The file must include columns: question, options, correct_answer, question_type, and points');
            setImporting(false);
            return;
          }

          // Process questions
          const processedQuestions = data
            .filter(row => row.question && row.question.trim() !== '')
            .map((row, index) => {
              // Parse options from comma-separated string to array
              const options = row.options?.split(',').map((opt: string) => opt.trim()) || [];
              
              // Handle correct answer based on question type
              let correctAnswer = row.correct_answer;
              if (row.question_type === 'multiple_choice' && row.correct_answer?.includes(',')) {
                correctAnswer = row.correct_answer.split(',').map((ans: string) => ans.trim());
              }

              return {
                question_text: row.question,
                question_type: row.question_type || 'multiple_choice',
                options: options,
                correct_answer: correctAnswer,
                points: parseInt(row.points) || 1,
                order: index + 1,
                image_url: row.image_url || null,
                audio_url: row.audio_url || null,
                video_url: row.video_url || null,
              };
            });

          if (processedQuestions.length === 0) {
            setError('No valid questions found in the CSV file');
            setImporting(false);
            return;
          }

          toast({
            title: "Import Successful",
            description: `${processedQuestions.length} questions imported successfully`,
          });
          
          onImportSuccess(processedQuestions);
          setImporting(false);
        } catch (err) {
          console.error('Import error:', err);
          setError('An error occurred while processing the CSV file');
          setImporting(false);
        }
      },
      error: (err) => {
        console.error('CSV parsing error:', err);
        setError('Failed to parse CSV file. Please check the file format.');
        setImporting(false);
      }
    });
  };

  const handleDownloadTemplate = () => {
    const csvContent = `question,options,correct_answer,question_type,points,image_url,audio_url,video_url
"What is the capital of France?","Paris,London,Berlin,Madrid","Paris","multiple_choice",1,,
"True or False: The Earth is flat.","True,False","False","true_false",1,,
"What is 2+2?","1,2,3,4","4","multiple_choice",1,,
"Name the first president of the United States.","","George Washington","short_answer",2,,`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'quiz_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Quiz Questions</CardTitle>
        <CardDescription>
          Upload a CSV file with your quiz questions. 
          <Button
            variant="link"
            className="p-0 h-auto font-normal text-blue-500"
            onClick={handleDownloadTemplate}
          >
            Download template
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-1"
            disabled={importing}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            CSV must include: question, options (comma-separated), correct_answer, question_type, and points
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleImport} 
          disabled={!file || importing} 
          className="w-full"
        >
          {importing ? "Importing..." : "Import Questions"}
        </Button>
      </CardFooter>
    </Card>
  );
}
