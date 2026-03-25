import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import SignUp from './pages/SignUp';
import OTPVerification from './pages/OtpVerification';
import Login from './pages/Login';
import Home from './pages/Home';
import SendMoney from './pages/SendMoney';
import TransactionHistory from './pages/TransactionHistory';
import AdminDashboard from './pages/AdminDashboard';
import RequestMoney from './pages/RequestMoney';


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

  return (
    <AuthContext.Provider value={{ authState, setAuthState, MOCK_OTP }}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp-verify" element={<OTPVerification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-otp" element={<OTPVerification isLoginFlow />} />
          <Route path="/home" element={authState.currentUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/send" element={authState.currentUser ? <SendMoney /> : <Navigate to="/login" />} />
          <Route path="/request" element={authState.currentUser ? <RequestMoney /> : <Navigate to="/login" />} />
          <Route path="/history" element={authState.currentUser ? <TransactionHistory /> : <Navigate to="/login" />} />
          <Route path="/admin" element={authState.currentUser?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;