import axiosInstance from '../config/axiosConfig';
import { API_CONFIG } from '../config/apiConfig';
import { 
    Courrier, 
    CreateCourrierDto, 
    CourrierResponse, 
    CourrierListResponse,
    StatusCourrier,
    CourrierSearchFilters
} from '../types/operator';
import { handleApiError } from '../config/axiosConfig';

class OperatorService {
    /**
     * Récupère la liste de tous les courriers
     * @returns Promise<Courrier[]> - Liste des courriers
     */
    async getAllCourriers(): Promise<Courrier[]> {
        try {
            const response = await axiosInstance.get<CourrierListResponse>(API_CONFIG.COURRIERS.getAllCourriers);
            if (!response.data.data) {
                return [];
            }
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Récupère un courrier par son ID
     * @param id - ID du courrier
     * @returns Promise<Courrier> - Détails du courrier
     */
    async getCourrierById(id: number): Promise<Courrier> {
        try {
            const response = await axiosInstance.get<CourrierResponse>(
                API_CONFIG.COURRIERS.getCourrierById(id)
            );
            if (!response.data.data) {
                throw new Error('Courrier non trouvé');
            }
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Crée un nouveau courrier avec les informations du client
     * @param courrierData - Données du courrier et du client
     * @returns Promise<Courrier> - Courrier créé
     */
    async createCourrier(courrierData: CreateCourrierDto): Promise<Courrier> {
        try {
            const response = await axiosInstance.post<CourrierResponse>(
                API_CONFIG.COURRIERS.createCourrierAvecClient,
                courrierData
            );
            if (!response.data.data) {
                throw new Error('Erreur lors de la création du courrier');
            }
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Met à jour un courrier existant
     * @param id - ID du courrier
     * @param courrierData - Nouvelles données du courrier
     * @returns Promise<Courrier> - Courrier mis à jour
     */
    async updateCourrier(id: number, courrierData: Partial<CreateCourrierDto>): Promise<Courrier> {
        try {
            const response = await axiosInstance.put<CourrierResponse>(
                API_CONFIG.COURRIERS.updateCourrier(id),
                courrierData
            );
            if (!response.data.data) {
                throw new Error('Erreur lors de la mise à jour du courrier');
            }
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Supprime un courrier
     * @param id - ID du courrier à supprimer
     * @returns Promise<void>
     */
    async deleteCourrier(id: number): Promise<void> {
        try {
            await axiosInstance.delete(API_CONFIG.COURRIERS.deleteCourrier(id));
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Récupère les courriers par statut
     * @param statut - Statut des courriers à récupérer
     * @returns Promise<Courrier[]> - Liste des courriers avec le statut spécifié
     */
    async getCourriersByStatus(statut: StatusCourrier): Promise<Courrier[]> {
        try {
            const response = await axiosInstance.get<CourrierListResponse>(
                API_CONFIG.COURRIERS.getCourrierByStatut(statut)
            );
            if (!response.data.data) {
                return [];
            }
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Change le statut d'un courrier
     * @param id - ID du courrier
     * @param newStatus - Nouveau statut
     * @returns Promise<Courrier> - Courrier mis à jour
     */
    async changeCourrierStatus(id: number, newStatus: StatusCourrier): Promise<Courrier> {
        try {
            const response = await axiosInstance.put<CourrierResponse>(
                API_CONFIG.COURRIERS.changerStatut(id),
                { statut: newStatus }
            );
            if (!response.data.data) {
                throw new Error('Erreur lors du changement de statut du courrier');
            }
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Recherche des courriers avec filtres
     * @param filters - Filtres de recherche
     * @returns Promise<Courrier[]> - Liste des courriers correspondant aux filtres
     */
    async searchCourriers(filters: CourrierSearchFilters): Promise<Courrier[]> {
        try {
            const response = await axiosInstance.get<CourrierListResponse>(
                API_CONFIG.COURRIERS.BASE,
                { params: filters }
            );
            if (!response.data.data) {
                return [];
            }
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
}

export default new OperatorService(); 