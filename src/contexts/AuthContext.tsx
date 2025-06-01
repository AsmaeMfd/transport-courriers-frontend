import React, { createContext, useState, useEffect } from 'react';
import { User, Role } from '../types/auth';
import { authService } from '../services/authService';
import { getToken, setToken, setUser, clearAuth } from '../utils/auth';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setError: (error: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Vérifier la validité du token au démarrage
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedToken = getToken();
                if (!storedToken) {
                    console.log('Aucun token trouvé');
                    clearAuth();
                    setLoading(false);
                    return;
                }

                // Vérifier si le token est expiré
                const decoded = jwtDecode<{ exp: number }>(storedToken);
                const currentTime = Date.now() / 1000;
                
                if (decoded.exp < currentTime) {
                    console.log('Token expiré');
                    clearAuth();
                    setLoading(false);
                    return;
                }

                // Récupérer les informations de l'utilisateur
                const userData = await authService.getCurrentUser();
                setUserState(userData);
                setTokenState(storedToken);
            } catch (error) {
                console.error('Erreur lors de la vérification de l\'authentification:', error);
                clearAuth();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const userData = await authService.login(email, password);
            setUserState(userData);
            setTokenState(getToken());
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Une erreur est survenue');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();
            setUserState(null);
            setTokenState(null);
            setError(null);
            clearAuth();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Une erreur est survenue');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const setUser = (newUser: User | null) => {
        setUserState(newUser);
        if (newUser) {
            setUser(newUser);
        }
    };

    const setToken = (newToken: string | null) => {
        setTokenState(newToken);
        if (newToken) {
            setToken(newToken);
        }
    };

    const value = {
        isAuthenticated: !!token && !!user,
        user,
        token,
        loading,
        error,
        login,
        logout,
        setUser,
        setToken,
        setError
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

 
