
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LoginForm } from "@/components/auth/LoginForm";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    setIsLoading(true);
    
    // Mock login process - in a real app this would be an API call
    setTimeout(() => {
      // Mock credentials for demo
      if (email === "student@example.com" && password === "password") {
        toast({
          title: "Login successful",
          description: "Welcome back, Student!",
        });
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify({ 
          email,
          role: "student",
          name: "John Student",
        }));
        navigate("/dashboard");
      } else if (email === "admin@example.com" && password === "password") {
        toast({
          title: "Login successful",
          description: "Welcome back, Admin!",
        });
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify({ 
          email, 
          role: "admin",
          name: "Jane Admin",
        }));
        navigate("/admin");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try student@example.com / password or admin@example.com / password",
          variant: "destructive",
        });
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
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Log in to your account to continue your learning journey
              </p>
            </div>
            <LoginForm onLogin={handleLogin} isLoading={isLoading} />
          </div>
          
          <div className="hidden md:block w-full md:w-1/2">
            <div className="bg-quiz-light dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Demo Accounts</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
                  <p className="font-medium">Student Account</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email: student@example.com</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Password: password</p>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
                  <p className="font-medium">Admin Account</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email: admin@example.com</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Password: password</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
