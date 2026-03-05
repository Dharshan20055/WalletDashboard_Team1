import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { transferMoney, getAllUsers } from '../api/walletApi';

export default function SendMoney() {
    const navigate = useNavigate();
    const { authState, setAuthState } = useAuth();
    const currentUser = authState.currentUser;

    const [form, setForm] = useState({ toEmail: '', amount: '', description: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!form.toEmail || !form.amount) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            const users = await getAllUsers();
            const receiver = users.find(u => u.email.toLowerCase() === form.toEmail.toLowerCase());
            if (!receiver) {
                setError('No user found with that email.');
                setLoading(false);
                return;
            }

            await transferMoney({
                fromUserId: currentUser?.id,
                toUserId: receiver.id,
                amount: Number(form.amount),
                description: form.description || 'Transfer',
            });

            setSuccess(`✅ ₹${form.amount} sent to ${receiver.name} successfully!`);
            setForm({ toEmail: '', amount: '', description: '' });
            // Update local balance
            const newBal = (currentUser.walletBalance || 100) - Number(form.amount);
            setAuthState(prev => ({ ...prev, currentUser: { ...prev.currentUser, walletBalance: newBal } }));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            <div className="home-header" style={{ paddingBottom: 40 }}>
                <div className="home-header-top">
                    <div className="flex-column">
                        <div className="user-greeting">Transfer</div>
                        <div className="user-name">Send Money Fast</div>
                    </div>
                    <button onClick={() => navigate('/home')} className="btn-outline" style={{ padding: '8px 16px', color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '12px' }}>← Back</button>
                </div>
                <div className="balance-card" style={{ marginTop: '20px' }}>
                    <div className="balance-label">Current Balance</div>
                    <div className="balance-amount">₹{currentUser?.walletBalance?.toLocaleString()}</div>
                </div>
            </div>

            <div className="page-card">
                <h3 className="section-title">Recipient Details</h3>

                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg">{success}</div>}

                <form onSubmit={handleSend}>
                    <div className="form-group">
                        <label>Receiver Email</label>
                        <input
                            name="toEmail"
                            type="email"
                            placeholder="friend@example.com"
                            value={form.toEmail}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Amount (₹)</label>
                        <input
                            name="amount"
                            type="number"
                            placeholder="0.00"
                            value={form.amount}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <input
                            name="description"
                            type="text"
                            placeholder="What's this for?"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>
                    <button disabled={loading} className="btn-primary" style={{ marginTop: '20px' }}>
                        {loading ? 'Processing...' : 'Send Money Now'}
                    </button>
                </form>
            </div>
        </div>
    );
}