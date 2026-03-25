import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { requestAddMoney, getUserRequests } from '../api/walletApi';

export default function RequestMoney() {
    const navigate = useNavigate();
    const { authState } = useAuth();
    const currentUser = authState.currentUser;

    const [amount, setAmount] = useState('');
    const [myRequests, setMyRequests] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser?.id) {
            loadMyRequests();
        }
    }, [currentUser]);

    const loadMyRequests = async () => {
        try {
            const reqs = await getUserRequests(currentUser.id);
            setMyRequests(reqs.slice(0, 5));
        } catch (e) { }
    };

    const handleRequest = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError('Enter a valid amount.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        if (!currentUser?.id) {
            setError('Your session has expired. Please login again.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
        try {
            await requestAddMoney({ userId: currentUser.id, amount: Number(amount) });
            setSuccess(`✅ Request for ₹${amount} sent to Admin!`);
            setAmount('');
            loadMyRequests();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const quickAmounts = [500, 1000, 2000, 5000];

    return (
        <div className="home-container">
            <div className="home-header" style={{ paddingBottom: 40 }}>
                <div className="home-header-top">
                    <div>
                        <div className="user-greeting">Add Money</div>
                        <div className="user-name">Request from Admin</div>
                    </div>
                    <button onClick={() => navigate('/home')} className="btn-outline" style={{ padding: '8px 16px', color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '12px' }}>← Back</button>
                </div>
            </div>

            <div className="page-card">
                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg">{success}</div>}

                <form onSubmit={handleRequest}>
                    <div className="form-group">
                        <label>Amount to Request (₹)</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={{ fontSize: '18px', fontWeight: '600' }}
                        />
                    </div>

                    <div className="grid-2" style={{ marginTop: '15px' }}>
                        {quickAmounts.map(val => (
                            <button key={val} type="button" onClick={() => setAmount(val)} className="quick-amount-btn">+₹{val}</button>
                        ))}
                    </div>

                    <button disabled={loading} className="btn btn-primary" style={{ marginTop: '24px' }}>
                        {loading ? 'Submitting...' : 'Send Request to Admin'}
                    </button>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px', textAlign: 'center' }}>* Approved requests are credited instantly.</p>
                </form>

                <div style={{ marginTop: '40px' }}>
                    <h4 style={{ marginBottom: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Request History</h4>
                    {myRequests.length === 0 ? <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No requests yet.</p> : (
                        <div className="flex-column" style={{ gap: '10px' }}>
                            {myRequests.map(r => (
                                <div key={r.id} className="flex-between" style={{ padding: '12px 16px', background: 'var(--bg)', borderRadius: '12px' }}>
                                    <div className="flex-column">
                                        <div style={{ fontWeight: '700' }}>₹{r.amount.toLocaleString()}</div>
                                        <div className="transaction-date">{new Date(r.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <span className={`status-pill status-${r.status.toLowerCase()}`}>{r.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}