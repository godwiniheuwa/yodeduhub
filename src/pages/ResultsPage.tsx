
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ResultSummary } from "@/components/quiz/ResultSummary";
import { QuizQuestion, Question } from "@/components/quiz/QuizQuestion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { mockQuizzes, mockQuestions } from "@/utils/mockData";

export default function ResultsPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const [user, setUser] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewMode, setReviewMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast({
        title: "Please log in",
        description: "You must be logged in to view results",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(storedUser));
    
    // Get quiz results (in a real app this would be an API call)
    const quizResults = JSON.parse(localStorage.getItem("quizResults") || "{}");
    const result = quizResults[quizId!];
    
    if (!result) {
      toast({
        title: "Results not found",
        description: "No results found for this quiz",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }
    
    // Find the quiz
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
    
    // Get questions for this quiz
    const quizQuestions = mockQuestions.filter(q => q.quizId === quizId);
    
    setQuiz(foundQuiz);
    setQuestions(quizQuestions);
    setResults(result);
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

  const handleReviewAnswers = () => {
    setReviewMode(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setReviewMode(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTimeTaken = () => {
    // Mock time taken for demo
    const minutes = Math.floor(quiz.timeLimit * 0.6);
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">Loading results...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!quiz || !results || !user) return null;

  // Add correctOptionId to questions for review mode
  const reviewQuestions = questions.map(q => ({
    ...q,
    correctOptionId: q.correctOptionId,
  }));

  return (
    <Layout 
      isLoggedIn={true} 
      userRole={user.role} 
      userInitials={user.name.charAt(0)}
      onLogout={handleLogout}
    >
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {!reviewMode ? (
          <ResultSummary 
            score={results.score}
            totalQuestions={results.totalQuestions}
            correctAnswers={results.correctAnswers}
            wrongAnswers={results.totalQuestions - results.correctAnswers}
            quizTitle={quiz.title}
            timeTaken={formatTimeTaken()}
            onReviewAnswers={handleReviewAnswers}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Review Answers</h1>
              <Button 
                variant="outline" 
                onClick={() => setReviewMode(false)}
              >
                Back to Summary
              </Button>
            </div>
            
            <Card className="quiz-card">
              <CardContent className="pt-6 px-6 pb-6">
                <QuizQuestion 
                  question={reviewQuestions[currentQuestionIndex]}
                  selectedOptionId={results.answers[reviewQuestions[currentQuestionIndex].id] || null}
                  onOptionSelect={() => {}}
                  onNextQuestion={handleNextQuestion}
                  onPreviousQuestion={handlePreviousQuestion}
                  isLastQuestion={currentQuestionIndex === reviewQuestions.length - 1}
                  isFirstQuestion={currentQuestionIndex === 0}
                  currentQuestionNumber={currentQuestionIndex + 1}
                  totalQuestions={reviewQuestions.length}
                  isReviewMode={true}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
