import { Navigate } from 'react-router-dom';

import { useAuthStore } from '../../features/auth/model/authStore';
import { DashboardLayout } from '../../widgets/dashboard-layout/DashboardLayout';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout />;
};
