
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { QuizForm } from "@/components/admin/QuizForm";
import { toast } from "@/hooks/use-toast";
import { mockQuizzes } from "@/utils/mockData";

export default function EditQuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is an admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to edit quizzes",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      toast({
        title: "Access denied",
        description: "You must be an administrator to edit quizzes",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }
    
    // Find the quiz (in a real app this would be an API call)
    const foundQuiz = mockQuizzes.find(q => q.id === quizId);
    if (!foundQuiz) {
      toast({
        title: "Quiz not found",
        description: "The requested quiz doesn't exist",
        variant: "destructive",
      });
      navigate("/admin");
      return;
    }
    
    setQuiz(foundQuiz);
    setIsLoading(false);
  }, [quizId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  const handleUpdateQuiz = (quizData: any) => {
    setIsLoading(true);
    
    // Mock API call to update quiz
    setTimeout(() => {
      // In a real app, this would be an API call
      toast({
        title: "Quiz updated",
        description: "Your quiz has been successfully updated.",
      });
      
      navigate("/admin");
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">Loading quiz...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!quiz) return null;

  // Get user info
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <Layout
      isLoggedIn={!!user} 
      userRole={user?.role || 'student'} 
      userInitials={user?.name?.charAt(0) || 'U'}
      onLogout={handleLogout}
    >
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Quiz</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Update the details for this YodeduHub quiz
          </p>
        </div>
        
        <QuizForm 
          onSubmit={handleUpdateQuiz} 
          isLoading={isLoading} 
          initialData={quiz}
        />
      </div>
    </Layout>
  );
}
