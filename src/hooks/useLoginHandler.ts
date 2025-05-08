
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import { signIn } from "@/services/supabase/user";

export function useLoginHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      
      // Use the signIn function from user.ts
      const { user } = await signIn(email, password);
      
      if (!user) {
        throw new Error("Authentication failed");
      }
      
      // Get user's role from database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
      
      // Navigate based on role
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // For demo purposes, allow mock credentials to still work
      if (email === "student@example.com" && password === "password") {
        const mockUser = {
          id: "student-demo",
          name: "Demo Student",
          email: "student@example.com",
          role: "student"
        };
        localStorage.setItem("user", JSON.stringify(mockUser));
        
        toast({
          title: "Login successful",
          description: "Welcome back, Student! (Demo account)",
        });
        navigate("/dashboard");
      } else if (email === "admin@example.com" && password === "password") {
        const mockAdmin = {
          id: "admin-demo",
          name: "Demo Admin",
          email: "admin@example.com",
          role: "admin"
        };
        localStorage.setItem("user", JSON.stringify(mockAdmin));
        
        toast({
          title: "Login successful",
          description: "Welcome back, Admin! (Demo account)",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return { handleLogin, isLoading, setIsLoading };
}
