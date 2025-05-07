
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { QuestionForm } from "@/components/admin/QuestionForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { mockQuizzes, mockQuestions } from "@/utils/mockData";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QuestionsManagePage() {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionType, setQuestionType] = useState<string>("multiple-choice");
  const [showImportForm, setShowImportForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is an admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to manage questions",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      toast({
        title: "Access denied",
        description: "You must be an administrator to manage questions",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }
    
    // Find the quiz (in a real app this would be an API call)
    const foundQuiz = mockQuizzes.find(q => q.id === quizId);
    if (!foundQuiz) {
      toast({
        title: "Quiz not found",
        description: "The requested quiz doesn't exist",
        variant: "destructive",
      });
      navigate("/admin");
      return;
    }
    
    setQuiz(foundQuiz);
    
    // Get questions for this quiz
    const quizQuestions = mockQuestions.filter(q => q.quizId === quizId);
    setQuestions(quizQuestions);
    
    setIsLoading(false);
  }, [quizId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  const handleAddQuestion = () => {
    setEditingQuestionId(null);
    setShowForm(true);
    setShowImportForm(false);
  };

  const handleEditQuestion = (questionId: string) => {
    setEditingQuestionId(questionId);
    setShowForm(true);
    setShowImportForm(false);
    
    // Get the question type and set it
    const question = questions.find(q => q.id === questionId);
    if (question) {
      setQuestionType(question.type || "multiple-choice");
    }
  };
  
  const handleDeleteQuestion = (questionId: string) => {
    // In a real app, this would be an API call
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(updatedQuestions);
    
    toast({
      title: "Question deleted",
      description: "The question has been removed from this quiz",
    });
  };

  const handleQuestionSubmit = (questionData: any) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (editingQuestionId) {
        // Update existing question
        const updatedQuestions = questions.map(q => 
          q.id === editingQuestionId ? { ...questionData, quizId, type: questionType } : q
        );
        setQuestions(updatedQuestions);
        
        toast({
          title: "Question updated",
          description: "Your question has been successfully updated.",
        });
      } else {
        // Add new question
        const newQuestion = {
          ...questionData,
          id: `question-${Date.now()}`,
          quizId,
          type: questionType,
        };
        
        setQuestions([...questions, newQuestion]);
        
        toast({
          title: "Question added",
          description: "Your question has been successfully added to the quiz.",
        });
      }
      
      setShowForm(false);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleImportQuestions = () => {
    setShowForm(false);
    setShowImportForm(true);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedQuestions = JSON.parse(content);
        
        if (Array.isArray(importedQuestions)) {
          // Add quizId to all imported questions
          const questionsWithQuizId = importedQuestions.map(q => ({
            ...q,
            id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            quizId
          }));
          
          setQuestions([...questions, ...questionsWithQuizId]);
          
          toast({
            title: `${questionsWithQuizId.length} questions imported`,
            description: "The questions have been added to your quiz.",
          });
          
          setShowImportForm(false);
        } else {
          toast({
            title: "Invalid format",
            description: "The uploaded file doesn't contain a valid question array.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error importing questions",
          description: "The file could not be processed. Please check the format.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleCancelImport = () => {
    setShowImportForm(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">Loading...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!quiz) return null;

  // Get user info
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <Layout
      isLoggedIn={!!user} 
      userRole={user?.role || 'student'} 
      userInitials={user?.name?.charAt(0) || 'U'}
      onLogout={handleLogout}
    >
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{quiz.title} - Questions</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage questions for this YodeduHub quiz
          </p>
        </div>
        
        {showForm ? (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingQuestionId ? "Edit Question" : "Add New Question"}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <span className="text-sm mr-2">Question Type:</span>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="multi-select">Multi-Select</SelectItem>
                      <SelectItem value="drag-drop">Drag & Drop</SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
            
            <QuestionForm 
              onSubmit={handleQuestionSubmit} 
              isLoading={isLoading}
              initialData={editingQuestionId ? questions.find(q => q.id === editingQuestionId) : undefined} 
            />
          </div>
        ) : showImportForm ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Import Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Upload a JSON file containing questions. The file should contain an array of question objects.
                Each question should have text, options, and correctOptionId properties.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="button-quiz-primary"
                  >
                    Select File
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelImport}
                  >
                    Cancel
                  </Button>
                </div>
                
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <h3 className="font-medium mb-2">Expected JSON Format:</h3>
                  <pre className="text-xs overflow-auto p-2 bg-gray-200 dark:bg-gray-900 rounded">
                    {`[
  {
    "text": "What is the capital of France?",
    "type": "multiple-choice",
    "options": [
      { "id": "opt1", "text": "London" },
      { "id": "opt2", "text": "Paris" },
      { "id": "opt3", "text": "Berlin" },
      { "id": "opt4", "text": "Madrid" }
    ],
    "correctOptionId": "opt2"
  },
  {
    "text": "Select all prime numbers:",
    "type": "multi-select",
    "options": [
      { "id": "opt1", "text": "2" },
      { "id": "opt2", "text": "4" },
      { "id": "opt3", "text": "7" },
      { "id": "opt4", "text": "9" }
    ],
    "correctOptionIds": ["opt1", "opt3"]
  }
]`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex justify-end space-x-4 mb-6">
            <Button
              variant="outline"
              onClick={handleImportQuestions}
            >
              Import Questions
            </Button>
            <Button
              className="button-quiz-primary"
              onClick={handleAddQuestion}
            >
              Add Question
            </Button>
          </div>
        )}
        
        {!showForm && !showImportForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            {questions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This quiz doesn't have any questions yet.
                </p>
                <Button 
                  className="button-quiz-primary"
                  onClick={handleAddQuestion}
                >
                  Add Your First Question
                </Button>
              </div>
            ) : (
              <div>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold">Questions ({questions.length})</h2>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {questions.map((question, index) => (
                    <div key={question.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium text-lg">{index + 1}.</span>
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                              {question.type === 'multiple-choice' && "Multiple Choice"}
                              {question.type === 'multi-select' && "Multi-Select"}
                              {question.type === 'drag-drop' && "Drag & Drop"}
                              {question.type === 'short-answer' && "Short Answer"}
                              {!question.type && "Multiple Choice"}
                            </span>
                          </div>
                          <p className="text-lg mb-4">{question.text}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {question.options?.map((option: any, optIndex: number) => (
                              <div
                                key={option.id}
                                className={`border rounded-md p-3 ${
                                  (question.type === 'multiple-choice' && option.id === question.correctOptionId) || 
                                  (question.type === 'multi-select' && question.correctOptionIds?.includes(option.id))
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : "border-gray-200 dark:border-gray-700"
                                }`}
                              >
                                <div className="flex items-center">
                                  <span className="mr-2 text-sm text-gray-500">
                                    {String.fromCharCode(65 + optIndex)}.
                                  </span>
                                  <span>{option.text}</span>
                                </div>
                              </div>
                            ))}
                            
                            {question.type === 'short-answer' && (
                              <div className="border rounded-md p-3 border-green-500 bg-green-50 dark:bg-green-900/20 col-span-2">
                                <div className="flex items-center">
                                  <span className="mr-2 text-sm font-medium">Correct Answer:</span>
                                  <span>{question.correctAnswer}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditQuestion(question.id)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
