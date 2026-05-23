import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthStore } from '../../features/auth/model/authStore';
import { Loader } from '../../shared/ui/Loader';
import { DashboardLayout } from '../../widgets/dashboard-layout/DashboardLayout';

export const ProtectedRoute = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (!isInitialized) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout />;
};
