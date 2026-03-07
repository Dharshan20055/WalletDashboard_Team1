import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const MOCK_OTP = '123456';

export default function OTPVerification({ isLoginFlow = false }) {
    const navigate = useNavigate();
    const { setAuthState } = useAuth();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [showAccountDetails, setShowAccountDetails] = useState(false);

    const handleChange = (e, idx) => {
        const val = e.target.value.replace(/\D/g, '').slice(-1);
        const newOtp = [...otp];
        newOtp[idx] = val;
        setOtp(newOtp);
        setError('');
        if (val && idx < 5) {
            document.getElementById(`otp-${idx + 1}`)?.focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
            document.getElementById(`otp-${idx - 1}`)?.focus();
        }
    };

    const handleVerify = (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length < 6) {
            setError('Enter the complete 6-digit code.');
            return;
        }
        if (enteredOtp !== MOCK_OTP) {
            setError('Invalid code. Use 123456.');
            return;
        }

        if (isLoginFlow) {
            setAuthState(prev => ({ ...prev, isLoggedIn: true }));
            navigate('/home');
        } else {
            setShowAccountDetails(true);
        }
    };

    const handleResend = () => {
        setOtp(['', '', '', '', '', '']);
        setError('');
        window.alert(`🔐 New OTP: ${MOCK_OTP}`);
        document.getElementById('otp-0')?.focus();
    };

    return (
        <>
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-logo">
                        <div className="logo-icon">🔐</div>
                        <h1>WalletPay</h1>
                        <p>Secure verification</p>
                    </div>

                    <h2 className="auth-title">Verify OTP</h2>
                    <p className="auth-subtitle">Check your email for the 6-digit code.</p>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleVerify}>
                        <div className="otp-inputs">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    id={`otp-${idx}`}
                                    className="otp-input"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e, idx)}
                                    onKeyDown={(e) => handleKeyDown(e, idx)}
                                    style={{
                                        background: digit ? 'var(--primary-light)' : 'var(--bg)',
                                        borderColor: digit ? 'var(--primary)' : 'var(--border)'
                                    }}
                                />
                            ))}
                        </div>

                        <button type="submit" className="btn-primary">Verify & Continue</button>
                    </form>

                    <div className="resend-link">
                        Didn't receive it? <span onClick={handleResend}>Resend OTP</span>
                    </div>
                </div>
            </div>
            {showAccountDetails && <AccountDetailsModal onClose={() => navigate('/login')} />}
        </>
    );
}

function AccountDetailsModal({ onClose }) {
    const { setAuthState } = useAuth();
    const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', dob: '', gender: '', address: '', pin: '' });
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            if (!form.firstName || !form.lastName || !form.phone || !form.dob) return setError('Fill required fields.');

            // Age validation
            const birthDate = new Date(form.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 18) {
                return setError('18+ years required. Child is not allowed.');
            }

            setStep(2); return;
        }
        if (!form.address || !form.pin) return setError('Address & PIN required.');
        setAuthState(prev => ({ ...prev, accountDetails: form, isSignedUp: true }));
        window.alert('🎉 Account Ready! Please login.');
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <div className="modal-icon">👤</div>
                    <div>
                        <div className="modal-title">Account Details</div>
                        <div className="modal-subtitle">Step {step} of 2</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                    {[1, 2].map(s => (
                        <div key={s} style={{ flex: 1, height: 4, borderRadius: 4, background: s <= step ? 'var(--primary)' : 'var(--border)' }} />
                    ))}
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {step === 1 ? (
                        <>
                            <div className="grid-2">
                                <div className="form-group"><label>First Name*</label><input name="firstName" value={form.firstName} onChange={handleChange} /></div>
                                <div className="form-group"><label>Last Name*</label><input name="lastName" value={form.lastName} onChange={handleChange} /></div>
                            </div>
                            <div className="form-group"><label>Phone Number*</label><input name="phone" value={form.phone} onChange={handleChange} /></div>
                            <div className="grid-2">
                                <div className="form-group"><label>Date of Birth</label><input type="date" name="dob" maxLength={10} value={form.dob} onChange={handleChange} /></div>
                                <div className="form-group"><label>Gender</label>
                                    <select name="gender" value={form.gender} onChange={handleChange}><option value="">Select</option><option>Male</option><option>Female</option></select>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-group"><label>Address</label><input name="address" value={form.address} onChange={handleChange} /></div>
                            <div className="form-group"><label>6-Digit PIN*</label><input type="password" name="pin" maxLength={6} value={form.pin} onChange={handleChange} /></div>
                        </>
                    )}
                    <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>{step === 1 ? 'Continue' : 'Finish Setup'}</button>
                </form>
            </div>
        </div>
    );
}