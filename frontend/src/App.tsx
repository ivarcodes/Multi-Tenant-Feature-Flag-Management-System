import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { SuperAdminLogin } from './pages/super-admin/LoginPage';
import { OrganizationsPage } from './pages/super-admin/OrganizationsPage';
import { AdminLogin } from './pages/admin/LoginPage';
import { AdminSignup } from './pages/admin/SignupPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { UserLogin } from './pages/user/LoginPage';
import { UserSignup } from './pages/user/SignupPage';
import { CheckPage } from './pages/user/CheckPage';

const roles = [
  { href: '/super-admin/login', label: 'Super Admin', desc: 'Manage organizations', gradient: 'from-purple-600 to-indigo-600' },
  { href: '/admin/login', label: 'Admin', desc: 'Manage feature flags', gradient: 'from-blue-600 to-cyan-600' },
  { href: '/user/login', label: 'User', desc: 'Check feature flags', gradient: 'from-green-600 to-emerald-600' },
];

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/super-admin/organizations" element={<ProtectedRoute allowedRole="super_admin"><OrganizationsPage /></ProtectedRoute>} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><DashboardPage /></ProtectedRoute>} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/check" element={<ProtectedRoute allowedRole="user"><CheckPage /></ProtectedRoute>} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Feature Flag System
          </h1>
          <p className="text-gray-500 text-lg">Multi-tenant feature flag management platform</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {roles.map((r) => (
            <a key={r.href} href={r.href} className="group block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition transform hover:-translate-y-1">
              <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${r.gradient} mb-4`} />
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition">{r.label}</h2>
              <p className="text-sm text-gray-500 mt-1">{r.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
