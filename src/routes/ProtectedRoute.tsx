import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    hasRequiredRole: () => boolean;
    fallbackPath: string;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    isAuthenticated,
    hasRequiredRole,
    fallbackPath,
    children
}) => {
    if (!isAuthenticated) {
        return <Navigate to={fallbackPath} replace />;
    }

    if (!hasRequiredRole()) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 