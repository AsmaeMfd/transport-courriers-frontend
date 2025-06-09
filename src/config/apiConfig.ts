// Configuration de l'API
export const API_CONFIG = {
    // URL de base de l'API
    BASE_URL: 'http://localhost:8080/api',
    
    // Endpoints d'authentification
    AUTH: {
        login: '/utilisateur/login',
        GET_USER: '/utilisateur',
    },
    
    // Endpoints pour les agences
    AGENCE: {
        BASE: '/agence',
        getAllAdresses: '/agence/all', 
        getAgenceById: (id: string) => `/agence/${id}`,
        createAgence: '/agence/create',
        updateAgence: (id: string) => `/agence/update/${id}`,
        deleteAgence: (id: string) => `/agence/delete/${id}`,
        getDetailsAgence: (nomAgence: string) => `/agence/details/${nomAgence}`,
    },
    
    // Endpoints pour les véhicules
    VEHICULE: {
        BASE: '/vehicule',
        getAllVehicules: '/vehicule/getAll',  
        getVehiculeByImmatriculation: (imtrc: string) => `/vehicule/${imtrc}`,
        addVehicule: '/vehicule/create', 
        updateVehicule: (imtrc: string) => `/vehicule/${imtrc}`,
        deleteVehicule: (imtrc: string) => `/vehicule/${imtrc}`,
        getAllImmatriculations: '/vehicule/allImmatriculations',
    },
    
    // Endpoints pour les employés
    EMPLOYE: {
        BASE: '/employe',
        getEmployeByCin: (cin: string) => `/employe/find/${cin}`,
        createEmploye: '/employe/create',
    },

    // Endpoints pour les utilisateurs
    UTILISATEUR: {
        BASE: '/utilisateur',
        createUtilisateurWithEmploye: '/utilisateur/create-with-employe',
    },

    // Endpoints pour les transporteurs
    TRANSPORTEUR: {
        BASE: '/transporteur',
        getTransporteurById: (trs_cin: string) => `/transporteur/${trs_cin}`,
        createTransporteur: '/transporteur/create',
        updateTransporteur: (trs_cin: string) => `/transporteur/update/${trs_cin}`,
        deleteTransporteur: (trs_cin: string) => `/transporteur/delete/${trs_cin}`,
    },
    
    // Endpoints pour les courriers
    COURRIERS: {
        BASE: '/courriers',
        getAllCourriers: '/courriers/all',//done
        getCourrierById: (id: number) => `/courriers/${id}`,//done
        create: '/courriers/create',//done
        updateCourrier: (id: number) => `/courriers/${id}`,//done
        deleteCourrier: (id: number) => `/courriers/${id}`,//done
        getCourrierByStatut: (statut: string) => `/courriers/statut/${statut}`,//done
        createCourrierAvecClient: '/courriers/create-with-client',//done
        changerStatut: (id: number) => `/courriers/status/${id}`,//done
        /* GENERATE_FACTURE: (id: number) => `/courriers/${id}/facture`, */
    },
};



// Configuration des headers par défaut
export const DEFAULT_HEADERS: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

// Configuration des timeouts
export const API_TIMEOUT = 30000; // 30 secondes

// Messages d'erreur
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erreur de connexion au serveur',
    UNAUTHORIZED: 'Email ou mot de passe incorrect',
    FORBIDDEN: 'Accès refusé',
    NOT_FOUND: 'Ressource non trouvée',
    SERVER_ERROR: 'Erreur serveur',
    INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
    VALIDATION_ERROR: 'Données invalides',
    DUPLICATE_ENTRY: 'Cette entrée existe déjà',
};
