import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/auth-provider';
import { Toaster } from './components/ui/toaster';
import LoginPage from './pages/login';
import DashboardLayout from './components/layout/dashboard-layout';
import DashboardPage from './pages/dashboard';
import OpeningPage from './pages/dashboard/opening';
import OperationsPage from './pages/dashboard/operations';
import ClosingPage from './pages/dashboard/closing';
import ReportsPage from './pages/dashboard/reports';
import UsersPage from './pages/dashboard/admin/users';
import StoresPage from './pages/dashboard/admin/stores';
import RootPage from './pages/root';

function App() {

  console.log('API_BASE_URL set to:', import.meta.env.VITE_API_URL )
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/opening"
            element={
              <DashboardLayout>
                <OpeningPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/operations"
            element={
              <DashboardLayout>
                <OperationsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/closing"
            element={
              <DashboardLayout>
                <ClosingPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/reports"
            element={
              <DashboardLayout>
                <ReportsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/admin/users"
            element={
              <DashboardLayout>
                <UsersPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/dashboard/admin/stores"
            element={
              <DashboardLayout>
                <StoresPage />
              </DashboardLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

