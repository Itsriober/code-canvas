import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import DashboardPage from './components/dashboard/DashboardPage';
import WorkspacePage from './components/workspace/WorkspacePage';
import Home from './pages/Home';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token, user, initializing } = useAuth();
  
  // Show loading state while initializing
  if (initializing) {
    return <div>Loading...</div>;
  }

  // Only redirect to login if we're sure there's no authentication
  if (!token || !user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children, allowAuthenticated = false }: { children: React.ReactNode, allowAuthenticated?: boolean }) {
  const { token, user } = useAuth();
  
  // Always render children if route allows authenticated users
  if (allowAuthenticated) return <>{children}</>;
  
  // For login/register routes, only redirect if we have both token and user
  if (token && user) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute allowAuthenticated={true}>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/workspace/:projectId"
            element={
              <PrivateRoute>
                <WorkspacePage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
