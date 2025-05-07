
import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getQuestions, addQuestion } from '@/services/supabase/exam';
import { QuestionForm } from '@/components/admin/QuestionForm';
import { QuestionsList } from '@/components/admin/QuestionsList';
import { QuestionsImportTab } from '@/components/admin/QuestionsImportTab';

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

  const handleAddTabClick = () => {
    const addTab = document.querySelector('[data-value="add"]');
    if (addTab instanceof HTMLElement) addTab.click();
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
            <QuestionsList 
              questions={questions} 
              examName={examName}
              onDelete={handleDeleteQuestion}
              onAddClick={handleAddTabClick}
            />
          </TabsContent>
          
          <TabsContent value="add">
            <QuestionForm
              onSubmit={handleAddQuestion}
              isLoading={isSaving}
            />
          </TabsContent>
          
          <TabsContent value="import">
            <QuestionsImportTab 
              examName={examName}
              importedQuestions={importedQuestions}
              isSaving={isSaving}
              onImportSuccess={handleImportSuccess}
              onSaveImportedQuestions={handleSaveImportedQuestions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
