
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import EditQuizPage from "./pages/EditQuizPage";
import QuestionsManagePage from "./pages/QuestionsManagePage";
import ExamsPage from "./pages/admin/ExamsPage";
import YearsPage from "./pages/admin/YearsPage";
import SubjectsPage from "./pages/admin/SubjectsPage";
import TopPerformersPage from "./pages/admin/TopPerformersPage";
import StudentsPage from "./pages/admin/StudentsPage";
import CreateExamPage from "./pages/admin/CreateExamPage";
import EditExamPage from "./pages/admin/EditExamPage";
import ExamQuestionsPage from "./pages/admin/ExamQuestionsPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/exams" element={<ExamsPage />} />
      <Route path="/admin/exams/new" element={<CreateExamPage />} />
      <Route path="/admin/exams/:examId/edit" element={<EditExamPage />} />
      <Route path="/admin/exams/:examId/questions" element={<ExamQuestionsPage />} />
      <Route path="/admin/years" element={<YearsPage />} />
      <Route path="/admin/subjects" element={<SubjectsPage />} />
      <Route path="/admin/students" element={<StudentsPage />} />
      <Route path="/admin/top-performers" element={<TopPerformersPage />} />
      <Route path="/quiz/create" element={<CreateQuizPage />} />
      <Route path="/quiz/:quizId/edit" element={<EditQuizPage />} />
      <Route path="/quiz/:quizId/questions" element={<QuestionsManagePage />} />
      <Route path="/quiz/:quizId" element={<QuizPage />} />
      <Route path="/quiz/:quizId/results" element={<ResultsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
