import { User } from '../types/auth';

// Clé pour stocker le token dans le localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Fonction pour sauvegarder le token dans le localStorage
export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Fonction pour récupérer le token du localStorage
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

// Fonction pour sauvegarder l'utilisateur dans le localStorage
export const setUser = (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Fonction pour récupérer l'utilisateur du localStorage
export const getUser = (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return null;
        }
    }
    return null;
};

// Fonction pour supprimer les données d'authentification
export const clearAuth = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

// Fonction pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// Fonction pour vérifier si l'utilisateur est un admin
export const isAdmin = (): boolean => {
    const user = getUser();
    return user?.role.nom === 'ADMIN';
};

// Fonction pour vérifier si l'utilisateur est un opérateur
export const isOperator = (): boolean => {
    const user = getUser();
    return user?.role.nom === 'OPERATEUR';
}; 
