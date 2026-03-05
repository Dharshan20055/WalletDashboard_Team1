const BASE_URL = 'http://localhost:8080/api';

// --- Helper ---
async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
}

// --- User APIs ---
export const registerUser = (body) =>
    request('/users/register', { method: 'POST', body: JSON.stringify(body) });

export const loginUser = (body) =>
    request('/users/login', { method: 'POST', body: JSON.stringify(body) });

export const getAllUsers = () => request('/users');

export const freezeUser = (userId) =>
    request(`/users/${userId}/freeze`, { method: 'PATCH' });

export const unfreezeUser = (userId) =>
    request(`/users/${userId}/unfreeze`, { method: 'PATCH' });

// --- Wallet APIs ---
export const getBalance = (userId) => request(`/wallet/balance/${userId}`);

// New: Request Add Money (Admin Approval Flow)
export const requestAddMoney = (body) =>
    request('/wallet/request-add', { method: 'POST', body: JSON.stringify(body) });

export const getPendingRequests = () => request('/wallet/pending-requests');

export const getUserRequests = (userId) => request(`/wallet/user-requests/${userId}`);

export const approveRequest = (requestId) =>
    request(`/wallet/approve-request/${requestId}`, { method: 'PATCH' });

export const rejectRequest = (requestId) =>
    request(`/wallet/reject-request/${requestId}`, { method: 'PATCH' });

// Old: Direct Add Money (Admin Only bypass)
export const addMoney = (body) =>
    request('/wallet/add', { method: 'POST', body: JSON.stringify(body) });

export const transferMoney = (body) =>
    request('/wallet/transfer', { method: 'POST', body: JSON.stringify(body) });

export const getTransactionHistory = (userId) =>
    request(`/wallet/transactions/${userId}`);

export const getAllTransactions = () => request('/wallet/transactions');

export const getUserStats = (userId) => request(`/wallet/stats/${userId}`);

export const getMonthlySummary = () => request('/wallet/monthly-summary');
