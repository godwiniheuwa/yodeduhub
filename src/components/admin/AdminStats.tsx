
import { ReactNode } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Book, Calendar, Users, Award } from "lucide-react";

type StatsProps = {
  stats: {
    totalExams: number;
    totalYears: number;
    totalStudents: number;
    totalCompletions: number;
  };
};

export function AdminStats({ stats }: StatsProps) {
  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Exams" 
          value={stats.totalExams}
          icon={<Book className="text-blue-500" />}
        />
        <StatCard 
          title="Exam Years" 
          value={stats.totalYears}
          trend={{ value: 8, isPositive: true }}
          icon={<Calendar className="text-green-500" />}
        />
        <StatCard 
          title="Registered Students" 
          value={stats.totalStudents}
          trend={{ value: 8, isPositive: true }}
          icon={<Users className="text-purple-500" />}
        />
        <StatCard 
          title="Quiz Completions" 
          value={stats.totalCompletions}
          trend={{ value: 12, isPositive: true }}
          icon={<Award className="text-amber-500" />}
        />
      </div>
    </section>
  );
}
