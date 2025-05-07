
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

type ResultSummaryProps = {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  quizTitle: string;
  timeTaken: string;
  onReviewAnswers: () => void;
};

export function ResultSummary({
  score,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  quizTitle,
  timeTaken,
  onReviewAnswers,
}: ResultSummaryProps) {
  const scorePercentage = Math.round((score / totalQuestions) * 100);
  
  const getScoreColor = () => {
    if (scorePercentage >= 80) return "text-green-500";
    if (scorePercentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getScoreMessage = () => {
    if (scorePercentage >= 80) return "Excellent job! You've mastered this material.";
    if (scorePercentage >= 60) return "Good effort! You're on the right track.";
    if (scorePercentage >= 40) return "You're making progress. Keep studying!";
    return "Keep practicing. You'll improve with more study.";
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">{quizTitle}</h2>
        <p className="text-muted-foreground">Your results summary</p>
      </div>
      
      <Card className="quiz-card">
        <CardHeader className="pb-2 text-center">
          <CardTitle>Your Score</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`text-5xl font-bold ${getScoreColor()}`}>
              {scorePercentage}%
            </div>
            <p className="text-center text-muted-foreground">
              {getScoreMessage()}
            </p>
            <Progress 
              value={scorePercentage} 
              className="w-full"
              indicatorClassName={scorePercentage >= 80 ? "bg-green-500" : 
                                 scorePercentage >= 60 ? "bg-yellow-500" : 
                                 "bg-red-500"}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-quiz-primary">{correctAnswers}</div>
              <p className="text-sm text-muted-foreground mt-2">Correct Answers</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500">{wrongAnswers}</div>
              <p className="text-sm text-muted-foreground mt-2">Wrong Answers</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold">{timeTaken}</div>
              <p className="text-sm text-muted-foreground mt-2">Time Taken</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          className="button-quiz-primary flex-1" 
          onClick={onReviewAnswers}
        >
          Review Answers
        </Button>
        <Button 
          variant="outline" 
          className="flex-1" 
          asChild
        >
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
