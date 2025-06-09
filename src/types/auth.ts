// Types pour les rôles
export type Role = 'ADMIN' | 'OPERATEUR' | 'TRANSPORTEUR';

// Interface pour le rôle
export interface RoleEntity {
    id_role: number;
    nom: Role;
}

// Interface pour l'employé
export interface Employe {
    empCin: string;
    nom_emp: string;
    prenom_emp: string;
    emp_phone: string;
    emp_adresse: string;
    utilisateur?: User;
    role?: RoleEntity;
}

// Interface pour l'utilisateur
export interface User {
    email: string;
    mot_passe: string;
    role: RoleEntity;
    employe?: Employe;
}

// Interface pour la requête de connexion
export interface LoginRequest {
    email: string;
    mot_passe: string;
}

// Interface pour la réponse de connexion
export interface LoginResponse {
    token: string;
}

// Interface pour le contexte d'authentification
export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setError: (error: string | null) => void;
}
