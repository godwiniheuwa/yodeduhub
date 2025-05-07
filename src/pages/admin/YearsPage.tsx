
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from 'lucide-react';

// Mock data for exam years
const mockYears = [
  { id: '1', year: '2024', examsCount: 4, questionsCount: 350 },
  { id: '2', year: '2023', examsCount: 5, questionsCount: 420 },
  { id: '3', year: '2022', examsCount: 5, questionsCount: 380 },
  { id: '4', year: '2021', examsCount: 4, questionsCount: 310 },
  { id: '5', year: '2020', examsCount: 3, questionsCount: 290 },
];

export default function YearsPage() {
  const [years, setYears] = useState<any[]>(mockYears);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [yearValue, setYearValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadYears();
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

  const loadYears = async () => {
    try {
      // In production, this would fetch from Supabase
      // For now, we'll use mock data
      setYears(mockYears);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading years:', error);
      toast({
        title: "Error",
        description: "Failed to load exam years",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const openAddDialog = () => {
    setYearValue(new Date().getFullYear().toString());
    setDialogOpen(true);
  };

  const handleSaveYear = () => {
    if (!yearValue || !/^\d{4}$/.test(yearValue)) {
      toast({
        title: "Error",
        description: "Please enter a valid 4-digit year",
        variant: "destructive",
      });
      return;
    }

    // Check if year already exists
    if (years.some(y => y.year === yearValue)) {
      toast({
        title: "Error",
        description: "This year already exists in the system",
        variant: "destructive",
      });
      return;
    }

    // Add new year
    const newYear = {
      id: Date.now().toString(),
      year: yearValue,
      examsCount: 0,
      questionsCount: 0
    };
    setYears([...years, newYear].sort((a, b) => parseInt(b.year) - parseInt(a.year)));
    toast({
      title: "Year added",
      description: `Year ${yearValue} has been added successfully`,
    });

    setDialogOpen(false);
  };

  const handleDeleteYear = (id: string) => {
    setYears(years.filter(year => year.id !== id));
    toast({
      title: "Year deleted",
      description: "The exam year has been removed successfully",
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading exam years...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Exam Years</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Add or remove years for your examination papers
            </p>
          </div>
          <Button 
            onClick={openAddDialog}
            className="bg-quiz-primary hover:bg-purple-700"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Year
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>All Exam Years</CardTitle>
            <CardDescription>
              Years for which exam papers are available in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Exams</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {years.map((year) => (
                  <TableRow key={year.id}>
                    <TableCell className="font-medium">{year.year}</TableCell>
                    <TableCell>{year.examsCount}</TableCell>
                    <TableCell>{year.questionsCount}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700" 
                        onClick={() => handleDeleteYear(year.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Year Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Exam Year</DialogTitle>
              <DialogDescription>
                Enter a year for which you want to add examination papers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input 
                  id="year" 
                  type="number"
                  min="1990"
                  max="2050"
                  value={yearValue} 
                  onChange={(e) => setYearValue(e.target.value)} 
                  placeholder="e.g. 2024"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveYear}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
