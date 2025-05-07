
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ImportedQuestionsListProps {
  importedQuestions: any[];
  examName: string;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export function ImportedQuestionsList({
  importedQuestions,
  examName,
  onSave,
  isSaving
}: ImportedQuestionsListProps) {
  if (importedQuestions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imported Questions</CardTitle>
        <CardDescription>
          {importedQuestions.length} questions ready to be added to {examName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {importedQuestions.slice(0, 5).map((question, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium max-w-md truncate">
                  {question.question_text}
                </TableCell>
                <TableCell>{question.question_type}</TableCell>
              </TableRow>
            ))}
            {importedQuestions.length > 5 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-500">
                  And {importedQuestions.length - 5} more questions...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSave} 
          className="w-full" 
          disabled={isSaving}
        >
          {isSaving ? "Adding Questions..." : `Add ${importedQuestions.length} Questions to ${examName}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
