import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';

// Landing
import LandingPage from '../pages/landing/LandingPage';

// Legal
import PrivacyPolicy from '../pages/legal/PrivacyPolicy';
import TermsOfService from '../pages/legal/TermsOfService';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import OnboardingPage from '../pages/onboarding/OnboardingPage';
import MentorOnboardingPage from '../pages/onboarding/MentorOnboardingPage';

// Main Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import SkillProfilePage from '../pages/skills/SkillProfilePage';
import ResourceLibraryPage from '../pages/resources/ResourceLibraryPage';
import LearningLogPage from '../pages/logs/LearningLogPage';
import MilestonesPage from '../pages/milestones/MilestonesPage';
import ProfilePage from '../pages/profile/ProfilePage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminSkillsPage from '../pages/admin/AdminSkillsPage';
import AdminResourcesPage from '../pages/admin/AdminResourcesPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import MentorManagementPage from '../pages/admin/MentorManagementPage';
import MentorDashboardPage from '../pages/mentor/MentorDashboardPage';
import LearnerProgressPage from '../pages/mentor/LearnerProgressPage';

// Misc
import NotFoundPage from '../pages/misc/NotFoundPage';

const AppRouter = () => {
  const { isAuthenticated, loading, user } = useAuth();

  // Wait for auth to initialize
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page - Public */}
        <Route path="/" element={
          isAuthenticated ? (
            <Navigate to={
              user?.role === 'admin' ? '/admin' :
              user?.role === 'mentor' ? '/mentor' :
              '/dashboard'
            } replace />
          ) : (
            <LandingPage />
          )
        } />

        {/* Legal Pages - Public */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Onboarding (Protected, separate layout) */}
        <Route 
          path="/onboarding" 
          element={
            isAuthenticated ? (
              user?.role === 'mentor' ? <MentorOnboardingPage /> : <OnboardingPage />
            ) : <Navigate to="/login" replace />
          }
        />

        {/* Protected Routes */}
        <Route 
          element={
            isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/skills" element={<SkillProfilePage />} />
          <Route path="/resources" element={<ResourceLibraryPage />} />
          <Route path="/logs" element={<LearningLogPage />} />
          <Route path="/milestones" element={<MilestonesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/skills" element={<AdminSkillsPage />} />
          <Route path="/admin/resources" element={<AdminResourcesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/mentors" element={<MentorManagementPage />} />
          <Route path="/mentor" element={<MentorDashboardPage />} />
          <Route path="/mentor/learner/:id" element={<LearnerProgressPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
