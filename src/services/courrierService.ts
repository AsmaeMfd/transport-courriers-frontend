import axiosInstance from '../config/axiosConfig';
import { API_CONFIG } from '../config/apiConfig';
import { 
    Courrier, 
    CreateCourrierDto, 
    CourrierResponse, 
    CourrierListResponse,
    StatusCourrier 
} from '../types/operator';

class CourrierService {
    // Récupérer tous les courriers
    async getAllCourriers(): Promise<Courrier[]> {
        const response = await axiosInstance.get<CourrierListResponse>(API_CONFIG.COURRIERS.getAllCourriers);
        return response.data.data || [];
    }

    // Récupérer un courrier par son ID
    async getCourrierById(id: number): Promise<Courrier> {
        const response = await axiosInstance.get<CourrierResponse>(API_CONFIG.COURRIERS.getCourrierById(id));
        return response.data.data!;
    }

    // Créer un nouveau courrier
    async createCourrier(courrierData: CreateCourrierDto): Promise<Courrier> {
        const response = await axiosInstance.post<CourrierResponse>(
            API_CONFIG.COURRIERS.createCourrierAvecClient,
            courrierData
        );
        return response.data.data!;
    }

    // Mettre à jour un courrier
    async updateCourrier(id: number, courrierData: Partial<Courrier>): Promise<Courrier> {
        const response = await axiosInstance.put<CourrierResponse>(
            API_CONFIG.COURRIERS.updateCourrier(id),
            courrierData
        );
        return response.data.data!;
    }

    // Supprimer un courrier
    async deleteCourrier(id: number): Promise<void> {
        await axiosInstance.delete(API_CONFIG.COURRIERS.deleteCourrier(id));
    }

    // Changer le statut d'un courrier
    async changeCourrierStatus(id: number, newStatus: StatusCourrier): Promise<Courrier> {
        const response = await axiosInstance.put<CourrierResponse>(
            API_CONFIG.COURRIERS.changerStatut(id),
            null,
            {
                params: { newStatus }
            }
        );
        return response.data.data!;
    }

    // Récupérer les courriers par statut
    async getCourriersByStatus(status: StatusCourrier): Promise<Courrier[]> {
        const response = await axiosInstance.get<CourrierListResponse>(
            API_CONFIG.COURRIERS.getCourrierByStatut(status)
        );
        return response.data.data || [];
    }
}

export const courrierService = new CourrierService();
