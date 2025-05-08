
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { signUp } from "@/services/supabase/user";
import { setupExamTables } from "@/services/supabase/setupTables";
import { User } from "@/services/supabase/types"; 

export function useSignupHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (name: string, email: string, password: string, role: string, username: string) => {
    setIsLoading(true);
    
    try {
      console.log('Starting signup process...');
      
      // Ensure tables exist first
      console.log('Setting up database tables...');
      await setupExamTables();
      
      // Cast the role to the correct type
      const userRole = (role === "admin" || role === "student" || role === "teacher") 
        ? role as User["role"]  // Cast to the union type if valid
        : "student"; // Default to student if input doesn't match expected values
      
      console.log(`Creating new user: ${email} with role: ${userRole}`);
      
      // Use the signUp function from user.ts with properly typed role
      const userData = await signUp(email, password, { 
        name, 
        role: userRole,
        username 
      });
      
      if (userData) {
        console.log('User created successfully:', userData);
        
        // Success message about email verification
        toast({
          title: "Account created",
          description: "Please check your email to activate your account.",
        });
        
        // Store a message in session storage for the login page
        sessionStorage.setItem("signupSuccess", "true");
        
        // Redirect to login page
        navigate("/login");
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading, setIsLoading };
}
