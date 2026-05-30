import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '../../features/auth/model/authStore';
import { Loader } from '../../shared/ui/Loader';
import { DashboardLayout } from '../../widgets/dashboard-layout/DashboardLayout';

export const ProtectedRoute = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (!isInitialized) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Enforce role-based routing
  if (user) {
    const path = location.pathname;

    if (user.role === 'user') {
      // Regular user is ONLY allowed /dashboard/docs
      if (path === '/dashboard' || path === '/dashboard/') {
        return <Navigate to="/dashboard/docs" replace />;
      }
      const allowedPaths = ['/dashboard/docs', '/dashboard/docs/'];
      if (!allowedPaths.includes(path)) {
        return <Navigate to="/dashboard/docs" replace />;
      }
    } else if (user.role === 'author') {
      // Author is allowed /dashboard, /dashboard/docs, /dashboard/blog*
      const isBlogPath = path.startsWith('/dashboard/blog');
      const allowedPaths = ['/dashboard', '/dashboard/', '/dashboard/docs', '/dashboard/docs/'];
      if (!isBlogPath && !allowedPaths.includes(path)) {
        return <Navigate to="/dashboard/blog" replace />;
      }
    }
  }

  return <DashboardLayout />;
};
