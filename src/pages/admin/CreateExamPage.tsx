
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ExamForm } from "@/components/admin/ExamForm";
import { toast } from "@/hooks/use-toast";
import { createExam } from "@/services/supabase/exam";

export default function CreateExamPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateExam = async (examData: any) => {
    setIsLoading(true);
    try {
      // Save to Supabase
      const newExam = await createExam(examData);
      
      if (newExam) {
        toast({
          title: "Exam created",
          description: `${newExam.name} has been created successfully`,
        });
        navigate('/admin/exams/questions', { 
          state: { 
            examId: newExam.id,
            examName: newExam.name 
          } 
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create exam",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Exam</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Add a new examination type to the system
          </p>
        </header>

        <ExamForm 
          onSubmit={handleCreateExam}
          isLoading={isLoading}
        />
      </div>
    </AdminLayout>
  );
}
