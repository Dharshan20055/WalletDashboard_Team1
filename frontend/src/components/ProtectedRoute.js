import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../App';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { authState } = useAuth();
    const { currentUser, isLoggedIn } = authState;

    if (!isLoggedIn || !currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && currentUser.role !== 'ADMIN') {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default ProtectedRoute;
