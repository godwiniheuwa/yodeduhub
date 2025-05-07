
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2 } from 'lucide-react';
import { getYears, addYear, setupExamTables } from '@/services/supabase/exam';

export default function YearsPage() {
  const [years, setYears] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [yearValue, setYearValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [yearToDelete, setYearToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    setupTables();
  }, []);
  
  const setupTables = async () => {
    try {
      // First setup tables
      await setupExamTables();
      // Then load years
      loadYears();
    } catch (error) {
      console.error('Error setting up tables:', error);
      setIsLoading(false);
    }
  };

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
      const yearsData = await getYears();
      setYears(yearsData);
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

  const handleSaveYear = async () => {
    if (!yearValue || !/^\d{4}$/.test(yearValue)) {
      toast({
        title: "Error",
        description: "Please enter a valid 4-digit year",
        variant: "destructive",
      });
      return;
    }

    // Check if year already exists
    if (years.some(y => y.year === parseInt(yearValue))) {
      toast({
        title: "Error",
        description: "This year already exists in the system",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Add new year
      const newYear = await addYear(parseInt(yearValue));
      
      if (newYear) {
        // Update local state
        setYears([...years, newYear].sort((a, b) => b.year - a.year));
        
        toast({
          title: "Year added",
          description: `Year ${yearValue} has been added successfully`,
        });
        
        setDialogOpen(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add year",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setYearToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteYear = async (id: string) => {
    try {
      // For now, just remove from UI
      // In a real app, you'd delete from the database first
      setYears(years.filter(year => year.id !== id));
      
      toast({
        title: "Year deleted",
        description: "The exam year has been removed successfully",
      });
      
      setDeleteDialogOpen(false);
      setYearToDelete(null);
    } catch (error) {
      console.error('Error deleting year:', error);
      toast({
        title: "Error",
        description: "Failed to delete year",
        variant: "destructive",
      });
    }
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
            {years.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No exam years available yet</p>
                <Button onClick={openAddDialog}>
                  <Plus className="mr-1 h-4 w-4" /> Add Your First Year
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {years.map((year) => (
                    <TableRow key={year.id}>
                      <TableCell className="font-medium">{year.year}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => openDeleteDialog(year.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
                  disabled={isSaving}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveYear}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this exam year? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setDeleteDialogOpen(false);
                setYearToDelete(null);
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600" 
                onClick={() => yearToDelete && handleDeleteYear(yearToDelete)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
