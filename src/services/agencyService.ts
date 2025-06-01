import axiosInstance from '../config/axiosConfig';
import { API_CONFIG } from '../config/apiConfig';
import { 
    Agence, 
    CreateAgenceRequest, 
    AgenceResponse, 
    AgenceListResponse, 
    AgenceDashboardDto,
    AgenceDetailsDto,
    AgenceDashboardResponse,
    AgenceDetailsResponse,
    Vehicule
} from '../types/admin';
import { handleApiError } from '../config/axiosConfig';

class AgencyService {
    /**
     * Récupère la liste de toutes les adresses d'agences
     * @returns Promise<Agence[]> - Liste des adresses d'agences
     */
    async getAllAgencies(): Promise<Agence[]> {
        try {
            const response = await axiosInstance.get<AgenceListResponse>(API_CONFIG.AGENCE.getAllAdresses);
            const addresses = response.data.data;
            
            // Convertir les adresses en objets Agence complets
            const agences = await Promise.all(
                addresses.map(async (adresse) => {
                    const details = await this.getAgencyDetails(adresse);
                    if (!details) throw new Error('Détails de l\'agence non trouvés pour l\'adresse: ' + adresse);
                    
                    // Convertir les véhicules DTO en véhicules complets
                    const vehicules: Vehicule[] = details.vehicules.map(v => ({
                        immatriculation: v.immatriculation,
                        type: v.type,
                        capacite: v.capacite,
                        disponible: true, // Par défaut
                        agence: {
                            id_agence: adresse,
                            nomAgence: details.nomAgence,
                            adresse_agence: adresse
                        }
                    }));

                    return {
                        id_agence: adresse,
                        nomAgence: details.nomAgence,
                        adresse_agence: adresse,
                        employes: details.employes,
                        vehicules: vehicules
                    };
                })
            );
            
            return agences;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Récupère une agence par son ID
     * @param id - ID de l'agence
     * @returns Promise<Agence> - Détails de l'agence
     */
    async getAgencyById(id: string): Promise<Agence> {
        try {
            const details = await this.getAgencyDetails(id);
            if (!details) throw new Error('Agence non trouvée avec l\'ID : ' + id);

            // Convertir les véhicules DTO en véhicules complets
            const vehicules: Vehicule[] = details.vehicules.map(v => ({
                immatriculation: v.immatriculation,
                type: v.type,
                capacite: v.capacite,
                disponible: true, // Par défaut
                agence: {
                    id_agence: id,
                    nomAgence: details.nomAgence,
                    adresse_agence: id
                }
            }));

            return {
                id_agence: id,
                nomAgence: details.nomAgence,
                adresse_agence: id,
                employes: details.employes,
                vehicules: vehicules
            };
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Crée une nouvelle agence
     * @param data - Données de l'agence à créer
     * @returns Promise<Agence> - Agence créée
     */
    async createAgency(data: CreateAgenceRequest): Promise<Agence> {
        // --- Début des logs ---
        console.log('AgencyService.createAgency called with data:', data);
        try {
            console.log('Sending POST request to:', API_CONFIG.AGENCE.createAgence);
            const response = await axiosInstance.post<AgenceDashboardResponse>(API_CONFIG.AGENCE.createAgence, data);
            console.log('Received response from API:', response);
            if (!response.data.data) {
                console.error('API response data is empty.', response);
                throw new Error('Réponse de l\'API vide lors de la création de l\'agence');
            }
            const newAgency = response.data.data;
            console.log('Extracted new agency data:', newAgency);
            
            const createdAgence: Agence = {
                id_agence: newAgency.id,
                nomAgence: newAgency.nom,
                adresse_agence: newAgency.adresse,
                employes: [], // Nouvelle agence n'a pas d'employés/véhicules initialement
                vehicules: []
            };
            console.log('Converted to Agence type:', createdAgence);
            
            return createdAgence;
        } catch (error) {
            // --- Début des logs ---
            console.error('Error in AgencyService.createAgency:', error);
            throw handleApiError(error);
        }
    }

    /**
     * Met à jour une agence existante
     * @param id - ID de l'agence à mettre à jour
     * @param data - Nouvelles données de l'agence
     * @returns Promise<Agence> - Agence mise à jour
     */
    async updateAgency(id: string, data: CreateAgenceRequest): Promise<Agence> {
        try {
            const response = await axiosInstance.put<AgenceDashboardResponse>(API_CONFIG.AGENCE.updateAgence(id), data);
            if (!response.data.data) throw new Error('Réponse de l\'API vide lors de la mise à jour de l\'agence');
            const updatedAgency = response.data.data;
            
            return {
                id_agence: updatedAgency.id,
                nomAgence: updatedAgency.nom,
                adresse_agence: updatedAgency.adresse,
                employes: [], // Les détails complets seront chargés lors de la sélection
                vehicules: []
            };
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Supprime une agence
     * @param id - ID de l'agence à supprimer
     * @returns Promise<void>
     */
    async deleteAgency(id: string): Promise<void> {
        try {
            await axiosInstance.delete(API_CONFIG.AGENCE.deleteAgence(id));
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Récupère les détails d'une agence par son ID
     * @param id - ID de l'agence (adresse)
     * @returns Promise<AgenceDetailsDto | null> - Détails de l'agence avec employés et véhicules
     */
    async getAgencyDetails(id: string): Promise<AgenceDetailsDto | null> {
        try {
            const response = await axiosInstance.get<AgenceDetailsResponse>(API_CONFIG.AGENCE.getDetailsAgence(id));
            return response.data.data || null;
        } catch (error) {
            // Ne pas lancer d'erreur ici, car l'agence pourrait ne pas exister (ex: nouvelle agence)
            return null;
        }
    }

    /**
     * Récupère les statistiques d'une agence
     * @param id - ID de l'agence
     * @returns Promise<AgenceDashboardDto> - Statistiques de l'agence
     */
    async getAgencyStats(id: string): Promise<AgenceDashboardDto> {
        try {
            const response = await axiosInstance.get<AgenceDashboardResponse>(`${API_CONFIG.AGENCE.BASE}/stats/${id}`);
            if (!response.data.data) throw new Error('Réponse de l\'API vide lors de la récupération des statistiques');
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
}

export default new AgencyService();