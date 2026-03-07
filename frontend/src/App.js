import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import SignUp from './pages/SignUp';
import OTPVerification from './pages/OtpVerification';
import Login from './pages/Login';
import Home from './pages/Home';
import SendMoney from './pages/SendMoney';
import TransactionHistory from './pages/TransactionHistory';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRequests from './pages/admin/AdminRequests';
import AdminHistory from './pages/admin/AdminHistory';
import AdminLayout from './components/AdminLayout';
import RequestMoney from './pages/RequestMoney';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';


// Auth Context — shared across the app
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

const MOCK_OTP = '123456';

function App() {
  const [authState, setAuthState] = useState(() => {
    const saved = localStorage.getItem('wallet_auth');
    return saved ? JSON.parse(saved) : {
      email: '',
      password: '',
      otp: MOCK_OTP,
      isSignedUp: false,
      isLoggedIn: false,
      currentUser: null,
      accountDetails: null,
    };
  });

  useEffect(() => {
    localStorage.setItem('wallet_auth', JSON.stringify(authState));
  }, [authState]);

  // Sync session across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'wallet_auth') {
        const newValue = e.newValue ? JSON.parse(e.newValue) : null;
        if (newValue) {
          setAuthState(newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState, MOCK_OTP }}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Routes */}
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/otp-verify" element={<OTPVerification />} />
          <Route path="/login-otp" element={<OTPVerification isLoginFlow />} />

          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/send" element={<ProtectedRoute><SendMoney /></ProtectedRoute>} />
          <Route path="/request" element={<ProtectedRoute><RequestMoney /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="history" element={<AdminHistory />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;