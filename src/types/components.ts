import { Employe, Agence, Vehicule, CreateEmployeRequest, CreateUserRequest } from './admin';
import { RoleEntity } from './auth';

// Types pour les formulaires
export interface EmployeeFormProps {
    initialData?: CreateEmployeRequest;
    initialUserData?: CreateUserRequest;
    onSubmit: (data: CreateEmployeRequest, userData?: CreateUserRequest) => void;
    agences: Agence[];
    vehicules: Vehicule[];
    roles: RoleEntity[];
    isLoading?: boolean;
}

export interface AgencyFormProps {
    initialData?: {
        nomAgence: string;
        adresse_agence: string;
    };
    onSubmit: (data: { nomAgence: string; adresse_agence: string }) => void;
    isLoading?: boolean;
}

export interface VehicleFormProps {
    initialData?: {
        immatriculation: string;
        type: string;
        capacite: number;
        id_agence: string;
    };
    onSubmit: (data: { immatriculation: string; type: string; capacite: number; id_agence: string }) => void;
    agences: Agence[];
    isLoading?: boolean;
}

// Types pour les listes
export interface EmployeeListProps {
    employes: Employe[];
    onEdit: (employe: Employe) => void;
    onDelete: (id: string) => void;
    onSearch: (query: string) => void;
    onFilterByRole?: (roleId: number) => void;
    roles: RoleEntity[];
    isLoading?: boolean;
}

export interface AgencyListProps {
    agences: Agence[];
    onEdit: (agence: Agence) => void;
    onDelete: (id: string) => Promise<void>;
    onSearch: (query: string) => void;
}

export interface VehicleListProps {
    vehicules: Vehicule[];
    onEdit: (vehicule: Vehicule) => void;
    onDelete: (id: string) => Promise<void>;
    onSearch: (query: string) => void;
}  