import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { getAllUsers, getAllTransactions, freezeUser, unfreezeUser, getPendingRequests, approveRequest, rejectRequest, getMonthlySummary } from '../api/walletApi';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { authState } = useAuth();
    const currentUser = authState.currentUser;

    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [monthly, setMonthly] = useState({});
    const [tab, setTab] = useState('requests'); // default to pending requests
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionMsg, setActionMsg] = useState('');

    useEffect(() => {
        if (currentUser?.role !== 'ADMIN') {
            navigate('/home');
            return;
        }
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [u, t, r, m] = await Promise.all([getAllUsers(), getAllTransactions(), getPendingRequests(), getMonthlySummary()]);
            setUsers(u);
            setTransactions(t);
            setPendingRequests(r);
            setMonthly(m);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveRequest(id);
            setActionMsg('✅ Request Approved!');
            setTimeout(() => setActionMsg(''), 3000);
            loadData();
        } catch (e) {
            setError(e.message);
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectRequest(id);
            setActionMsg('❌ Request Rejected.');
            setTimeout(() => setActionMsg(''), 3000);
            loadData();
        } catch (e) {
            setError(e.message);
        }
    };

    const handleFreezeToggle = async (user) => {
        try {
            if (user.frozen) await unfreezeUser(user.id);
            else await freezeUser(user.id);
            loadData();
        } catch (e) { setError(e.message); }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            navigate('/login');
        }
    };

    if (currentUser?.role !== 'ADMIN') return null;

    return (
        <div className="home-container">
            <div className="home-header" style={{ paddingBottom: 40 }}>
                <div className="home-header-top">
                    <div className="flex-column">
                        <div className="user-greeting">Admin Panel 🛡️</div>
                        <div className="user-name">Management Console</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => navigate('/home')} className="btn-outline" style={{ padding: '8px 16px', color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '12px' }}>Home</button>
                        <button onClick={handleLogout} className="btn-outline" style={{ padding: '8px 16px', color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '12px' }}>Logout</button>
                    </div>
                </div>
            </div>

            <div className="admin-tabs">
                {['requests', 'users', 'transactions', 'stats'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`admin-tab-btn ${tab === t ? 'active' : ''}`}>
                        {t}
                    </button>
                ))}
            </div>

            <div className="content-wrapper" style={{ padding: '20px' }}>
                {actionMsg && <div className="success-msg">{actionMsg}</div>}
                {error && <div className="error-msg">{error}</div>}

                {tab === 'requests' && (
                    <div className="flex-column" style={{ gap: '15px' }}>
                        <h3 className="section-title">Pending Wallet Requests ({pendingRequests.length})</h3>
                        {pendingRequests.length === 0 ? <p className="transaction-date">No pending requests.</p> : (
                            <div className="flex-column" style={{ gap: '12px' }}>
                                {pendingRequests.map(r => (
                                    <div key={r.id} className="page-card flex-between" style={{ margin: '0', padding: '16px' }}>
                                        <div className="flex-column">
                                            <div style={{ fontWeight: '700' }}>{r.userName}</div>
                                            <div className="transaction-date">Requesting ₹{r.amount}</div>
                                        </div>
                                        <div className="flex-between" style={{ gap: '8px' }}>
                                            <button onClick={() => handleApprove(r.id)} className="status-pill status-approved" style={{ border: 'none', cursor: 'pointer' }}>Approve</button>
                                            <button onClick={() => handleReject(r.id)} className="status-pill status-rejected" style={{ border: 'none', cursor: 'pointer' }}>Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {tab === 'users' && (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Balance</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.name} <br /><span className="transaction-date">{u.email}</span></td>
                                        <td>₹{u.walletBalance}</td>
                                        <td>
                                            <button onClick={() => handleFreezeToggle(u)} className={`status-pill ${u.frozen ? 'status-approved' : 'status-rejected'}`} style={{ border: 'none', cursor: 'pointer' }}>
                                                {u.frozen ? 'Unfreeze' : 'Freeze'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'transactions' && (
                    <div className="page-card" style={{ margin: '0', padding: '10px' }}>
                        {transactions.slice(0, 50).map(t => (
                            <div key={t.id} className="flex-between" style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
                                <div className="flex-column">
                                    <span style={{ fontWeight: '600' }}>{t.transactionType}</span>
                                    <span className="transaction-date">₹{t.amount}</span>
                                </div>
                                <span className="transaction-date">{new Date(t.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'stats' && (
                    <div className="page-card" style={{ margin: '0', padding: '20px' }}>
                        <h4 className="section-title">Monthly Summary</h4>
                        {Object.entries(monthly).map(([month, data]) => (
                            <div key={month} className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ fontWeight: '500' }}>{month}</span>
                                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{data.totalAmount}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}