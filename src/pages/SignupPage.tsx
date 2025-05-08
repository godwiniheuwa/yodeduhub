
import { Layout } from "@/components/layout/Layout";
import { SignupForm } from "@/components/auth/SignupForm";
import { SignupInfo } from "@/components/auth/SignupInfo";
import { useSignupHandler } from "@/hooks/useSignupHandler";

export default function SignupPage() {
  const { handleSignup, isLoading } = useSignupHandler();

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
          
          <SignupInfo />
        </div>
      </div>
    </Layout>
  );
}
