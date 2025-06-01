import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '../pages/LoginPage';
import AdminRoutes from './AdminRoutes';
import OperatorRoutes from './OperatorRoutes';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

const AuthRoutes: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    // Fonction pour vérifier si l'utilisateur a le rôle requis
    const hasRequiredRole = (requiredRole: string): boolean => {
        return isAuthenticated && user?.role?.nom === requiredRole;
    };

    // Fonction pour déterminer la redirection en fonction du rôle
    const getRoleBasedRedirect = () => {
        if (!isAuthenticated || !user?.role?.nom) {
            return '/login';
        }
        return user.role.nom === 'ADMIN' ? '/admin' : '/operator';
    };

    return (
        <Routes>
            {/* Routes publiques */}
            <Route 
                path="/login" 
                element={
                    isAuthenticated ? (
                        <Navigate to={getRoleBasedRedirect()} replace />
                    ) : (
                        <LoginPage />
                    )
                } 
            />

            {/* Routes protégées pour l'administrateur */}
            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute
                        isAuthenticated={isAuthenticated}
                        hasRequiredRole={() => hasRequiredRole('ADMIN')}
                        fallbackPath="/login"
                    >
                        <AdminRoutes />
                    </ProtectedRoute>
                }
            />

            {/* Routes protégées pour l'opérateur */}
            <Route
                path="/operator/*"
                element={
                    <ProtectedRoute
                        isAuthenticated={isAuthenticated}
                        hasRequiredRole={() => hasRequiredRole('OPERATEUR')}
                        fallbackPath="/login"
                    >
                        <OperatorRoutes />
                    </ProtectedRoute>
                }
            />

            {/* Redirection par défaut */}
            <Route 
                path="/" 
                element={
                    <Navigate to={getRoleBasedRedirect()} replace />
                } 
            />

            {/* Redirection du dashboard vers la page appropriée */}
            <Route
                path="/dashboard"
                element={
                    <Navigate to={getRoleBasedRedirect()} replace />
                }
            />

            {/* Route 404 - Doit être la dernière route */}
            <Route path="*" element={<NotFoundPage />} /> 
        </Routes>
    );
};

export default AuthRoutes; 