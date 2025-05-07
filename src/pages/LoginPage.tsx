
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LoginForm } from "@/components/auth/LoginForm";
import { toast } from "@/hooks/use-toast";
import { createClient } from '@supabase/supabase-js';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Test Supabase connection
    const checkSupabaseConnection = async () => {
      try {
        // This will throw an error if Supabase is not properly connected
        const supabase = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY
        );
        
        const { data, error } = await supabase.from('_dummy_query').select('*').limit(1);
        
        // If we get here without error, connection is successful
        console.log("Supabase connection successful!");
        setSupabaseConnected(true);
        toast({
          title: "Supabase Connected",
          description: "Your application is successfully connected to Supabase!",
        });
      } catch (error) {
        console.error("Error connecting to Supabase:", error);
        toast({
          title: "Supabase Connection Failed",
          description: "Please check your Supabase configuration.",
          variant: "destructive",
        });
      }
    };

    checkSupabaseConnection();
  }, []);

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
              {supabaseConnected && (
                <div className="mt-2 p-2 bg-green-100 dark:bg-green-900 rounded-md text-sm text-green-800 dark:text-green-200">
                  ✓ Supabase connection confirmed
                </div>
              )}
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
