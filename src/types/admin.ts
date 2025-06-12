import { User, RoleEntity } from './auth';

// Types pour la gestion des agences
export interface Agence {
    id_agence: number;
    nomAgence: string;
    adresse_agence: string;
    employes?: Employe[];
    transporteurs?: Transporteur[];
    vehicules?: Vehicule[];
}

// DTOs pour les réponses du backend
export interface AgenceDashboardDto {
    id: number;
    nom: string;
    adresse: string;
    nombreEmployes: number;
    nombreVehicules: number;
}

export interface EmployeAgenceDto {
    empCin: string;
    nom_emp: string;
    prenom_emp: string;
    emp_phone: string;
    emp_adresse: string;
    role?: RoleEntity;
    email?: string;
    mot_passe?: string;
}

export interface VehiculeDto {
    immatriculation: string;
    type: string;
    capacite: number;
}

export interface AgenceDetailsDto {
    nomAgence: string;
    employes: EmployeAgenceDto[];
    vehicules: VehiculeDto[];
}

// Types pour la gestion des véhicules
export interface Vehicule {
    immatriculation: string;
    type: string;
    capacite: number;
    disponible?: boolean;
    agence?: Agence;
    transporteurVehicule?: Transporteur;
}

export interface VehiculeDashboardDto {
    immatriculation: string;
    type: string;
    capacite: number;
    nommAgence?: string;
}

// Types pour la gestion des employés
export interface Employe {
    empCin: string;
    nom_emp: string;
    prenom_emp: string;
    emp_phone: string;
    emp_adresse: string;
    agence?: Agence;
    utilisateur?: User;
    role?: RoleEntity;
    transporteur?: Transporteur;
}

// Types pour la gestion des transporteurs
export interface Transporteur {
    trs_Cin: string;
    nom_trs: string;
    prenom_trs: string;
    trs_phone: number;
    trs_adress: string;
    agenceTransporteur?: Agence;
    vehiculeTransporteur?: Vehicule;
    employe?: Employe;
    role?: RoleEntity;
}

// Types pour les requêtes de création/modification
export interface CreateAgenceRequest {
    nomAgence: string;
    adresse_agence: string;
}

export interface CreateVehiculeRequest {
    immatriculation: string;
    type: string;
    capacite: number;
    idAgence?: number;
}

export interface CreateEmployeRequest {
    empCin: string;
    nom_emp: string;
    prenom_emp: string;
    emp_phone: string;
    emp_adresse: string;
    id_agence: number;
    email?: string;
    mot_passe?: string;
    id_role: number;
}

export interface CreateTransporteurRequest {
    trs_Cin: string;
    nom_trs: string;
    prenom_trs: string;
    trs_phone: number;
    trs_adress: string;
    id_agence: number;
    id_role: number;
    immatriculation?: string;
}

// Types pour les réponses des requêtes
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export type AgenceResponse = ApiResponse<Agence>;
export type AgenceDashboardResponse = ApiResponse<AgenceDashboardDto>;
export type AgenceDetailsResponse = ApiResponse<AgenceDetailsDto>;
export type VehiculeResponse = ApiResponse<Vehicule>;
export type VehiculeDashboardResponse = ApiResponse<VehiculeDashboardDto>;
export type EmployeResponse = ApiResponse<Employe>;
export type TransporteurResponse = ApiResponse<Transporteur>;

// Types pour les listes
export interface ListResponse<T> {
    success: boolean;
    data: T[];
}

export type AgenceListResponse = ListResponse<Agence>;
export type VehiculeListResponse = ListResponse<Vehicule>;
export type EmployeListResponse = ListResponse<Employe>;
export type TransporteurListResponse = ListResponse<Transporteur>;

// Types pour les filtres de recherche
export interface SearchFilters {
    query?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    agenceId?: number;
    roleId?: number;
    status?: string;
} 

export interface CreateUserRequest {
    email: string;
    mot_passe: string;
    id_role: number;
}
