import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login Page/index.jsx";
import Dashboard from "./pages/Dashboard Page/index.jsx";
import AssessmentPage from "./pages/Assesment Page/index.jsx";
import AssessmentResultPage from "./pages/Assessment Result/index.jsx";
import PastAssessmentsPage from "./pages/Past Assessment/index.jsx";
import AllUsersResultsPage from "./pages/All Users Result/index.jsx";
import AssessmentDetailPage from "./pages/Assesment Detail/index.jsx";
import LearningContentPage from "./pages/Learning Content/index.jsx";
import CompleteProfilePage from "./pages/CompleteProfilePage/index.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import ProfilePage from "./pages/Profile Page/index.jsx";
import EditProfilePage from "./pages/Edit Profile Page/index.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <AssessmentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessment-result"
          element={
            <ProtectedRoute>
              <AssessmentResultPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/past-assessments"
          element={
            <ProtectedRoute>
              <PastAssessmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-users-results"
          element={
            <ProtectedRoute>
              <AllUsersResultsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessment-detail"
          element={
            <ProtectedRoute>
              <AssessmentDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning-content"
          element={
            <ProtectedRoute>
              <LearningContentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />


      </Routes>
    </Router>
  );
}
