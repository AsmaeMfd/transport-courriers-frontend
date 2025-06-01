import axiosInstance from '../config/axiosConfig';
import publicAxios from '../config/publicAxios';
import { API_CONFIG } from '../config/apiConfig';
import { LoginRequest, LoginResponse, User, Role, RoleEntity } from '../types/auth';
import { setToken, setUser, clearAuth, getToken } from '../utils/auth';
import { handleApiError, ApiError } from '../config/axiosConfig';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    sub: string; // email
    role: Role;
    exp: number;
}

class AuthService {
    /**
     * Nettoie les données de l'utilisateur pour éviter la récursion infinie
     */
    private cleanUserData(user: User): User {
        console.log('Données utilisateur reçues pour nettoyage:', JSON.stringify(user, null, 2));

        if (!user) {
            throw new ApiError('Données utilisateur invalides');
        }

        // Vérifier si le rôle existe
        if (!user.role) {
            console.error('Rôle manquant dans les données utilisateur:', JSON.stringify(user, null, 2));
            throw new ApiError('Rôle utilisateur manquant');
        }

        // Créer une copie propre du rôle sans la liste des utilisateurs
        const cleanRole: RoleEntity = {
            id_role: user.role.id_role,
            nom: user.role.nom
        };

        // Retourner un nouvel objet utilisateur avec les données nettoyées
        const cleanedUser = {
            email: user.email,
            mot_passe: user.mot_passe,
            role: cleanRole,
            employe: user.employe
        };

        console.log('Utilisateur nettoyé:', JSON.stringify(cleanedUser, null, 2));
        return cleanedUser;
    }

    /**
     * Extrait les données utilisateur de base d'une chaîne JSON récursive
     */
    private extractBaseUserData(jsonString: string): User {
        try {
            console.log('Tentative d\'extraction des données utilisateur de:', jsonString.substring(0, 200) + '...');

            // Extraire l'email
            const emailMatch = jsonString.match(/"email":"([^"]+)"/);
            if (!emailMatch) {
                throw new Error('Email non trouvé dans les données');
            }
            const email = emailMatch[1];

            // Extraire le mot de passe
            const passwordMatch = jsonString.match(/"mot_passe":"([^"]+)"/);
            if (!passwordMatch) {
                throw new Error('Mot de passe non trouvé dans les données');
            }
            const mot_passe = passwordMatch[1];

            // Extraire l'ID du rôle
            const roleIdMatch = jsonString.match(/"id_role":(\d+)/);
            if (!roleIdMatch) {
                throw new Error('ID du rôle non trouvé dans les données');
            }
            const id_role = parseInt(roleIdMatch[1]);

            // Extraire le nom du rôle
            const roleNameMatch = jsonString.match(/"nom":"([^"]+)"/);
            if (!roleNameMatch) {
                throw new Error('Nom du rôle non trouvé dans les données');
            }
            const nom = roleNameMatch[1] as Role;

            // Construire l'objet utilisateur
            const userData: User = {
                email,
                mot_passe,
                role: {
                    id_role,
                    nom
                }
            };

            console.log('Données utilisateur extraites:', JSON.stringify(userData, null, 2));
            return userData;
        } catch (error) {
            console.error('Erreur lors de l\'extraction des données utilisateur:', error);
            throw new ApiError('Impossible d\'extraire les données utilisateur');
        }
    }

    /**
     * Authentifie un utilisateur avec son email et mot de passe
     * @param email - Email de l'utilisateur
     * @param password - Mot de passe de l'utilisateur
     * @returns Promise<User> - Les informations de l'utilisateur connecté
     */
    async login(email: string, password: string): Promise<User> {
        try {
            console.log('Début du processus de connexion');
            console.log('URL de connexion:', API_CONFIG.AUTH.login);

            // Création de la requête de connexion
            const loginRequest: LoginRequest = {
                email,
                mot_passe: password
            };

            console.log('Tentative de connexion avec:', { email });

            // Appel à l'API de connexion
            console.log('Envoi de la requête de connexion...');
            const response = await publicAxios.post<LoginResponse>(
                API_CONFIG.AUTH.login,
                loginRequest
            );

            console.log('Réponse de connexion reçue:', response.status);
            console.log('Données de réponse:', JSON.stringify(response.data, null, 2));

            // Stockage du token
            const { token } = response.data;
            if (!token) {
                console.error('Token manquant dans la réponse:', response.data);
                throw new ApiError('Token non reçu du serveur');
            }
            console.log('Token reçu, stockage en cours...');
            setToken(token);

            // Décodage du token pour vérifier le rôle
            console.log('Décodage du token...');
            const decoded = jwtDecode<DecodedToken>(token);
            console.log('Token décodé:', JSON.stringify(decoded, null, 2));

            // Récupération des informations de l'utilisateur
            console.log('Récupération des informations utilisateur...');
            const userResponse = await this.getCurrentUser();
            
            // Nettoyage des données de l'utilisateur
            console.log('Nettoyage des données utilisateur...');
            const cleanedUser = this.cleanUserData(userResponse);

            // Vérification que le rôle correspond
            if (cleanedUser.role.nom !== decoded.role) {
                console.error('Incohérence de rôle:', { 
                    token: decoded.role, 
                    user: cleanedUser.role.nom 
                });
                throw new ApiError('Incohérence de rôle détectée');
            }

            // Stockage des informations de l'utilisateur nettoyées
            console.log('Stockage des informations utilisateur...');
            setUser(cleanedUser);

            console.log('Connexion réussie');
            return cleanedUser;
        } catch (error: unknown) {
            console.error('Erreur lors de la connexion:', error);
            throw handleApiError(error);
        }
    }

    /**
     * Déconnecte l'utilisateur
     */
    async logout(): Promise<void> {
        try {
            console.log('Début de la déconnexion');
            
            // Suppression du token et des données utilisateur
            clearAuth();
            
            // Suppression explicite de toutes les données d'authentification
            localStorage.clear();
            sessionStorage.clear();
            
            // Suppression des cookies liés à l'authentification
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            
            console.log('Déconnexion réussie');
        } catch (error: unknown) {
            console.error('Erreur lors de la déconnexion:', error);
            throw handleApiError(error);
        }
    }

    /**
     * Récupère les informations de l'utilisateur connecté
     * @returns Promise<User> - Les informations de l'utilisateur
     */
    async getCurrentUser(): Promise<User> {
        try {
            console.log('Début de getCurrentUser');
            const token = getToken();
            if (!token) {
                throw new ApiError('Non authentifié');
            }

            // Décodage du token pour obtenir l'email
            console.log('Décodage du token...');
            const decoded = jwtDecode<DecodedToken>(token);
            if (!decoded || !decoded.sub) {
                throw new ApiError('Token invalide');
            }
            console.log('Token décodé pour getCurrentUser:', JSON.stringify(decoded, null, 2));

            console.log('URL de récupération utilisateur:', `${API_CONFIG.AUTH.GET_USER}/${decoded.sub}`);
            console.log('Envoi de la requête...');
            const response = await axiosInstance.get<User>(`${API_CONFIG.AUTH.GET_USER}/${decoded.sub}`);
            
            console.log('Statut de la réponse:', response.status);
            if (!response.data) {
                throw new ApiError('Données utilisateur non reçues');
            }

            // Vérifier si la réponse est une chaîne JSON
            let userData: User;
            if (typeof response.data === 'string') {
                try {
                    // Extraire les données utilisateur de base
                    userData = this.extractBaseUserData(response.data);
                } catch (e) {
                    console.error('Erreur lors de l\'extraction des données:', e);
                    throw new ApiError('Format de réponse invalide');
                }
            } else {
                userData = response.data;
            }

            console.log('Données utilisateur parsées:', JSON.stringify(userData, null, 2));

            // Nettoyage des données de l'utilisateur
            console.log('Nettoyage des données...');
            const cleanedUser = this.cleanUserData(userData);

            console.log('getCurrentUser terminé avec succès');
            return cleanedUser;
        } catch (error: unknown) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            throw handleApiError(error);
        }
    }
}

// Export d'une instance unique du service
export const authService = new AuthService();
