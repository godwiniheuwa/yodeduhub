
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { getYears, setupExamTables } from '@/services/supabase/exam';

export function useYearsManagement() {
  const [years, setYears] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
    setDialogOpen(true);
  };

  const handleYearAdded = (newYear: any) => {
    // Update local state with the newly added year
    setYears([...years, newYear].sort((a, b) => b.year - a.year));
  };

  const openDeleteDialog = (id: string) => {
    setYearToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteYear = () => {
    if (!yearToDelete) return;
    
    try {
      // For now, just remove from UI
      // In a real app, you'd delete from the database first
      setYears(years.filter(year => year.id !== yearToDelete));
      
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

  return {
    years,
    isLoading,
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    yearToDelete,
    openAddDialog,
    handleYearAdded,
    openDeleteDialog,
    handleDeleteYear
  };
}
