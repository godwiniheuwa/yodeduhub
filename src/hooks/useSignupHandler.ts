
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
      
      // Validate email format first
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format. Please provide a valid email address.");
      }
      
      // Cast the role to the correct type
      const userRole = (role === "admin" || role === "student" || role === "teacher") 
        ? role as User["role"]
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
      
      // Get a more user-friendly error message
      let errorMessage = "An error occurred during signup";
      
      if (error.code === "email_address_invalid") {
        errorMessage = "The email address format is invalid. Please provide a valid email.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading, setIsLoading };
}
