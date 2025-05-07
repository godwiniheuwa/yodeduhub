
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Quiz = {
  id: string | number;
  title: string;
  category: string;
  questionsCount: number;
  attempts?: number;
};

type RecentExamsProps = {
  quizzes: Quiz[];
};

export function RecentExams({ quizzes }: RecentExamsProps) {
  const navigate = useNavigate();
  
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Exams</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={() => navigate('/admin/exams/new')}
            className="bg-quiz-primary hover:bg-purple-700"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Exam
          </Button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableCaption>A list of your recent exams</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Exam Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Years</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell className="font-medium">{quiz.title}</TableCell>
                <TableCell>{quiz.category}</TableCell>
                <TableCell>2018-2024</TableCell>
                <TableCell>Mathematics, English</TableCell>
                <TableCell>{quiz.questionsCount}</TableCell>
                <TableCell>{quiz.attempts || 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Link to={`/admin/exams/${quiz.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/admin/exams/${quiz.id}/questions`}>
                      <Button variant="outline" size="sm">
                        Questions
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
