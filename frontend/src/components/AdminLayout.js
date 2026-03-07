import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../App';

const AdminLayout = () => {
    const navigate = useNavigate();
    const { authState, setAuthState } = useAuth();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            setAuthState({
                email: '',
                password: '',
                otp: '123456',
                isSignedUp: false,
                isLoggedIn: false,
                currentUser: null,
                accountDetails: null,
            });
            localStorage.removeItem('wallet_auth');
            navigate('/login');
        }
    };

    return (
        <div className="home-container">
            <div className="home-header" style={{ paddingBottom: 20 }}>
                <div className="home-header-top">
                    <div className="flex-column">
                        <div className="user-greeting">Admin Panel 🛡️</div>
                        <div className="user-name">Management Console</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button onClick={() => navigate('/home')} className="btn-outline" style={{ padding: '8px 16px', color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '12px' }}>User View</button>
                        <button onClick={handleLogout} className="btn-outline" style={{ padding: '8px 16px', color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: '12px' }}>Logout</button>
                    </div>
                </div>
            </div>

            <div className="admin-tabs" style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 }}>
                <NavLink to="/admin/dashboard" className={({ isActive }) => `admin-tab-btn ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
                <NavLink to="/admin/requests" className={({ isActive }) => `admin-tab-btn ${isActive ? 'active' : ''}`}>Requests</NavLink>
                <NavLink to="/admin/history" className={({ isActive }) => `admin-tab-btn ${isActive ? 'active' : ''}`}>History</NavLink>
            </div>

            <div className="content-wrapper" style={{ padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
