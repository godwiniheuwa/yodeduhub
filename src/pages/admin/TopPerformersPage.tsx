
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Award } from 'lucide-react';

// Mock data for top performers
const mockPerformers = [
  { id: '1', name: 'Jane Smith', email: 'jane@example.com', examsCompleted: 8, averageScore: 96 },
  { id: '2', name: 'Michael Johnson', email: 'michael@example.com', examsCompleted: 12, averageScore: 92 },
  { id: '3', name: 'John Doe', email: 'john@example.com', examsCompleted: 10, averageScore: 90 },
  { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', examsCompleted: 9, averageScore: 88 },
  { id: '5', name: 'Robert Brown', email: 'robert@example.com', examsCompleted: 7, averageScore: 85 },
];

export default function TopPerformersPage() {
  const [performers, setPerformers] = useState<any[]>(mockPerformers);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('week');
  const [examFilter, setExamFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadPerformers();
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

  const loadPerformers = async () => {
    try {
      // In production, this would fetch from Supabase
      // For now, we'll use mock data
      setPerformers(mockPerformers);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading top performers:', error);
      toast({
        title: "Error",
        description: "Failed to load top performers",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
    // In a real app, you would fetch data based on the selected time period
    // For this demo, we'll just pretend to filter
    toast({
      title: "Filter applied",
      description: `Showing top performers for the last ${value}`,
    });
  };

  const handleExamFilterChange = (value: string) => {
    setExamFilter(value);
    // In a real app, you would fetch data based on the selected exam
    // For this demo, we'll just pretend to filter
    toast({
      title: "Filter applied",
      description: `Showing top performers for ${value === 'all' ? 'all exams' : value}`,
    });
  };

  const handleViewStudent = (id: string) => {
    navigate(`/admin/students/${id}`);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading top performers...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Top Performers</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Students with the highest scores across exams
            </p>
          </div>
          <div className="flex space-x-4">
            <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 hours</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={examFilter} onValueChange={handleExamFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                <SelectItem value="JAMB">JAMB</SelectItem>
                <SelectItem value="WAEC">WAEC</SelectItem>
                <SelectItem value="GCE">GCE</SelectItem>
                <SelectItem value="IELTS">IELTS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Award className="text-yellow-500 mr-2 h-6 w-6" />
              <div>
                <CardTitle>Top Students</CardTitle>
                <CardDescription>
                  Highest performing students based on average scores
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Exams Completed</TableHead>
                  <TableHead>Average Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performers.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-bold">#{index + 1}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.examsCompleted}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-600">{student.averageScore}%</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewStudent(student.id)}
                      >
                        View Profile
                      </Button>
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
