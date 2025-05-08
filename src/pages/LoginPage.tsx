
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { LoginForm } from "@/components/auth/LoginForm";
import { ConnectionStatus } from "@/components/auth/ConnectionStatus";
import { DemoAccounts } from "@/components/auth/DemoAccounts";
import { useSupabaseInit } from "@/hooks/useSupabaseInit";
import { useLoginHandler } from "@/hooks/useLoginHandler";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckIcon } from "lucide-react";

export default function LoginPage() {
  const { isLoading, supabaseConnected, databaseReady, setIsLoading } = useSupabaseInit();
  const { handleLogin } = useLoginHandler();
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user was just redirected from signup
    const wasSignupSuccessful = sessionStorage.getItem("signupSuccess") === "true";
    if (wasSignupSuccessful) {
      setSignupSuccess(true);
      // Clear the message so it doesn't show up on page refresh
      sessionStorage.removeItem("signupSuccess");
    }
  }, []);

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
              <ConnectionStatus 
                supabaseConnected={supabaseConnected} 
                databaseReady={databaseReady} 
              />
            </div>
            
            {signupSuccess && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Account created successfully! Please check your email to activate your account before logging in.
                </AlertDescription>
              </Alert>
            )}
            
            <LoginForm onLogin={handleLogin} isLoading={isLoading} />
          </div>
          
          <div className="hidden md:block w-full md:w-1/2">
            <DemoAccounts />
          </div>
        </div>
      </div>
    </Layout>
  );
}
