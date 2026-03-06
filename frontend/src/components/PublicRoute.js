import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../App';

const PublicRoute = ({ children }) => {
    const { authState } = useAuth();
    const { isLoggedIn } = authState;

    if (isLoggedIn) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default PublicRoute;
