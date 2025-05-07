
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { QuizCard } from "@/components/dashboard/QuizCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { mockQuizzes, mockUserStats } from "@/utils/mockData";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
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
    
    setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">Loading...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!user) return null;

  return (
    <Layout 
      isLoggedIn={true} 
      userRole={user.role} 
      userInitials={user.name.charAt(0)}
      onLogout={handleLogout}
    >
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here's an overview of your learning journey
          </p>
        </header>
        
        {/* Statistics Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-6">Your Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Quizzes Attempted" 
              value={mockUserStats.quizzesAttempted} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard 
              title="Average Score" 
              value={`${mockUserStats.averageScore}%`}
              trend={{ value: 5, isPositive: true }}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
            <StatCard 
              title="Time Spent" 
              value={mockUserStats.timeSpent}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard 
              title="Quizzes Completed" 
              value={mockUserStats.quizzesCompleted}
              description="out of 12 available quizzes"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />
          </div>
        </section>
        
        {/* Available Quizzes */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Available Quizzes</h2>
            <Button variant="outline" className="text-sm">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockQuizzes.filter(q => !q.attempted).slice(0, 3).map((quiz) => (
              <QuizCard 
                key={quiz.id}
                id={quiz.id}
                title={quiz.title}
                description={quiz.description}
                questionsCount={quiz.questionsCount}
                timeLimit={quiz.timeLimit}
                category={quiz.category}
              />
            ))}
          </div>
        </section>
        
        {/* Recent Results */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Results</h2>
            <Button variant="outline" className="text-sm">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockQuizzes.filter(q => q.attempted).slice(0, 3).map((quiz) => (
              <QuizCard 
                key={quiz.id}
                id={quiz.id}
                title={quiz.title}
                description={quiz.description}
                questionsCount={quiz.questionsCount}
                timeLimit={quiz.timeLimit}
                category={quiz.category}
                attempted={true}
                score={quiz.score}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
