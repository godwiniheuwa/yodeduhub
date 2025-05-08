
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

type LoginFormProps = {
  onLogin: (identifier: string, password: string) => void;
  isLoading?: boolean;
};

export function LoginForm({ onLogin, isLoading = false }: LoginFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{identifier?: string; password?: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {identifier?: string; password?: string} = {};
    
    if (!identifier) {
      newErrors.identifier = "Username or email is required";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onLogin(identifier, password);
    } else {
      toast({
        title: "Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Username or Email</Label>
            <Input
              id="identifier"
              type="text"
              placeholder="username or email@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isLoading}
              aria-invalid={errors.identifier ? "true" : "false"}
            />
            {errors.identifier && <p className="text-sm text-destructive">{errors.identifier}</p>}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link 
                to="/forgot-password" 
                className="text-xs text-quiz-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full button-quiz-primary" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-quiz-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
