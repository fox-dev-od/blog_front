import { Navigate, createBrowserRouter } from 'react-router-dom';

import { ActivityLogsPage } from '../../pages/activity-logs/ActivityLogsPage';
import { BlacklistPage } from '../../pages/blacklist/BlacklistPage';
import { BlogPostEditorPage } from '../../pages/blog/BlogPostEditorPage';
import { BlogPostsPage } from '../../pages/blog/BlogPostsPage';
import { CaseCategoriesPage } from '../../pages/case-categories/CaseCategoriesPage';
import { CaseEditorPage } from '../../pages/cases/CaseEditorPage';
import { CasesPage } from '../../pages/cases/CasesPage';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { LoginPage } from '../../pages/login/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'blog', element: <BlogPostsPage /> },
      { path: 'blog/create', element: <BlogPostEditorPage /> },
      { path: 'blog/:id', element: <BlogPostEditorPage /> },
      { path: 'case-categories', element: <CaseCategoriesPage /> },
      { path: 'cases', element: <CasesPage /> },
      { path: 'cases/create', element: <CaseEditorPage /> },
      { path: 'cases/:id', element: <CaseEditorPage /> },
      { path: 'activity-logs', element: <ActivityLogsPage /> },
      { path: 'blacklist', element: <BlacklistPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
