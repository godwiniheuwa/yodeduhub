
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { QuizForm } from "@/components/admin/QuizForm";
import { QuizImport } from "@/components/admin/QuizImport";
import { createQuiz } from "@/services/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreateQuizPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [importedQuestions, setImportedQuestions] = useState<any[]>([]);
  const navigate = useNavigate();

  // Check if user is logged in and is an admin
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    navigate("/login");
    return null;
  }

  const user = JSON.parse(storedUser);
  if (user.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  const handleCreateQuiz = async (quizData: any) => {
    setIsLoading(true);
    
    try {
      // Save quiz to Supabase
      const newQuiz = await createQuiz({
        title: quizData.title,
        description: quizData.description,
        category: quizData.category,
        timeLimit: quizData.timeLimit,
        createdAt: new Date().toISOString(),
      });
      
      if (newQuiz) {
        toast({
          title: "Quiz created",
          description: `"${newQuiz.title}" has been successfully created. ${importedQuestions.length > 0 ? 'Imported questions will be added.' : 'You can now add questions.'}`,
        });
        
        // If we have imported questions, navigate to the questions page to add them
        if (importedQuestions.length > 0) {
          navigate(`/admin/quiz/${newQuiz.id}/questions`, {
            state: { importedQuestions: importedQuestions }
          });
        } else {
          navigate("/admin");
        }
      } else {
        throw new Error('Failed to create quiz');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast({
        title: "Error",
        description: "There was an error creating your quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportSuccess = (questions: any[]) => {
    setImportedQuestions(questions);
    toast({
      title: "Questions imported",
      description: `${questions.length} questions ready to be added to your quiz.`,
    });
  };

  return (
    <Layout
      isLoggedIn={true} 
      userRole={user.role} 
      userInitials={user.name.charAt(0)}
      onLogout={handleLogout}
    >
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Quiz</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create a new quiz for YodeduHub students
          </p>
        </div>
        
        <Tabs defaultValue="manual" className="mb-8">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="manual">Create Quiz</TabsTrigger>
            <TabsTrigger value="import">Import Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            {importedQuestions.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md mb-6 border border-green-200 dark:border-green-800">
                <p className="text-green-800 dark:text-green-300 font-medium">
                  {importedQuestions.length} questions imported
                </p>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Complete the quiz details below and submit to add these questions.
                </p>
              </div>
            )}
            <QuizForm onSubmit={handleCreateQuiz} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="import">
            <QuizImport onImportSuccess={handleImportSuccess} />
            
            {importedQuestions.length > 0 && (
              <div className="mt-6">
                <p className="text-center mb-4">
                  {importedQuestions.length} questions successfully imported. Now fill out the quiz details.
                </p>
                <button
                  onClick={() => document.querySelector('[data-value="manual"]')?.click()}
                  className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  Continue to Quiz Details
                </button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
