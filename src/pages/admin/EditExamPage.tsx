
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ExamForm } from "@/components/admin/ExamForm";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase";
import { mockQuizzes } from "@/utils/mockData";

export default function EditExamPage() {
  const [exam, setExam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();

  useEffect(() => {
    loadExam();
  }, [examId]);

  const loadExam = async () => {
    try {
      // In a real app, you'd fetch from Supabase
      // const { data, error } = await supabase
      //   .from('exams')
      //   .select('*')
      //   .eq('id', examId)
      //   .single();
      
      // if (error) throw error;
      // setExam(data);
      
      // Mock data for now
      const mockExam = mockQuizzes.find(q => q.id === examId);
      if (!mockExam) {
        toast({
          title: "Exam not found",
          description: "The requested exam does not exist",
          variant: "destructive",
        });
        navigate('/admin/exams');
        return;
      }
      
      // Transform the mock quiz into exam format
      setExam({
        ...mockExam,
        abbreviation: mockExam.title.substring(0, 4).toUpperCase()
      });
      
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
    setIsSaving(true);
    try {
      // In a real application, you'd use Supabase
      // const { error } = await supabase
      //   .from('exams')
      //   .update(examData)
      //   .eq('id', examId);
      
      // if (error) throw error;
      
      // Mock success for now
      setTimeout(() => {
        toast({
          title: "Exam updated",
          description: `${examData.title} has been updated successfully`,
        });
        navigate('/admin/exams');
        setIsSaving(false);
      }, 1000);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update exam",
        variant: "destructive",
      });
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
