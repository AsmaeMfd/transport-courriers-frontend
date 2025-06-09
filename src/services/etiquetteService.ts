import axiosInstance from '../config/axiosConfig';
import { API_CONFIG } from '../config/apiConfig';

export interface Etiquette {
    id: number;
    courrierId: number;
    codeTracking: string;
    dateCreation: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

class EtiquetteService {
    // Générer une étiquette pour un courrier
    async generateEtiquette(courrierId: number): Promise<Etiquette> {
        const response = await axiosInstance.post<ApiResponse<Etiquette>>(
            `${API_CONFIG.COURRIERS.BASE}/etiquette/generate/${courrierId}`
        );
        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Erreur lors de la génération de l\'étiquette');
        }
        return response.data.data;
    }

    // Récupérer une étiquette par ID
    async getEtiquetteById(id: number): Promise<Etiquette> {
        const response = await axiosInstance.get<ApiResponse<Etiquette>>(
            `${API_CONFIG.COURRIERS.BASE}/etiquette/${id}`
        );
        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Étiquette non trouvée');
        }
        return response.data.data;
    }

    // Récupérer une étiquette par code de suivi
    async getEtiquetteByTrackingCode(codeTracking: string): Promise<Etiquette> {
        const response = await axiosInstance.get<ApiResponse<Etiquette>>(
            `${API_CONFIG.COURRIERS.BASE}/etiquette/tracking/${codeTracking}`
        );
        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Étiquette non trouvée');
        }
        return response.data.data;
    }

    // Générer le PDF d'une étiquette
    async generateEtiquettePDF(id: number): Promise<Blob> {
        const response = await axiosInstance.get<Blob>(
            `${API_CONFIG.COURRIERS.BASE}/etiquette/${id}/pdf`,
            { 
                responseType: 'blob',
                headers: {
                    'Accept': 'application/pdf'
                }
            }
        );
        return response.data;
    }

    // Générer le PDF d'une étiquette par code de suivi
    async generateEtiquettePDFByTrackingCode(codeTracking: string): Promise<Blob> {
        const response = await axiosInstance.get<Blob>(
            `${API_CONFIG.COURRIERS.BASE}/etiquette/tracking/${codeTracking}/pdf`,
            { 
                responseType: 'blob',
                headers: {
                    'Accept': 'application/pdf'
                }
            }
        );
        return response.data;
    }
}

export const etiquetteService = new EtiquetteService(); 