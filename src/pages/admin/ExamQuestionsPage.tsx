
import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getQuestions, addQuestion } from '@/services/supabase/exam';
import { QuestionForm } from '@/components/admin/QuestionForm';
import { QuizImport } from '@/components/admin/QuizImport';

export default function ExamQuestionsPage() {
  const { examId } = useParams<{ examId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [importedQuestions, setImportedQuestions] = useState<any[]>([]);
  
  // Get exam name from location state
  const examName = location.state?.examName || "Exam";

  useEffect(() => {
    checkAuth();
    if (examId) {
      loadQuestions();
    }
  }, [examId]);

  const checkAuth = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to view this page",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      toast({
        title: "Access denied",
        description: "You must be an administrator to view this page",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  };

  const loadQuestions = async () => {
    try {
      if (!examId) return;
      const questionsData = await getQuestions(examId);
      setQuestions(questionsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleAddQuestion = async (questionData: any) => {
    if (!examId) return;
    
    setIsSaving(true);
    try {
      const newQuestion = await addQuestion({
        exam_id: examId,
        question_text: questionData.text,
        question_type: 'multiple_choice',
        options: questionData.options.map((opt: any) => opt.text),
        correct_answer: questionData.options.find((opt: any) => opt.id === questionData.correctOptionId)?.text,
        points: 1
      });
      
      if (newQuestion) {
        toast({
          title: "Question added",
          description: "Question has been added successfully",
        });
        
        // Update questions list
        setQuestions([...questions, newQuestion]);
        
        // Reset form (by reloading)
        loadQuestions();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add question",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      // In a real app, you'd call a delete API
      setQuestions(questions.filter(q => q.id !== questionId));
      toast({
        title: "Question deleted",
        description: "The question has been removed successfully",
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const handleImportSuccess = async (importedData: any[]) => {
    setImportedQuestions(importedData);
    toast({
      title: "Questions imported",
      description: `${importedData.length} questions ready to be added`,
    });
  };

  const handleSaveImportedQuestions = async () => {
    if (!examId || importedQuestions.length === 0) return;
    
    setIsSaving(true);
    try {
      let successCount = 0;
      
      for (const question of importedQuestions) {
        await addQuestion({
          ...question,
          exam_id: examId
        });
        successCount++;
      }
      
      toast({
        title: "Questions added",
        description: `${successCount} questions have been added to ${examName}`,
      });
      
      // Refresh questions list
      loadQuestions();
      
      // Clear imported questions
      setImportedQuestions([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add imported questions",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading questions...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Questions for {examName}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Add or manage questions for this examination
          </p>
        </header>

        <Tabs defaultValue="questions" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-4 w-full md:w-[400px]">
            <TabsTrigger value="questions">Questions List</TabsTrigger>
            <TabsTrigger value="add">Add Question</TabsTrigger>
            <TabsTrigger value="import">Import CSV</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions">
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
                    <Button onClick={() => {
                      const addTab = document.querySelector('[data-value="add"]');
                      if (addTab instanceof HTMLElement) addTab.click();
                    }}>
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
          </TabsContent>
          
          <TabsContent value="add">
            <QuestionForm
              onSubmit={handleAddQuestion}
              isLoading={isSaving}
            />
          </TabsContent>
          
          <TabsContent value="import">
            <div className="space-y-4">
              <QuizImport onImportSuccess={handleImportSuccess} />
              
              {importedQuestions.length > 0 && (
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
                      onClick={handleSaveImportedQuestions} 
                      className="w-full" 
                      disabled={isSaving}
                    >
                      {isSaving ? "Adding Questions..." : `Add ${importedQuestions.length} Questions to ${examName}`}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
