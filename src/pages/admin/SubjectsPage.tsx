
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from 'lucide-react';

// Mock data for subjects
const mockSubjects = [
  { id: '1', name: 'Mathematics', code: 'MATH', questionsCount: 350 },
  { id: '2', name: 'English Language', code: 'ENG', questionsCount: 420 },
  { id: '3', name: 'Physics', code: 'PHY', questionsCount: 280 },
  { id: '4', name: 'Chemistry', code: 'CHEM', questionsCount: 310 },
  { id: '5', name: 'Biology', code: 'BIO', questionsCount: 290 },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>(mockSubjects);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<any>(null);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadSubjects();
  }, []);

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

  const loadSubjects = async () => {
    try {
      // In production, this would fetch from Supabase
      // For now, we'll use mock data
      setSubjects(mockSubjects);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading subjects:', error);
      toast({
        title: "Error",
        description: "Failed to load subjects",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const openAddDialog = () => {
    setCurrentSubject(null);
    setSubjectName('');
    setSubjectCode('');
    setDialogOpen(true);
  };

  const openEditDialog = (subject: any) => {
    setCurrentSubject(subject);
    setSubjectName(subject.name);
    setSubjectCode(subject.code);
    setDialogOpen(true);
  };

  const handleSaveSubject = () => {
    if (!subjectName || !subjectCode) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (currentSubject) {
      // Edit existing subject
      const updatedSubjects = subjects.map(s => 
        s.id === currentSubject.id 
          ? { ...s, name: subjectName, code: subjectCode } 
          : s
      );
      setSubjects(updatedSubjects);
      toast({
        title: "Subject updated",
        description: `${subjectName} has been updated successfully`,
      });
    } else {
      // Add new subject
      const newSubject = {
        id: Date.now().toString(),
        name: subjectName,
        code: subjectCode,
        questionsCount: 0
      };
      setSubjects([...subjects, newSubject]);
      toast({
        title: "Subject added",
        description: `${subjectName} has been added successfully`,
      });
    }

    setDialogOpen(false);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    toast({
      title: "Subject deleted",
      description: "The subject has been removed successfully",
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading subjects...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Subjects</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Add, edit, or remove subjects for your exams
            </p>
          </div>
          <Button 
            onClick={openAddDialog}
            className="bg-quiz-primary hover:bg-purple-700"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Subject
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>All Subjects</CardTitle>
            <CardDescription>
              A comprehensive list of all subjects in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject Name</TableHead>
                  <TableHead>Subject Code</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.code}</TableCell>
                    <TableCell>{subject.questionsCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(subject)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteSubject(subject.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Subject Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
              <DialogDescription>
                {currentSubject 
                  ? 'Update the subject details below.' 
                  : 'Enter the details for the new subject.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input 
                  id="name" 
                  value={subjectName} 
                  onChange={(e) => setSubjectName(e.target.value)} 
                  placeholder="e.g. Mathematics"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Subject Code</Label>
                <Input 
                  id="code" 
                  value={subjectCode} 
                  onChange={(e) => setSubjectCode(e.target.value)} 
                  placeholder="e.g. MATH"
                  maxLength={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveSubject}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
