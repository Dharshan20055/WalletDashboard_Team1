import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import SignUp from './pages/SignUp';
import OTPVerification from './pages/OTPVerification';
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
  const [authState, setAuthState] = useState({
    email: '',
    password: '',
    otp: MOCK_OTP,
    isSignedUp: false,
    isLoggedIn: false,
    currentUser: null,   // full user object from backend after login
    accountDetails: null,
  });

  return (
    <AuthContext.Provider value={{ authState, setAuthState, MOCK_OTP }}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp-verify" element={<OTPVerification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-otp" element={<OTPVerification isLoginFlow />} />
          <Route path="/home" element={<Home />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/request" element={<RequestMoney />} />
          <Route path="/history" element={<TransactionHistory />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;