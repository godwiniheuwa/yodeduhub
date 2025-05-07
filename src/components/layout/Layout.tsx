
import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

type LayoutProps = {
  children: ReactNode;
  isLoggedIn?: boolean;
  userRole?: 'student' | 'admin';
  userInitials?: string;
  onLogout?: () => void;
};

export function Layout({ 
  children, 
  isLoggedIn = false, 
  userRole = 'student', 
  userInitials = 'U',
  onLogout = () => {}
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        isLoggedIn={isLoggedIn} 
        userRole={userRole}
        userInitials={userInitials}
        onLogout={onLogout}
      />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
      <Footer />
    </div>
  );
}
