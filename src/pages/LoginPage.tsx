
import { Layout } from "@/components/layout/Layout";
import { LoginForm } from "@/components/auth/LoginForm";
import { ConnectionStatus } from "@/components/auth/ConnectionStatus";
import { DemoAccounts } from "@/components/auth/DemoAccounts";
import { useSupabaseInit } from "@/hooks/useSupabaseInit";
import { useLoginHandler } from "@/hooks/useLoginHandler";

export default function LoginPage() {
  const { isLoading, supabaseConnected, databaseReady, setIsLoading } = useSupabaseInit();
  const { handleLogin } = useLoginHandler();

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
