import { useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Role } from '../types/auth';
import { getToken, clearAuth } from '../utils/auth';
import { ERROR_MESSAGES } from '../config/apiConfig';
import toast from 'react-hot-toast';

export const useAuth = () => {
    const context = useContext(AuthContext);
    const navigate = useNavigate();

    if (!context) {
        console.error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
        return {
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: null,
            login: async () => {},
            logout: async () => {},
            handleAuthError: () => {},
            handleRedirect: () => {},
            setUser: () => {},
            setToken: () => {},
            setError: () => {},
        };
    }

    // Token management functions
    const getAuthToken = useCallback((): string | null => {
        return getToken();
    }, []);

    const clearAuthData = useCallback((): void => {
        clearAuth();
        context.setUser(null);
        context.setToken(null);
    }, [context]);

    // Centralized redirection logic
    const handleRedirect = useCallback((role?: Role): void => {
        if (!context.isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!context.user?.role?.nom) {
            console.error('Rôle utilisateur non défini');
            navigate('/login');
            return;
        }

        const userRole = context.user.role.nom;
        switch (userRole) {
            case 'ADMIN':
                navigate('/admin');
                break;
            case 'OPERATEUR':
                navigate('/operator');
                break;
            default:
                console.error('Rôle non reconnu:', userRole);
                navigate('/login');
        }
    }, [context.isAuthenticated, context.user, navigate]);

    // Centralized error handling
    const handleAuthError = useCallback((error: unknown): void => {
        let errorMessage = ERROR_MESSAGES.NETWORK_ERROR;

        if (error instanceof Error) {
            if (error.message.includes('401')) {
                errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
                clearAuthData();
            } else if (error.message.includes('403')) {
                errorMessage = ERROR_MESSAGES.FORBIDDEN;
            } else if (error.message.includes('404')) {
                errorMessage = ERROR_MESSAGES.NOT_FOUND;
            } else if (error.message.includes('500')) {
                errorMessage = ERROR_MESSAGES.SERVER_ERROR;
            } else {
                errorMessage = error.message;
            }
        }

        toast.error(errorMessage);
        context.setError(errorMessage);
    }, [clearAuthData, context]);

    // Role-based access control
    const hasAccess = useCallback((requiredRole: Role): boolean => {
        if (!context.isAuthenticated || !context.user) return false;
        return context.user.role.nom === requiredRole;
    }, [context.isAuthenticated, context.user]);

    const isAdmin = useCallback((): boolean => {
        return hasAccess('ADMIN');
    }, [hasAccess]);

    const isOperator = useCallback((): boolean => {
        return hasAccess('OPERATEUR');
    }, [hasAccess]);

    // User information
    const getUserFullName = useCallback((): string => {
        if (!context.user?.employe) return '';
        return `${context.user.employe.prenom_emp} ${context.user.employe.nom_emp}`;
    }, [context.user]);

    // Memoized values
    const authState = useMemo(() => ({
        ...context,
        getUserFullName,
        hasAccess,
        isAdmin,
        isOperator,
        getAuthToken,
        clearAuthData,
        handleRedirect,
        handleAuthError
    }), [
        context,
        getUserFullName,
        hasAccess,
        isAdmin,
        isOperator,
        getAuthToken,
        clearAuthData,
        handleRedirect,
        handleAuthError
    ]);

    return authState;
};
 
