import React, { useState, useEffect } from 'react';
import { getAllTransactions } from '../../api/walletApi';

export default function AdminHistory() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const t = await getAllTransactions();
            setTransactions(t);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading history...</div>;

    return (
        <div className="flex-column" style={{ gap: '15px' }}>
            <h3 className="section-title">Global Transaction History</h3>
            {error && <div className="error-msg">{error}</div>}

            <div className="page-card" style={{ margin: '0', padding: '10px' }}>
                {transactions.length === 0 ? <p className="transaction-date">No transactions found.</p> : transactions.slice(0, 100).map(t => (
                    <div key={t.id} className="flex-between" style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
                        <div className="flex-column">
                            <span style={{ fontWeight: '600' }}>{t.transactionType}</span>
                            <span className="transaction-date">
                                {t.fromUserId ? `From: ${t.fromUserId}` : ''}
                                {t.toUserId ? ` To: ${t.toUserId}` : ''}
                            </span>
                        </div>
                        <div className="flex-column" style={{ alignItems: 'flex-end' }}>
                            <span style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{t.amount}</span>
                            <span className="transaction-date">{new Date(t.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
