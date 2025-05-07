
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ExamForm } from "@/components/admin/ExamForm";
import { toast } from "@/hooks/use-toast";
import { getExamById, updateExam } from "@/services/supabase/exam";

export default function EditExamPage() {
  const [exam, setExam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();

  useEffect(() => {
    if (examId) {
      loadExam(examId);
    }
  }, [examId]);

  const loadExam = async (id: string) => {
    try {
      const examData = await getExamById(id);
      
      if (!examData) {
        toast({
          title: "Exam not found",
          description: "The requested exam does not exist",
          variant: "destructive",
        });
        navigate('/admin/exams');
        return;
      }
      
      setExam(examData);
      setIsLoading(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load exam data",
        variant: "destructive",
      });
      navigate('/admin/exams');
    }
  };

  const handleUpdateExam = async (examData: any) => {
    if (!examId) return;
    
    setIsSaving(true);
    try {
      const updatedExam = await updateExam(examId, examData);
      
      if (updatedExam) {
        toast({
          title: "Exam updated",
          description: `${updatedExam.name} has been updated successfully`,
        });
        navigate('/admin/exams');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update exam",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading exam data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Exam</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Update the details for this examination type
          </p>
        </header>

        <ExamForm 
          onSubmit={handleUpdateExam}
          isLoading={isSaving}
          initialData={exam}
        />
      </div>
    </AdminLayout>
  );
}
