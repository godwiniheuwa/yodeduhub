
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface QuestionsListProps {
  questions: any[];
  examName: string;
  onDelete: (questionId: string) => Promise<void>;
  onAddClick: () => void;
}

export function QuestionsList({ questions, examName, onDelete, onAddClick }: QuestionsListProps) {
  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await onDelete(questionId);
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Questions</CardTitle>
        <CardDescription>
          Questions currently added to this examination
        </CardDescription>
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No questions available yet</p>
            <Button onClick={onAddClick}>
              <Plus className="mr-1 h-4 w-4" /> Add Your First Question
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium max-w-md truncate">
                    {question.question_text}
                  </TableCell>
                  <TableCell>
                    {question.question_type === 'multiple_choice' ? 'Multiple Choice' : 
                     question.question_type === 'true_false' ? 'True/False' : 'Short Answer'}
                  </TableCell>
                  <TableCell>{question.points}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
