import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ExamForm } from "@/components/admin/ExamForm";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase";

export default function CreateExamPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateExam = async (examData: any) => {
    setIsLoading(true);
    try {
      // In a real application, you'd use Supabase
      // const { data, error } = await supabase
      //   .from('exams')
      //   .insert([examData])
      //   .select();
      
      // if (error) throw error;
      
      // Mock success for now
      setTimeout(() => {
        toast({
          title: "Exam created",
          description: `${examData.title} has been created successfully`,
        });
        navigate('/admin/exams');
        setIsLoading(false);
      }, 1000);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create exam",
        variant: "destructive",
      });
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
