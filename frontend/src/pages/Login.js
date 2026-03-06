import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { loginUser } from '../api/walletApi';

const MOCK_OTP = '123456';
const ADMIN_EMAIL = 'admin@wallet.com';
const ADMIN_PASS = 'admin123';

export default function Login() {
    const navigate = useNavigate();
    const { authState, setAuthState } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError('Enter email and password.');
            return;
        }

        if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASS) {
            const adminUser = { id: 0, name: 'System Admin', email: ADMIN_EMAIL, role: 'ADMIN', walletBalance: 999999 };
            setAuthState(prev => ({ ...prev, email: form.email, currentUser: adminUser, isLoggedIn: true }));
            navigate('/admin');
            return;
        }

        setLoading(true);
        try {
            const user = await loginUser({ email: form.email, password: form.password });
            setAuthState(prev => ({ ...prev, email: form.email, currentUser: user }));

            if (user.role === 'ADMIN') {
                setAuthState(prev => ({ ...prev, isLoggedIn: true }));
                navigate('/admin');
            } else {
                window.alert(`🔐 Login OTP: ${MOCK_OTP}`);
                navigate('/login-otp');
            }
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Sign In</h2>
                <p className="auth-subtitle">Welcome back to your wallet.</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" placeholder="name@email.com" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
                    </div>
                    <button disabled={loading} className="btn-primary">
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>
                <div className="auth-link">
                    Don't have an account? <a onClick={() => navigate('/signup')}>Sign Up</a>
                </div>
            </div>
        </div>
    );
}