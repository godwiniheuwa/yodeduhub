
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import EditQuizPage from "./pages/EditQuizPage";
import QuestionsManagePage from "./pages/QuestionsManagePage";
import NotFound from "./pages/NotFound";

// Admin Pages
import ExamsPage from "./pages/admin/ExamsPage";
import CreateExamPage from "./pages/admin/CreateExamPage";
import EditExamPage from "./pages/admin/EditExamPage";
import SubjectsPage from "./pages/admin/SubjectsPage";
import YearsPage from "./pages/admin/YearsPage";
import StudentsPage from "./pages/admin/StudentsPage";
import TopPerformersPage from "./pages/admin/TopPerformersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/exams" element={<ExamsPage />} />
          <Route path="/admin/exams/new" element={<CreateExamPage />} />
          <Route path="/admin/exams/:examId/edit" element={<EditExamPage />} />
          <Route path="/admin/subjects" element={<SubjectsPage />} />
          <Route path="/admin/years" element={<YearsPage />} />
          <Route path="/admin/students" element={<StudentsPage />} />
          <Route path="/admin/top-performers" element={<TopPerformersPage />} />
          
          {/* Legacy Routes */}
          <Route path="/admin/quiz/new" element={<CreateQuizPage />} />
          <Route path="/admin/quiz/:quizId/edit" element={<EditQuizPage />} />
          <Route path="/admin/quiz/:quizId/questions" element={<QuestionsManagePage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/results/:quizId" element={<ResultsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
