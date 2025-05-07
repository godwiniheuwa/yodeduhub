
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AdminStats } from "@/components/admin/AdminStats";
import { RecentExams } from "@/components/admin/RecentExams";
import { QuickActions } from "@/components/admin/QuickActions";
import { toast } from "@/hooks/use-toast";
import { mockQuizzes } from "@/utils/mockData";
import { supabase } from "@/services/supabase";
import { getDashboardStats } from "@/services/supabase/database";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExams: 0,
    totalYears: 0,
    totalStudents: 0,
    totalCompletions: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is an admin
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
      return;
    }
    
    setUser(parsedUser);
    
    // Fetch stats
    fetchStats();
    
    setIsLoading(false);
  }, [navigate]);
  
  const fetchStats = async () => {
    try {
      // Use the getDashboardStats function from database.ts
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Fallback to mock data if there's an error
      setStats({
        totalExams: 5,
        totalYears: 12,
        totalStudents: 1245,
        totalCompletions: 5362
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!user) return null;

  return (
    <AdminLayout>
      <div>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            View and manage your exam system
          </p>
        </header>
        
        {/* Admin Statistics */}
        <AdminStats stats={stats} />
        
        {/* Recent Exams */}
        <RecentExams quizzes={mockQuizzes} />
        
        {/* Quick Actions */}
        <QuickActions />
      </div>
    </AdminLayout>
  );
}
