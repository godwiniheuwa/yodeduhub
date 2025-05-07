
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { AddYearDialog } from "@/components/admin/years/AddYearDialog";
import { DeleteYearDialog } from "@/components/admin/years/DeleteYearDialog";
import { YearsTable } from "@/components/admin/years/YearsTable";
import { EmptyYearsState } from "@/components/admin/years/EmptyYearsState";
import { useYearsManagement } from "@/hooks/useYearsManagement";

export default function YearsPage() {
  const {
    years,
    isLoading,
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    openAddDialog,
    handleYearAdded,
    openDeleteDialog,
    handleDeleteYear
  } = useYearsManagement();

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
              <EmptyYearsState onAddYear={openAddDialog} />
            ) : (
              <YearsTable years={years} onDeleteYear={openDeleteDialog} />
            )}
          </CardContent>
        </Card>

        {/* Add Year Dialog */}
        <AddYearDialog 
          open={dialogOpen} 
          onOpenChange={setDialogOpen}
          onYearAdded={handleYearAdded}
          years={years}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteYearDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDeleteConfirm={handleDeleteYear}
        />
      </div>
    </AdminLayout>
  );
}
