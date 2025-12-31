import React from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PatientManagement from "./pages/patient-management";
import Login from "./pages/login";
import MedicationSchedules from "./pages/medication-schedules";
import Dashboard from "./pages/dashboard";
import ActivityLog from "./pages/activity-log";
import RegisterPage from "./pages/register";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import { supabase } from "./lib/supabaseClient";

// ✅ Protect routes – only logged-in users can view them
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// ✅ Full logout handler that redirects correctly
const Logout = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const doLogout = async () => {
      try {
        await supabase.auth.signOut();
        localStorage.clear(); // clear any session cache
        navigate("/login", { replace: true });
      } catch (err) {
        console.error("Logout error:", err.message);
      }
    };
    doLogout();
  }, [navigate]);

  return (
    <div className="p-8 text-center text-gray-500">Logging out...</div>
  );
};

const Routes = ({ user }) => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public routes */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/register"
            element={!user ? <RegisterPage /> : <Navigate to="/dashboard" replace />}
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-management"
            element={
              <ProtectedRoute user={user}>
                <PatientManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medication-schedules"
            element={
              <ProtectedRoute user={user}>
                <MedicationSchedules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity-log"
            element={
              <ProtectedRoute user={user}>
                <ActivityLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute user={user}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* ✅ Logout route */}
          <Route path="/logout" element={<Logout />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;