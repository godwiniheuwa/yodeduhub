
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockQuizzes, mockAdminStats } from "@/utils/mockData";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is an admin
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
      return;
    }
    
    setUser(parsedUser);
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
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage quizzes, questions, and view statistics
            </p>
          </div>
          <Link to="/admin/quiz/new">
            <Button className="button-quiz-primary">
              Create New Quiz
            </Button>
          </Link>
        </header>
        
        {/* Admin Statistics */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-6">Platform Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total Quizzes" 
              value={mockAdminStats.totalQuizzes} 
            />
            <StatCard 
              title="Total Questions" 
              value={mockAdminStats.totalQuestions}
            />
            <StatCard 
              title="Active Users" 
              value={mockAdminStats.activeUsers}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard 
              title="Quiz Completions" 
              value={mockAdminStats.quizCompletions}
              trend={{ value: 12, isPositive: true }}
            />
          </div>
        </section>
        
        {/* Quiz Management */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Quiz Management</h2>
            <div className="flex space-x-2">
              <Button variant="outline" className="text-sm">
                Export Data
              </Button>
              <Button variant="outline" className="text-sm">
                Filter
              </Button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Table>
              <TableCaption>A list of your quizzes.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Quiz Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Time Limit</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Avg. Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.category}</TableCell>
                    <TableCell>{quiz.questionsCount}</TableCell>
                    <TableCell>{quiz.timeLimit} min</TableCell>
                    <TableCell>{quiz.attempts || 0}</TableCell>
                    <TableCell>{quiz.averageScore || '-'}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/admin/quiz/${quiz.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Link to={`/admin/quiz/${quiz.id}/questions`}>
                          <Button variant="outline" size="sm">
                            Questions
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </Layout>
  );
}
