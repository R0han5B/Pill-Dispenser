import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PatientManagement from './pages/patient-management';
import Login from './pages/login';
import MedicationSchedules from './pages/medication-schedules';
import Dashboard from './pages/dashboard';
import ActivityLog from './pages/activity-log';
import RegisterPage from './pages/register';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/patient-management" element={<PatientManagement />} />
        <Route path="/login" element={<Login />} />
        <Route path="/medication-schedules" element={<MedicationSchedules />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activity-log" element={<ActivityLog />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
