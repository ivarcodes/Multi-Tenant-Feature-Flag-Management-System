import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { SuperAdminLogin } from './pages/super-admin/LoginPage';
import { OrganizationsPage } from './pages/super-admin/OrganizationsPage';
import { AdminLogin } from './pages/admin/LoginPage';
import { AdminSignup } from './pages/admin/SignupPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { UserLogin } from './pages/user/LoginPage';
import { CheckPage } from './pages/user/CheckPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/super-admin/organizations" element={<ProtectedRoute allowedRole="super-admin"><OrganizationsPage /></ProtectedRoute>} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><DashboardPage /></ProtectedRoute>} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/check" element={<ProtectedRoute allowedRole="user"><CheckPage /></ProtectedRoute>} />
          <Route path="/" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-8">Feature Flag System</h1>
                <div className="space-y-4">
                  <a href="/super-admin/login" className="block px-8 py-3 bg-purple-600 text-white rounded hover:bg-purple-700">Super Admin</a>
                  <a href="/admin/login" className="block px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Admin</a>
                  <a href="/user/login" className="block px-8 py-3 bg-green-600 text-white rounded hover:bg-green-700">User</a>
                </div>
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
