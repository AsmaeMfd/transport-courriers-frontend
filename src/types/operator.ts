// Types pour les courriers
export enum StatusCourrier {
    depose = 'depose',
    en_cours_de_livraison = 'en_cours_de_livraison',
    livre = 'livre'
}

// Interface pour le client
export interface Client {
    cin: string;
    nom_clt: string;
    prenom_clt: string;
    clt_adress: string;
    phone_number: string;
}

// Interface pour le courrier
export interface Courrier {
    id: number; // Correspond à Long dans le backend
    dateEnvoie: string; // Format: YYYY-MM-DD
    poids: number;
    statut: StatusCourrier;
    prixTransmission: number;
    agenceExped: string;
    agenceDest: string;
    nom_complet_dest: string;
    adresse_dest: string;
    cin_dest: string;
    client: Client;
}

// DTO pour la création d'un courrier avec client
export interface CreateCourrierDto {
    cin: string;
    nom_clt: string;
    prenom_clt: string;
    clt_adress: string;
    phone_number: string;
    id?: number; // Correspond à Long dans le backend
    dateEnvoie?: string; // Format: YYYY-MM-DD
    poids: number;
    cin_dest: string;
    nom_complet_dest: string;
    adresse_dest: string;
    agenceExped: string;
    agenceDest: string;
    statut?: StatusCourrier;
    prixTransmission?: number;
}

// Types pour les réponses API
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export type CourrierResponse = ApiResponse<Courrier>;
export type CourrierListResponse = ApiResponse<Courrier[]>;

// Types pour les filtres de recherche
export interface CourrierSearchFilters {
    query?: string;
    status?: StatusCourrier;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Types pour les composants
export interface CourrierFormProps {
    initialData?: CreateCourrierDto;
    onSubmit: (data: CreateCourrierDto) => void;
    isLoading?: boolean;
    agencies: string[];
}

export interface CourrierListProps {
    courriers: Courrier[];
    onEdit: (courrier: Courrier) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, newStatus: StatusCourrier) => void;
    isLoading?: boolean;
}

export interface CourrierDetailProps {
    courrier: Courrier;
    onEdit: (courrier: Courrier) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: StatusCourrier) => void;
}

// Types pour les états de l'opérateur
export interface OperatorState {
    courriers: Courrier[];
    selectedCourrier: Courrier | null;
    filters: CourrierSearchFilters;
    loading: boolean;
    error: string | null;
} 