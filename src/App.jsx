import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login Page/index.jsx";
import Dashboard from "./pages/Dashboard Page/index.jsx";
import AssessmentPage from "./pages/Assesment Page/index.jsx";
import AssessmentResultPage from "./pages/Assessment Result/index.jsx";
import PastAssessmentsPage from "./pages/Past Assessment/index.jsx";
import AllUsersResultsPage from "./pages/All Users Result/index.jsx";
import AssessmentDetailPage from "./pages/Assesment Detail/index.jsx";
import LearningContentPage from "./pages/Learning Content/index.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/assessment-result" element={<AssessmentResultPage />} />
        <Route path="/past-assessments" element={<PastAssessmentsPage />} />
        <Route path="/all-users-results" element={<AllUsersResultsPage />} />
        <Route path="/assessment-detail" element={<AssessmentDetailPage />} />
        <Route path="/learning-content" element={<LearningContentPage />} />
      </Routes>
    </Router>
  );
}
