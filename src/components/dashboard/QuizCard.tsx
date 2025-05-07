
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

type QuizCardProps = {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  timeLimit: number;
  category: string;
  attempted?: boolean;
  score?: number;
};

export function QuizCard({
  id,
  title,
  description,
  questionsCount,
  timeLimit,
  category,
  attempted = false,
  score,
}: QuizCardProps) {
  return (
    <Card className="quiz-card overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge className="bg-quiz-secondary hover:bg-quiz-secondary">
            {category}
          </Badge>
          {attempted && score !== undefined && (
            <div className="flex flex-col items-end">
              <Badge variant={score >= 70 ? "default" : "outline"}>
                Score: {score}%
              </Badge>
            </div>
          )}
        </div>
        <CardTitle className="text-xl mt-2">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path d="M3.5 2A1.5 1.5 0 002 3.5V5c0 1.149.15 2.263.43 3.326a13.022 13.022 0 009.244 9.244c1.063.28 2.177.43 3.326.43h1.5a1.5 1.5 0 001.5-1.5v-1.148a1.5 1.5 0 00-1.175-1.465l-3.223-.716a1.5 1.5 0 00-1.767 1.052l-.267.933c-.117.41-.555.643-.95.48a11.542 11.542 0 01-6.254-6.254c-.163-.395.07-.833.48-.95l.933-.267a1.5 1.5 0 001.052-1.767l-.716-3.223A1.5 1.5 0 004.648 2H3.5zM16.5 4.56l-3.22 3.22a.75.75 0 11-1.06-1.06l3.22-3.22h-2.69a.75.75 0 010-1.5h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V4.56z" />
            </svg>
            {timeLimit} min
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {questionsCount} questions
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {attempted ? (
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="outline" asChild>
              <Link to={`/results/${id}`}>View Results</Link>
            </Button>
            <Button className="button-quiz-primary" asChild>
              <Link to={`/quiz/${id}`}>Retry</Link>
            </Button>
          </div>
        ) : (
          <Button className="button-quiz-primary w-full" asChild>
            <Link to={`/quiz/${id}`}>Start Quiz</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
