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
import { getToken } from '../utils/auth';

class AgencyService {
    /**
     * Récupère la liste de toutes les adresses d'agences
     * @returns Promise<Agence[]> - Liste des adresses d'agences
     */
    async getAllAgencies(): Promise<Agence[]> {
        try {
            console.log('Fetching all agencies...');
            const token = getToken();
            console.log('Current auth token:', token);
            
            const response = await axiosInstance.get<string[]>(API_CONFIG.AGENCE.getAllAdresses);
            console.log('API Response:', response.data);
            const addresses = response.data;
            console.log('Addresses from API:', addresses);
            
            if (!Array.isArray(addresses)) {
                throw new Error('La réponse de l\'API n\'est pas un tableau d\'adresses');
            }
            
            // Convertir les adresses en objets Agence complets
            const agences = await Promise.all(
                addresses.map(async (adresse, index) => {
                    try {
                        console.log('Processing address:', adresse);
                        // Utiliser l'index + 1 comme ID temporaire
                        const tempId = index + 1;
                        const details = await this.getAgencyDetails(tempId);
                        console.log('Agency details:', details);
                        
                        if (!details) {
                            console.warn(`No details found for agency at address: ${adresse}`);
                            // Return a basic agency object instead of throwing
                            return {
                                id_agence: tempId,
                                nomAgence: `Agence ${tempId}`,
                                adresse_agence: adresse,
                                employes: [],
                                vehicules: []
                            };
                        }
                        
                        // Convertir les véhicules DTO en véhicules complets
                        const vehicules: Vehicule[] = details.vehicules.map(v => ({
                            immatriculation: v.immatriculation,
                            type: v.type,
                            capacite: v.capacite,
                            disponible: true, // Par défaut
                            agence: {
                                id_agence: tempId,
                                nomAgence: details.nomAgence,
                                adresse_agence: adresse
                            }
                        }));

                        const agence = {
                            id_agence: tempId,
                            nomAgence: details.nomAgence,
                            adresse_agence: adresse,
                            employes: details.employes,
                            vehicules: vehicules
                        };
                        console.log('Created agency object:', agence);
                        return agence;
                    } catch (error) {
                        console.error(`Error processing agency at address ${adresse}:`, error);
                        // Return a basic agency object instead of throwing
                        return {
                            id_agence: index + 1,
                            nomAgence: `Agence ${index + 1}`,
                            adresse_agence: adresse,
                            employes: [],
                            vehicules: []
                        };
                    }
                })
            );
            
            console.log('Final agencies array:', agences);
            return agences;
        } catch (error) {
            console.error('Error in getAllAgencies:', error);
            throw handleApiError(error);
        }
    }

    /**
     * Récupère une agence par son ID
     * @param id - ID de l'agence
     * @returns Promise<Agence> - Détails de l'agence
     */
    async getAgencyById(id: number): Promise<Agence> {
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
                    adresse_agence: id.toString()
                }
            }));

            return {
                id_agence: id,
                nomAgence: details.nomAgence,
                adresse_agence: id.toString(),
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
            //for token
            console.log(getToken());
            const response = await axiosInstance.post<AgenceDashboardResponse>(API_CONFIG.AGENCE.createAgence, data);
            console.log('Received response from API:', response);
            if (!response.data.data) {
                console.error('API response data is empty.', response);
                throw new Error('Réponse de l\'API vide lors de la création de l\'agence');
            }
            const newAgency = response.data.data;
            console.log('Extracted new agency data:', newAgency);
            
            const createdAgence: Agence = {
                id_agence: Number(newAgency.id),
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
    async updateAgency(id: number, data: CreateAgenceRequest): Promise<Agence> {
        try {
            console.log('=== Début de la mise à jour de l\'agence ===');
            console.log('ID de l\'agence à mettre à jour:', id);
            console.log('Données de mise à jour:', data);
            
            // Vérifier le token
            const token = getToken();
            console.log('Token actuel:', token ? 'Présent' : 'Absent');
            
            // Créer un objet Agence complet pour la mise à jour
            const agenceData = {
                id_agence: id,
                nomAgence: data.nomAgence,
                adresse_agence: data.adresse_agence
            };
            
            console.log('Données envoyées au serveur:', agenceData);
            console.log('URL de mise à jour:', API_CONFIG.AGENCE.updateAgence(id.toString()));
            
            const response = await axiosInstance.put<Agence>(
                API_CONFIG.AGENCE.updateAgence(id.toString()),
                agenceData
            );
            
            console.log('Réponse du serveur:', response.data);
            
            if (!response.data) {
                throw new Error('Réponse de l\'API vide lors de la mise à jour de l\'agence');
            }
            
            // Récupérer les détails complets de l'agence mise à jour
            console.log('Récupération des détails de l\'agence mise à jour...');
            const details = await this.getAgencyDetails(id);
            console.log('Détails récupérés:', details);
            
            if (!details) {
                throw new Error('Impossible de récupérer les détails de l\'agence mise à jour');
            }
            
            // Convertir les véhicules DTO en véhicules complets
            const vehicules: Vehicule[] = details.vehicules.map(v => ({
                immatriculation: v.immatriculation,
                type: v.type,
                capacite: v.capacite,
                disponible: true,
                agence: {
                    id_agence: id,
                    nomAgence: response.data.nomAgence,
                    adresse_agence: response.data.adresse_agence
                }
            }));
            
            const result = {
                id_agence: id,
                nomAgence: response.data.nomAgence,
                adresse_agence: response.data.adresse_agence,
                employes: details.employes,
                vehicules: vehicules
            };
            
            console.log('Résultat final:', result);
            console.log('=== Fin de la mise à jour de l\'agence ===');
            
            return result;
        } catch (error) {
            console.error('Erreur détaillée dans updateAgency:', error);
            throw handleApiError(error);
        }
    }

    /**
     * Supprime une agence
     * @param id - ID de l'agence à supprimer
     * @returns Promise<void>
     */
    async deleteAgency(id: number): Promise<void> {
        try {
            await axiosInstance.delete(API_CONFIG.AGENCE.deleteAgence(id.toString()));
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Récupère les détails d'une agence par son ID
     * @param id - ID de l'agence
     * @returns Promise<AgenceDetailsDto | null> - Détails de l'agence avec employés et véhicules
     */
    async getAgencyDetails(id: number): Promise<AgenceDetailsDto | null> {
        try {
            const response = await axiosInstance.get<AgenceDetailsResponse>(API_CONFIG.AGENCE.getDetailsAgence(id.toString()));
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
    async getAgencyStats(id: number): Promise<AgenceDashboardDto> {
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