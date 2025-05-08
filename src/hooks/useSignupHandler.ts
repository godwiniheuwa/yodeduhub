
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { signUp } from "@/services/supabase/user";
import { setupExamTables } from "@/services/supabase/setupTables";
import { User } from "@/services/supabase/types"; 

export function useSignupHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (name: string, email: string, password: string, role: string) => {
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
      const userData = await signUp(email, password, { name, role: userRole });
      
      if (userData) {
        console.log('User created successfully:', userData);
        
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
        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
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
