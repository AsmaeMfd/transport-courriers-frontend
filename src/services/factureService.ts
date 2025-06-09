import axiosInstance from '../config/axiosConfig';
import { API_CONFIG } from '../config/apiConfig';
import { Courrier } from '../types/operator';

export interface Facture {
    id: number;
    courrierId: number;
    montant: number;
    dateEmission: string;
    statutPaiement: 'PAYE' | 'NON_PAYE';
    courrier: Courrier;
}

export interface CreateFactureDto {
    courrierId: number;
    statutPaiement: 'PAYE' | 'NON_PAYE';
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

class FactureService {
    // Créer une nouvelle facture
    async createFacture(factureData: CreateFactureDto): Promise<Facture> {
        const response = await axiosInstance.post<ApiResponse<Facture>>(
            `${API_CONFIG.COURRIERS.BASE}/facture/create`,
            factureData
        );
        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Erreur lors de la création de la facture');
        }
        return response.data.data;
    }

    // Récupérer une facture par ID
    async getFactureById(id: number): Promise<Facture> {
        const response = await axiosInstance.get<ApiResponse<Facture>>(
            `${API_CONFIG.COURRIERS.BASE}/facture/${id}`
        );
        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Facture non trouvée');
        }
        return response.data.data;
    }

    // Récupérer toutes les factures
    async getAllFactures(): Promise<Facture[]> {
        const response = await axiosInstance.get<ApiResponse<Facture[]>>(
            `${API_CONFIG.COURRIERS.BASE}/factures/all`
        );
        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Erreur lors de la récupération des factures');
        }
        return response.data.data;
    }

    // Mettre à jour le statut de paiement d'une facture
    async updateFactureStatus(id: number, statutPaiement: 'PAYE' | 'NON_PAYE'): Promise<Facture> {
        const response = await axiosInstance.put<ApiResponse<Facture>>(
            `${API_CONFIG.COURRIERS.BASE}/facture/${id}/status`,
            { statutPaiement }
        );
        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || 'Erreur lors de la mise à jour du statut');
        }
        return response.data.data;
    }

    // Générer le PDF d'une facture
    async generateFacturePDF(id: number): Promise<Blob> {
        const response = await axiosInstance.get<Blob>(
            `${API_CONFIG.COURRIERS.BASE}/facture/${id}/pdf`,
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

export const factureService = new FactureService(); 