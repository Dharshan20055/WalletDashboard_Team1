import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { registerUser } from '../api/walletApi';

const MOCK_OTP = '123456';

export default function SignUp() {
    const navigate = useNavigate();
    const { setAuthState } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError('Please fill all fields.');
            return;
        }

        try {
            await registerUser({ name: form.email.split('@')[0], email: form.email, password: form.password, role: 'USER' });
            setAuthState(prev => ({ ...prev, email: form.email, password: form.password, isSignedUp: true }));
            window.alert(`📩 Sign Up OTP: ${MOCK_OTP}`);
            navigate('/otp-verify');
        } catch (err) {
            setAuthState(prev => ({ ...prev, email: form.email, password: form.password, isSignedUp: true }));
            window.alert(`📩 Sign Up OTP: ${MOCK_OTP}`);
            navigate('/otp-verify');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Join us and start managing your funds.</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input name="email" type="email" placeholder="name@email.com" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
                    </div>
                    <button className="btn-primary">Sign Up</button>
                </form>
                <div className="auth-link">
                    Already have an account? <a onClick={() => navigate('/login')}>Sign In</a>
                </div>
            </div>
        </div>
    );
}