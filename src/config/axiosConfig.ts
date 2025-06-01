import axios from 'axios';
import { API_CONFIG, DEFAULT_HEADERS, API_TIMEOUT, ERROR_MESSAGES } from './apiConfig';
import { getToken, clearAuth } from '../utils/auth';

// Création de l'instance Axios avec la configuration de base
const axiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: DEFAULT_HEADERS,
    timeout: API_TIMEOUT,
});

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
    (config) => {
        // Récupération du token d'authentification
        const token = getToken();
        //console ajoute
        console.log("Token utilisé pour les requêtes :", token);
        // --- Début des logs ajoutés ---
        console.log('Axios Request Interceptor:');
        console.log('Attempting to get token...', token);
        // --- Fin des logs ajoutés ---

        // Ajout du token dans les headers si disponible
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            // --- Début des logs ajoutés ---
            console.log('Token found, adding Authorization header:', config.headers.Authorization);
            // --- Fin des logs ajoutés ---
        } else {
            // --- Début des logs ajoutés ---
            console.log('No token found or headers not available, Authorization header not added.');
            // --- Fin des logs ajoutés ---
        }
        
        // --- Début des logs ajoutés ---
        console.log('Request config headers:', config.headers);
        console.log('--- End Axios Request Interceptor ---');
        // --- Fin des logs ajoutés ---

        return config;
    },
    (error) => {
        // --- Début des logs ajoutés ---
        console.error('Axios Request Interceptor Error:', error);
        // --- Fin des logs ajoutés ---
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Gestion des erreurs HTTP
            switch (error.response.status) {
                case 401:
                    // Non autorisé - déconnexion et redirection vers la page de login
                    clearAuth();
                    window.location.href = '/login';
                    return Promise.reject(new Error(ERROR_MESSAGES.UNAUTHORIZED));
                
                case 403:
                    return Promise.reject(new Error(ERROR_MESSAGES.FORBIDDEN));
                
                case 404:
                    return Promise.reject(new Error(ERROR_MESSAGES.NOT_FOUND));
                
                case 500:
                    return Promise.reject(new Error(ERROR_MESSAGES.SERVER_ERROR));
                
                default:
                    return Promise.reject(error);
            }
        } else if (error.request) {
            // Erreur de réseau
            return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
        } else {
            // Erreur lors de la configuration de la requête
            return Promise.reject(error);
        }
    }
);

// Export de l'instance Axios configurée
export default axiosInstance;

// Types d'erreur personnalisés
export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Fonction utilitaire pour gérer les erreurs d'API
export const handleApiError = (error: unknown): ApiError => {
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as any;
        // Tentative d'extraire un message d'erreur plus spécifique de la réponse du backend
        const backendErrorMessage = axiosError.response?.data?.message || axiosError.response?.data || axiosError.message;
        
        return new ApiError(
            backendErrorMessage || ERROR_MESSAGES.SERVER_ERROR,
            axiosError.response?.status,
            axiosError.response?.data
        );
    }
    return new ApiError(ERROR_MESSAGES.SERVER_ERROR);
};
