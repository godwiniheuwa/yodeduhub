
export function SignupInfo() {
  return (
    <div className="hidden md:block w-full md:w-1/2">
      <div className="rounded-lg overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80" 
          alt="Person using laptop" 
          className="w-full h-auto object-cover"
        />
      </div>
      
      <div className="mt-8 bg-quiz-light dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Why Join YODEDUHUB?</h3>
        <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
          <li>Access thousands of quizzes across various subjects</li>
          <li>Track your learning progress over time</li>
          <li>Prepare for exams with timed assessments</li>
          <li>Create custom quizzes as an administrator</li>
          <li>Get detailed feedback on your performance</li>
        </ul>
      </div>
    </div>
  );
}
