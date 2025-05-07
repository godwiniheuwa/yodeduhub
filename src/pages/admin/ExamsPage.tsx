import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from "@/components/layout/AdminLayout";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { mockQuizzes } from '@/utils/mockData';
import { supabase } from '@/services/supabase';

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>(mockQuizzes);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadExams();
  }, []);

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

  const loadExams = async () => {
    try {
      // In production, this would fetch from Supabase
      // For now, we'll use mock data
      setExams(mockQuizzes);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading exams:', error);
      toast({
        title: "Error",
        description: "Failed to load exams",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleCreateExam = () => {
    navigate('/admin/exams/new');
  };

  const handleDeleteExam = (id: string) => {
    // In production, delete from Supabase
    setExams(exams.filter(exam => exam.id !== id));
    toast({
      title: "Exam deleted",
      description: "The exam has been successfully deleted",
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading exams...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Exams</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Add, edit, or remove examination types like JAMB, WAEC, GCE, IELTS
            </p>
          </div>
          <Button 
            onClick={handleCreateExam}
            className="bg-quiz-primary hover:bg-purple-700"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Exam
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>All Exams</CardTitle>
            <CardDescription>
              A comprehensive list of all examination types in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Abbreviation</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Years Available</TableHead>
                  <TableHead>Total Questions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell>{exam.title.substring(0, 4).toUpperCase()}</TableCell>
                    <TableCell className="max-w-xs truncate">{exam.description || "No description available"}</TableCell>
                    <TableCell>2018-2024</TableCell>
                    <TableCell>{exam.questionsCount || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/admin/exams/${exam.id}/edit`)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteExam(exam.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
