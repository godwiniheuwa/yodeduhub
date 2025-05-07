
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { QuizQuestion, Question } from "@/components/quiz/QuizQuestion";
import { QuizTimer } from "@/components/quiz/QuizTimer";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { mockQuizzes, mockQuestions } from "@/utils/mockData";

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const [user, setUser] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to take a quiz",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(storedUser));
    
    // Find the quiz and questions (in a real app this would be an API call)
    const foundQuiz = mockQuizzes.find(q => q.id === quizId);
    if (!foundQuiz) {
      toast({
        title: "Quiz not found",
        description: "The requested quiz doesn't exist",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }
    
    // Get questions for this quiz and ensure they have the type property
    const quizQuestions = mockQuestions
      .filter(q => q.quizId === quizId)
      .map(q => ({
        ...q,
        type: q.type || 'multiple-choice' // Set default type if not present
      })) as Question[];
    
    if (quizQuestions.length === 0) {
      toast({
        title: "No questions found",
        description: "This quiz doesn't have any questions yet",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }
    
    setQuiz(foundQuiz);
    
    // Randomize questions
    const shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
    
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

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleSetUserAnswer = (questionId: string, answer: any) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuizComplete = () => {
    // Calculate score (in a real app this would be submitted to the server)
    let correctAnswers = 0;
    
    Object.entries(userAnswers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        if (question.type === 'multiple-choice' && question.correctOptionId === answer) {
          correctAnswers++;
        } 
        else if (question.type === 'multi-select' && question.correctOptionIds) {
          // Compare arrays
          const selectedIds = answer as string[];
          const correctIds = question.correctOptionIds;
          if (selectedIds.length === correctIds.length && 
              selectedIds.every(id => correctIds.includes(id))) {
            correctAnswers++;
          }
        }
        else if (question.type === 'drag-drop' && question.correctOrder) {
          // Compare orders
          const userOrder = answer as string[];
          if (JSON.stringify(userOrder) === JSON.stringify(question.correctOrder)) {
            correctAnswers++;
          }
        }
        else if (question.type === 'short-answer' && question.correctAnswer) {
          // Case insensitive comparison
          if (answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
            correctAnswers++;
          }
        }
      }
    });
    
    const score = (correctAnswers / questions.length) * 100;
    
    // Save to local storage for demo
    const quizResults = JSON.parse(localStorage.getItem("quizResults") || "{}");
    quizResults[quizId!] = {
      score,
      totalQuestions: questions.length,
      correctAnswers,
      completedAt: new Date().toISOString(),
      answers: userAnswers,
    };
    localStorage.setItem("quizResults", JSON.stringify(quizResults));
    
    // Navigate to results page
    navigate(`/results/${quizId}`);
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's up!",
      description: "Your answers have been submitted automatically",
    });
    handleQuizComplete();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">Loading quiz...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!quiz || !user) return null;

  return (
    <Layout 
      isLoggedIn={true} 
      userRole={user.role} 
      userInitials={user.name.charAt(0)}
      onLogout={handleLogout}
    >
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {!quizStarted ? (
          <Card className="quiz-card">
            <CardContent className="pt-6 px-6 pb-6">
              <div className="text-center space-y-6">
                <h1 className="text-3xl font-bold">{quiz.title}</h1>
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Category:</span>
                      <span className="font-medium">{quiz.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                      <span className="font-medium">{quiz.timeLimit} minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Questions:</span>
                      <span className="font-medium">{questions.length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Instructions</h2>
                  <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• This quiz contains {questions.length} questions of various types</li>
                    <li>• You have {quiz.timeLimit} minutes to complete the quiz</li>
                    <li>• You can navigate between questions using the next/previous buttons</li>
                    <li>• Your results will be displayed at the end of the quiz</li>
                  </ul>
                </div>
                
                <button 
                  className="px-6 py-3 bg-quiz-primary text-white rounded-md hover:bg-indigo-600 transition-colors"
                  onClick={handleStartQuiz}
                >
                  Start Quiz
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Quiz header */}
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">
                {quiz.title}
              </h1>
            </div>
            
            {/* Timer */}
            <QuizTimer durationInMinutes={quiz.timeLimit} onTimeUp={handleTimeUp} />
            
            {/* Question */}
            <Card className="quiz-card">
              <CardContent className="pt-6 px-6 pb-6">
                <QuizQuestion 
                  question={questions[currentQuestionIndex]}
                  userAnswers={userAnswers}
                  setUserAnswer={handleSetUserAnswer}
                  onNextQuestion={handleNextQuestion}
                  onPreviousQuestion={handlePreviousQuestion}
                  isLastQuestion={currentQuestionIndex === questions.length - 1}
                  isFirstQuestion={currentQuestionIndex === 0}
                  currentQuestionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
