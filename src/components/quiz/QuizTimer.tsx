
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

type QuizTimerProps = {
  durationInMinutes: number;
  onTimeUp: () => void;
};

export function QuizTimer({ durationInMinutes, onTimeUp }: QuizTimerProps) {
  // Convert minutes to milliseconds
  const totalTime = durationInMinutes * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isWarning, setIsWarning] = useState(false);
  const [isDanger, setIsDanger] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1000) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prevTimeLeft - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  useEffect(() => {
    const percentage = (timeLeft / totalTime) * 100;
    if (percentage <= 25) {
      setIsDanger(true);
    } else if (percentage <= 50) {
      setIsWarning(true);
    }
  }, [timeLeft, totalTime]);

  // Format time left as MM:SS
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / (60 * 1000));
    const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercentage = (timeLeft / totalTime) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">Time Remaining</div>
        <div
          className={`text-sm font-bold ${
            isDanger
              ? "text-red-500 animate-pulse"
              : isWarning
              ? "text-yellow-500"
              : ""
          }`}
        >
          {formatTimeLeft()}
        </div>
      </div>
      <Progress
        value={progressPercentage}
        className={`h-2 ${
          isDanger
            ? "bg-red-100 dark:bg-red-900/20"
            : isWarning
            ? "bg-yellow-100 dark:bg-yellow-900/20"
            : "bg-gray-100 dark:bg-gray-800"
        }`}
        indicatorClassName={`${
          isDanger
            ? "bg-red-500"
            : isWarning
            ? "bg-yellow-500"
            : "bg-quiz-primary"
        }`}
      />
    </div>
  );
}
