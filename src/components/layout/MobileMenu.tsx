
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type MobileMenuProps = {
  isLoggedIn: boolean;
  userRole?: 'student' | 'admin';
  onClose: () => void;
  onLogout?: () => void;
};

export function MobileMenu({ isLoggedIn, userRole, onClose, onLogout }: MobileMenuProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    onClose();
  };

  return (
    <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4">
      <nav className="flex flex-col space-y-4 px-4">
        <Link 
          to="/" 
          className="text-gray-700 dark:text-gray-300 hover:text-quiz-primary dark:hover:text-quiz-accent py-2"
          onClick={onClose}
        >
          Home
        </Link>
        {isLoggedIn && (
          <Link 
            to="/dashboard" 
            className="text-gray-700 dark:text-gray-300 hover:text-quiz-primary dark:hover:text-quiz-accent py-2"
            onClick={onClose}
          >
            Dashboard
          </Link>
        )}
        {isLoggedIn && userRole === 'admin' && (
          <Link 
            to="/admin" 
            className="text-gray-700 dark:text-gray-300 hover:text-quiz-primary dark:hover:text-quiz-accent py-2"
            onClick={onClose}
          >
            Admin
          </Link>
        )}
        <Link 
          to="/about" 
          className="text-gray-700 dark:text-gray-300 hover:text-quiz-primary dark:hover:text-quiz-accent py-2"
          onClick={onClose}
        >
          About
        </Link>
        {isLoggedIn ? (
          <>
            <Link 
              to="/profile" 
              className="text-gray-700 dark:text-gray-300 hover:text-quiz-primary dark:hover:text-quiz-accent py-2"
              onClick={onClose}
            >
              Profile
            </Link>
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="mt-2"
            >
              Log out
            </Button>
          </>
        ) : (
          <div className="flex flex-col space-y-4 pt-4">
            <Link 
              to="/login" 
              onClick={onClose}
            >
              <Button variant="outline" className="w-full">Log In</Button>
            </Link>
            <Link 
              to="/signup" 
              onClick={onClose}
            >
              <Button className="w-full">Sign Up</Button>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
