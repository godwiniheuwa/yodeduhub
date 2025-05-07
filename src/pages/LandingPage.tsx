
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-24 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm">
                Simple. Powerful. Effective.
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Learn Faster with Interactive Quizzes
              </h1>
              <p className="text-gray-500 dark:text-gray-400 md:text-xl">
                YODEDUHUB helps students master any subject through engaging quizzes and detailed analytics. 
                Teachers can create custom assessments in minutes.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link to="/signup">
                  <Button className="button-quiz-primary px-8 py-6 text-base">
                    Get Started for Free
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="px-8 py-6 text-base">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80" 
                alt="Student taking quiz on laptop" 
                className="mx-auto object-cover rounded-lg aspect-video overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg" 
                width={600} 
                height={400} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl font-bold mb-4">Features Designed for Modern Learning</h2>
            <p className="text-gray-500 dark:text-gray-400 md:text-lg max-w-3xl mx-auto">
              Our platform combines powerful assessment tools with an intuitive interface to make 
              learning and teaching more effective.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col p-6 space-y-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-2 bg-quiz-light dark:bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-quiz-primary">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Interactive Quizzes</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Engage with MCQs, timed quizzes, and instant feedback to enhance your learning experience.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col p-6 space-y-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-2 bg-quiz-light dark:bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-quiz-primary">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Detailed Analytics</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Track your progress with comprehensive performance metrics and identify areas for improvement.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col p-6 space-y-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-2 bg-quiz-light dark:bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-quiz-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Secure Platform</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Our platform ensures your data is protected and provides a safe environment for learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-gradient-to-r from-quiz-primary to-quiz-secondary">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">Ready to Start Learning?</h2>
            <p className="text-white/80 md:text-lg">
              Join thousands of students and educators who are already using YODEDUHUB to enhance their learning experience.
            </p>
            <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center">
              <Link to="/signup">
                <Button className="bg-white text-quiz-primary hover:bg-gray-100 px-8 py-6 text-base">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-base">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
