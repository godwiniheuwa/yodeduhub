
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { QuizForm } from "@/components/admin/QuizForm";
import { toast } from "@/hooks/use-toast";
import { mockQuizzes } from "@/utils/mockData";

export default function CreateQuizPage() {
  const [isLoading, setIsLoading] = useState(false);
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

  const handleCreateQuiz = (quizData: any) => {
    setIsLoading(true);
    
    // Mock API call to create quiz
    setTimeout(() => {
      // Generate a new quiz object with ID
      const newQuiz = {
        ...quizData,
        id: `quiz-${Date.now()}`,
        questionsCount: 0,
        createdAt: new Date().toISOString(),
        attempts: 0,
        averageScore: null,
      };
      
      // In a real app, this would be an API call
      // For now, we'll just modify the mock data in memory
      // mockQuizzes.push(newQuiz);
      
      toast({
        title: "Quiz created",
        description: "Your quiz has been successfully created. You can now add questions.",
      });
      
      navigate("/admin");
      setIsLoading(false);
    }, 1000);
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
        
        <QuizForm onSubmit={handleCreateQuiz} isLoading={isLoading} />
      </div>
    </Layout>
  );
}
