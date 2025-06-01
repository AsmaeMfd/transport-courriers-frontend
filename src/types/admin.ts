import { User, RoleEntity } from './auth';

// Types pour la gestion des agences
export interface Agence {
    id_agence: string;
    nomAgence: string;
    adresse_agence: string;
    employes?: Employe[];
    transporteurs?: Transporteur[];
    vehicules?: Vehicule[];
}

// DTOs pour les réponses du backend
export interface AgenceDashboardDto {
    id: string;
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
    email?: string; // rempli si opérateur
    mot_passe?: string; // rempli si opérateu
}

export interface VehiculeDto {
    immatriculation: string;
    type: string;
    capacite: number;
    transporteur?: string;
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
    agence?: Agence;
    transporteurVehicule?: Transporteur;
    disponible: boolean;
}

export interface VehiculeDashboardDto {
    immatriculation: string;
    type: string;
    capacite: number;
    agence?: string;
    transporteur?: string;
    disponible: boolean;
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
    id_agence: string;
}

export interface CreateEmployeRequest {
    empCin: string;
    nom_emp: string;
    prenom_emp: string;
    emp_phone: string;
    emp_adresse: string;
    id_agence: string;
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
    id_agence: string;
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

export type AgenceListResponse = ListResponse<string>; // Liste des adresses
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
    agenceId?: string;
    roleId?: number;
    status?: string;
} 