
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SignupForm } from "@/components/auth/SignupForm";
import { toast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    
    // Mock signup process - in a real app this would be an API call
    setTimeout(() => {
      toast({
        title: "Account created",
        description: `Welcome to YODEDUHUB, ${name}!`,
      });
      
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify({ 
        email, 
        role,
        name,
      }));
      
      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto py-12 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Join YODEDUHUB to start learning or create assessments
              </p>
            </div>
            <SignupForm onSignup={handleSignup} isLoading={isLoading} />
          </div>
          
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
        </div>
      </div>
    </Layout>
  );
}
