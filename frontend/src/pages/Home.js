import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { getBalance, getTransactionHistory } from '../api/walletApi';

const quickActions = [
    { icon: '💰', label: 'Add Money', color: 'blue', path: '/request' },
    { icon: '👁️', label: 'Balance', color: 'green', path: null, special: 'balance' },
    { icon: '📤', label: 'Amount Transfer', color: 'yellow', path: '/send' },
    { icon: '📊', label: 'Transaction History', color: 'orange', path: '/history' },
];

export default function Home() {
    const navigate = useNavigate();
    const { authState } = useAuth();
    const currentUser = authState.currentUser;

    const [balance, setBalance] = useState(currentUser?.walletBalance || 100);
    const [recentTxns, setRecentTxns] = useState([]);
    const [showBalance, setShowBalance] = useState(true);
    const [activeNav, setActiveNav] = useState('home');

    const displayName = currentUser?.name || authState.email?.split('@')[0] || 'User';
    const initials = displayName?.slice(0, 2).toUpperCase() || 'U';

    useEffect(() => {
        if (!currentUser?.id) return;
        getBalance(currentUser.id)
            .then(r => setBalance(r.balance))
            .catch(() => { });

        getTransactionHistory(currentUser.id)
            .then(txns => setRecentTxns(txns.slice(0, 5)))
            .catch(() => { });
    }, [currentUser]);

    const handleAction = (action) => {
        if (action.special === 'balance') {
            setShowBalance(v => !v);
            return;
        }
        if (action.path) {
            if (action.path === '/admin' && currentUser?.role !== 'ADMIN') {
                window.alert('🔒 Admin access only.');
                return;
            }
            navigate(action.path);
        } else {
            window.alert(`🚀 ${action.label} feature coming soon!`);
        }
    };

    const getTxnSign = (t) => {
        if (t.transactionType === 'CREDIT') return { label: '+₹', color: 'var(--secondary)', icon: '💰', bg: 'var(--primary-light)' };
        if (t.toUserId === currentUser?.id) return { label: '+₹', color: 'var(--secondary)', icon: '📥', bg: 'var(--primary-light)' };
        return { label: '-₹', color: 'var(--danger)', icon: '📤', bg: '#fee8e6' };
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            navigate('/login');
        }
    };

    return (
        <div className="home-container">
            {/* Header */}
            <div className="home-header">
                <div className="home-header-top">
                    <div>
                        <div className="user-greeting">Welcome 👋</div>
                        <div className="user-name">{displayName}</div>
                        {currentUser?.role === 'ADMIN' && (
                            <span className="status-pill" style={{ background: 'rgba(251,188,4,0.3)', color: '#fef08a' }}>
                                🛡️ ADMIN
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button onClick={handleLogout} className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px', borderColor: 'rgba(255,255,255,0.4)', color: '#fff', borderRadius: '8px' }}>Logout</button>
                        <div className="avatar" onClick={() => window.alert('Profile coming soon!')}>{initials}</div>
                    </div>
                </div>

                {/* Balance Card Section */}
                <div className="balance-card" onClick={() => setShowBalance(v => !v)} style={{ cursor: 'pointer' }}>
                    <div className="balance-label">Total Balance {showBalance ? '👁️' : '🙈'}</div>
                    <div className="balance-amount">
                        <span className="balance-currency">₹</span>
                        {showBalance ? balance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '••••••'}
                    </div>
                    <div className="balance-change">
                        Initial balance: ₹100.00
                    </div>
                </div>
            </div>

            {/* Main Options */}
            <div className="quick-actions" style={{ marginTop: '-40px', paddingBottom: '20px' }}>
                <div className="grid-2">
                    {quickActions.map((a) => (
                        <div key={a.label} className="action-btn card" onClick={() => handleAction(a)}
                            style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className={`action-icon ${a.color}`} style={{ fontSize: '28px', marginBottom: '8px' }}>{a.icon}</div>
                            <span className="action-label" style={{ fontWeight: '700' }}>{a.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="content-wrapper" style={{ paddingTop: '0' }}>
                <div className="section-title">Recent Activity</div>
                {recentTxns.length === 0 ? (
                    <div className="page-card" style={{ margin: '0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p>No transactions yet.</p>
                    </div>
                ) : (
                    <ul className="transaction-list page-card" style={{ margin: '0', padding: '8px 0' }}>
                        {recentTxns.map((t) => {
                            const { label, color, icon, bg } = getTxnSign(t);
                            return (
                                <li key={t.id} className="transaction-item" onClick={() => navigate('/history')}>
                                    <div className="transaction-avatar" style={{ background: bg }}>{icon}</div>
                                    <div className="transaction-info">
                                        <div className="transaction-name">{t.description || t.transactionType}</div>
                                        <div className="transaction-date">{new Date(t.createdAt).toLocaleDateString('en-IN', { month: 'short', day: '2-digit' })}</div>
                                    </div>
                                    <div className="transaction-amount" style={{ color }}>
                                        {label}{t.amount?.toLocaleString('en-IN')}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* Bottom Nav */}
            <nav className="bottom-nav">
                {[
                    { key: 'home', icon: '🏠', label: 'Home', action: () => setActiveNav('home') },
                    { key: 'history', icon: '📋', label: 'History', action: () => navigate('/history') },
                    { key: 'send', icon: '📤', label: 'Transfer', action: () => navigate('/send') },
                    { key: 'admin', icon: '🛡️', label: 'Admin', action: () => { if (currentUser?.role === 'ADMIN') navigate('/admin'); else window.alert('Admin only'); } },
                ].map((nav) => (
                    <div key={nav.key} className={`nav-item ${activeNav === nav.key ? 'active' : ''}`}
                        onClick={() => { setActiveNav(nav.key); nav.action(); }}>
                        <span className="nav-icon">{nav.icon}</span>
                        <span className="nav-label">{nav.label}</span>
                    </div>
                ))}
            </nav>
        </div>
    );
}