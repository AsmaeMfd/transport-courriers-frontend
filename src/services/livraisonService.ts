import axiosInstance from '../config/axiosConfig';
import { API_CONFIG } from '../config/apiConfig';
import { Courrier } from '../types/operator';

export interface Livraison {
    id: number;
    courrierId: number;
    dateEnvoi: string;
    vehiculeId: string;
    transporteurId: string;
    courrier: Courrier;
}

export interface CreateLivraisonDto {
    courrierId: number;
    dateEnvoi: string;
    vehiculeId: string;
    transporteurId: string;
}

class LivraisonService {
    // Créer une nouvelle livraison
    async createLivraison(livraisonData: CreateLivraisonDto): Promise<Livraison> {
        const response = await axiosInstance.post<Livraison>(
            `${API_CONFIG.COURRIERS.BASE}/livraison`,
            livraisonData
        );
        return response.data;
    }

    // Récupérer une livraison par ID
    async getLivraisonById(id: number): Promise<Livraison> {
        const response = await axiosInstance.get<Livraison>(
            `${API_CONFIG.COURRIERS.BASE}/livraison/${id}`
        );
        return response.data;
    }

    // Récupérer toutes les livraisons
    async getAllLivraisons(): Promise<Livraison[]> {
        const response = await axiosInstance.get<Livraison[]>(
            `${API_CONFIG.COURRIERS.BASE}/livraisons`
        );
        return response.data;
    }

    // Mettre à jour une livraison
    async updateLivraison(id: number, livraisonData: Partial<Livraison>): Promise<Livraison> {
        const response = await axiosInstance.put<Livraison>(
            `${API_CONFIG.COURRIERS.BASE}/livraison/${id}`,
            livraisonData
        );
        return response.data;
    }

    // Supprimer une livraison
    async deleteLivraison(id: number): Promise<void> {
        await axiosInstance.delete(`${API_CONFIG.COURRIERS.BASE}/livraison/${id}`);
    }

    // Récupérer les livraisons par transporteur
    async getLivraisonsByTransporteur(transporteurId: string): Promise<Livraison[]> {
        const response = await axiosInstance.get<Livraison[]>(
            `${API_CONFIG.COURRIERS.BASE}/livraisons/transporteur/${transporteurId}`
        );
        return response.data;
    }

    // Récupérer les livraisons par véhicule
    async getLivraisonsByVehicule(vehiculeId: string): Promise<Livraison[]> {
        const response = await axiosInstance.get<Livraison[]>(
            `${API_CONFIG.COURRIERS.BASE}/livraisons/vehicule/${vehiculeId}`
        );
        return response.data;
    }
}

export const livraisonService = new LivraisonService(); 