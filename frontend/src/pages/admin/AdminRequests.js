import React, { useState, useEffect } from 'react';
import { getPendingRequests, approveRequest, rejectRequest } from '../../api/walletApi';

export default function AdminRequests() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionMsg, setActionMsg] = useState('');

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const r = await getPendingRequests();
            setPendingRequests(r);
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
            loadRequests();
        } catch (e) {
            setError(e.message);
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectRequest(id);
            setActionMsg('❌ Request Rejected.');
            setTimeout(() => setActionMsg(''), 3000);
            loadRequests();
        } catch (e) {
            setError(e.message);
        }
    };

    if (loading) return <div>Loading requests...</div>;

    return (
        <div className="flex-column" style={{ gap: '15px' }}>
            {actionMsg && <div className="success-msg">{actionMsg}</div>}
            {error && <div className="error-msg">{error}</div>}

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
    );
}
