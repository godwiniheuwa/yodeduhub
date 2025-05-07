
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SignupForm } from "@/components/auth/SignupForm";
import { toast } from "@/hooks/use-toast";
import { signUp } from "@/services/supabase/user";
import { setupExamTables } from "@/services/supabase/setupTables";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    
    try {
      // Ensure tables exist first
      await setupExamTables();
      
      // Use the signUp function from user.ts
      const userData = await signUp(email, password, { name, role });
      
      if (userData) {
        // Save user to localStorage for frontend session management
        localStorage.setItem("user", JSON.stringify({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        }));
        
        toast({
          title: "Account created",
          description: `Welcome to YODEDUHUB, ${name}!`,
        });
        
        // Redirect based on role
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
