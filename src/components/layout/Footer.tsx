import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-quiz-primary to-quiz-secondary flex items-center justify-center">
                <span className="text-white font-bold">Y</span>
              </div>
              <span className="text-lg font-bold text-quiz-dark dark:text-white">
                YODEDUHUB
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Elevate your learning experience with our interactive quiz and exam platform.
              Create, take, and analyze assessments with ease.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-quiz-primary dark:hover:text-quiz-accent text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-quiz-primary dark:hover:text-quiz-accent text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-quiz-primary dark:hover:text-quiz-accent text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-quiz-primary dark:hover:text-quiz-accent text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-quiz-primary dark:hover:text-quiz-accent text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} YODEDUHUB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
