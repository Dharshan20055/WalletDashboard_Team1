import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { getTransactionHistory, getBalance } from '../api/walletApi';

export default function TransactionHistory() {
    const navigate = useNavigate();
    const { authState } = useAuth();
    const currentUser = authState.currentUser;

    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('ALL'); // ALL, CREDIT, DEBIT, TRANSFER
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (currentUser?.id) {
            loadData();
        }
    }, [currentUser]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [history, balData] = await Promise.all([
                getTransactionHistory(currentUser.id),
                getBalance(currentUser.id)
            ]);
            setTransactions(history);
            setBalance(balData.balance);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredTxns = transactions.filter(t => {
        if (filter === 'ALL') return true;
        return t.transactionType === filter;
    });

    const getTxnSign = (t) => {
        if (t.transactionType === 'CREDIT') return { label: '+₹', color: 'var(--secondary)', icon: '💰', bg: 'var(--primary-light)' };
        if (t.toUserId === currentUser?.id) return { label: '+₹', color: 'var(--secondary)', icon: '📥', bg: 'var(--primary-light)' };
        return { label: '-₹', color: 'var(--danger)', icon: '📤', bg: '#fee8e6' };
    };

    return (
        <div className="home-container">
            <div className="home-header" style={{ paddingBottom: 40 }}>
                <div className="home-header-top">
                    <div className="flex-column">
                        <div className="user-greeting">Activity Log</div>
                        <div className="user-name">Transactions</div>
                    </div>
                    <button onClick={() => navigate('/home')} className="btn-outline" style={{ padding: '8px 16px', color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '12px' }}>← Back</button>
                </div>
                <div className="balance-card" style={{ marginTop: '20px' }}>
                    <div className="flex-between">
                        <div className="flex-column">
                            <div className="balance-label">Available Balance</div>
                            <div className="balance-amount" style={{ fontSize: '28px' }}>₹{balance.toLocaleString()}</div>
                        </div>
                        <div className="avatar" style={{ background: 'rgba(255,255,255,0.2)' }}>📈</div>
                    </div>
                </div>
            </div>

            <div className="page-card">
                <div className="flex-between" style={{ marginBottom: '20px', overflowX: 'auto', gap: '8px', paddingBottom: '5px' }}>
                    {['ALL', 'CREDIT', 'TRANSFER'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`status-pill ${filter === f ? 'status-approved' : ''}`}
                            style={{ border: filter === f ? 'none' : '1px solid var(--border)', cursor: 'pointer', background: filter === f ? 'var(--primary)' : 'transparent', color: filter === f ? '#fff' : 'var(--text-secondary)' }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', margin: '40px 0', color: 'var(--text-secondary)' }}>Loading transactions...</p>
                ) : filteredTxns.length === 0 ? (
                    <p style={{ textAlign: 'center', margin: '40px 0', color: 'var(--text-secondary)' }}>No transactions found.</p>
                ) : (
                    <ul className="transaction-list">
                        {filteredTxns.map((t) => {
                            const { label, color, icon, bg } = getTxnSign(t);
                            return (
                                <li key={t.id} className="transaction-item">
                                    <div className="transaction-avatar" style={{ background: bg }}>{icon}</div>
                                    <div className="transaction-info">
                                        <div className="transaction-name">{t.description || t.transactionType}</div>
                                        <div className="transaction-date">{new Date(t.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div className="transaction-amount" style={{ color }}>
                                        {label}{t.amount.toLocaleString()}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}