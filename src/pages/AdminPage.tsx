import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
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
import { Card } from "@/components/ui/card";
import { 
  Book, 
  Calendar, 
  Users, 
  Award,
  BookOpen,
  Plus
} from "lucide-react";
import { mockQuizzes } from "@/utils/mockData";
import { supabase } from "@/services/supabaseClient";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExams: 0,
    totalYears: 0,
    totalStudents: 0,
    totalCompletions: 0
  });
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
    
    // Fetch stats
    fetchStats();
    
    setIsLoading(false);
  }, [navigate]);
  
  const fetchStats = async () => {
    try {
      // In a real app, this would fetch from your database
      // For now, we'll use mock data
      setStats({
        totalExams: 5,
        totalYears: 12,
        totalStudents: 1245,
        totalCompletions: 5362
      });
      
      // You could use Supabase like this:
      // const { data: exams, error: examsError } = await supabase
      //   .from('exams').select('id');
      // if (!examsError) setStats(prev => ({ ...prev, totalExams: exams.length }));
      
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!user) return null;

  return (
    <AdminLayout>
      <div>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            View and manage your exam system
          </p>
        </header>
        
        {/* Admin Statistics */}
        <section className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total Exams" 
              value={stats.totalExams}
              icon={<Book className="text-blue-500" />}
            />
            <StatCard 
              title="Exam Years" 
              value={stats.totalYears}
              trend={{ value: 8, isPositive: true }}
              icon={<Calendar className="text-green-500" />}
            />
            <StatCard 
              title="Registered Students" 
              value={stats.totalStudents}
              trend={{ value: 8, isPositive: true }}
              icon={<Users className="text-purple-500" />}
            />
            <StatCard 
              title="Quiz Completions" 
              value={stats.totalCompletions}
              trend={{ value: 12, isPositive: true }}
              icon={<Award className="text-amber-500" />}
            />
          </div>
        </section>
        
        {/* Recent Exams */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Exams</h2>
            <div className="flex space-x-2">
              <Button 
                onClick={() => navigate('/admin/exams/new')}
                className="bg-quiz-primary hover:bg-purple-700"
              >
                <Plus className="mr-1 h-4 w-4" /> Add Exam
              </Button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Table>
              <TableCaption>A list of your recent exams</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Exam Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Years</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.category}</TableCell>
                    <TableCell>2018-2024</TableCell>
                    <TableCell>Mathematics, English</TableCell>
                    <TableCell>{quiz.questionsCount}</TableCell>
                    <TableCell>{quiz.attempts || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/admin/exams/${quiz.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Link to={`/admin/exams/${quiz.id}/questions`}>
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
        
        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Book className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="font-medium mb-1">Manage Exams</h3>
                <p className="text-sm text-gray-500 mb-4">Add or edit exams like JAMB, WAEC, IELTS</p>
                <Button 
                  onClick={() => navigate('/admin/exams')}
                  variant="outline" 
                  className="w-full"
                >
                  Go to Exams
                </Button>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Calendar className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="font-medium mb-1">Manage Years</h3>
                <p className="text-sm text-gray-500 mb-4">Add or edit exam years from 2000 onwards</p>
                <Button 
                  onClick={() => navigate('/admin/years')}
                  variant="outline" 
                  className="w-full"
                >
                  Go to Years
                </Button>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <BookOpen className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="font-medium mb-1">Manage Subjects</h3>
                <p className="text-sm text-gray-500 mb-4">Add or edit subjects like Mathematics, English</p>
                <Button 
                  onClick={() => navigate('/admin/subjects')}
                  variant="outline" 
                  className="w-full"
                >
                  Go to Subjects
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
