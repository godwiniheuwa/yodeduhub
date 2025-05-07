
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Calendar, BookOpen } from "lucide-react";

export function QuickActions() {
  const navigate = useNavigate();
  
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <Book className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-medium mb-1">Manage Exams</h3>
            <p className="text-sm text-gray-500 mb-4">Add or edit exams like JAMB, WAEC, IELTS</p>
            <Button 
              onClick={() => navigate('/admin/exams')}
              variant="outline" 
              className="w-full"
            >
              Go to Exams
            </Button>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <Calendar className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-medium mb-1">Manage Years</h3>
            <p className="text-sm text-gray-500 mb-4">Add or edit exam years from 2000 onwards</p>
            <Button 
              onClick={() => navigate('/admin/years')}
              variant="outline" 
              className="w-full"
            >
              Go to Years
            </Button>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <BookOpen className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium mb-1">Manage Subjects</h3>
            <p className="text-sm text-gray-500 mb-4">Add or edit subjects like Mathematics, English</p>
            <Button 
              onClick={() => navigate('/admin/subjects')}
              variant="outline" 
              className="w-full"
            >
              Go to Subjects
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
