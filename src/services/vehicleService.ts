import axiosInstance from '../config/axiosConfig';
import { API_CONFIG } from '../config/apiConfig';
import { Vehicule, CreateVehiculeRequest, VehiculeResponse, VehiculeListResponse, VehiculeDashboardDto, Agence } from '../types/admin';
import { handleApiError } from '../config/axiosConfig';
import { getToken } from '../utils/auth';
import agencyService from './agencyService';

class VehicleService {
    /**
     * Récupère la liste de tous les véhicules
     * @returns Promise<Vehicule[]> - Liste des véhicules
     */
    async getAllVehicles(): Promise<Vehicule[]> {
        try {
            console.log('Fetching all vehicles...');
            const token = getToken();
            console.log('Current auth token:', token ? 'Present' : 'Absent');
            
            // Récupérer les véhicules et les agences
            const [vehiclesResponse, agencies] = await Promise.all([
                axiosInstance.get<VehiculeDashboardDto[]>(API_CONFIG.VEHICULE.getAllVehicules),
                agencyService.getAllAgencies()
            ]);
            
            console.log('Vehicles Response:', vehiclesResponse.data);
            console.log('Agencies:', agencies);
            
            // Associer les agences aux véhicules
            const vehicles: Vehicule[] = vehiclesResponse.data.map(dto => {
                // Trouver l'agence correspondante par son nom
                const agence = agencies.find(a => a.nomAgence === dto.nommAgence);
                if (!agence) {
                    console.warn(`Agence non trouvée pour le véhicule ${dto.immatriculation}`);
                }
                return {
                    immatriculation: dto.immatriculation,
                    type: dto.type,
                    capacite: dto.capacite,
                    agence: agence
                };
            });
            
            // Mettre à jour le nombre de véhicules dans chaque agence
            agencies.forEach(agence => {
                agence.vehicules = vehicles.filter(v => v.agence?.id_agence === agence.id_agence);
            });
            
            return vehicles;
        } catch (error) {
            console.error('Error in getAllVehicles:', error);
            throw handleApiError(error);
        }
    }

    /**
     * Récupère un véhicule par son immatriculation
     * @param immatriculation - Immatriculation du véhicule
     * @returns Promise<Vehicule> - Détails du véhicule
     */
    async getVehicleByImmatriculation(immatriculation: string): Promise<Vehicule> {
        try {
            console.log('Fetching vehicle with immatriculation:', immatriculation);
            const response = await axiosInstance.get<VehiculeResponse>(
                API_CONFIG.VEHICULE.getVehiculeByImmatriculation(immatriculation)
            );
            if (!response.data.data) {
                throw new Error('Véhicule non trouvé');
            }
            return response.data.data;
        } catch (error) {
            console.error('Error in getVehicleByImmatriculation:', error);
            throw handleApiError(error);
        }
    }

    /**
     * Récupère les véhicules d'une agence
     * @param agenceId - ID de l'agence
     * @returns Promise<Vehicule[]> - Liste des véhicules de l'agence
     */
    async getVehiclesByAgency(agenceId: string): Promise<Vehicule[]> {
        try {
            const response = await axiosInstance.get<VehiculeListResponse>(
                `${API_CONFIG.VEHICULE.BASE}/agence/${agenceId}`
            );
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Récupère les véhicules disponibles (non associés à un transporteur)
     * @returns Promise<Vehicule[]> - Liste des véhicules disponibles
     */
    async getAvailableVehicles(): Promise<Vehicule[]> {
        try {
            const response = await axiosInstance.get<VehiculeListResponse>(
                `${API_CONFIG.VEHICULE.BASE}/available`
            );
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    /**
     * Crée un nouveau véhicule
     * @param vehicleData - Données du véhicule à créer
     * @returns Promise<Vehicule> - Véhicule créé
     */
    async createVehicle(vehicleData: CreateVehiculeRequest): Promise<Vehicule> {
        try {
            console.log('Creating new vehicle with data:', vehicleData);
            const token = getToken();
            console.log('Current auth token:', token ? 'Present' : 'Absent');
            
            const response = await axiosInstance.post<VehiculeResponse>(
                API_CONFIG.VEHICULE.addVehicule,
                vehicleData
            );
            console.log('API Response:', response.data);
            
            if (!response.data.data) {
                throw new Error('Erreur lors de la création du véhicule');
            }
            return response.data.data;
        } catch (error: any) {
            console.error('Error in createVehicle:', error);
            console.error('Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers
            });
            throw handleApiError(error);
        }
    }

    /**
     * Met à jour un véhicule existant
     * @param immatriculation - Immatriculation du véhicule à mettre à jour
     * @param vehicleData - Nouvelles données du véhicule
     * @returns Promise<Vehicule> - Véhicule mis à jour
     */
    async updateVehicle(immatriculation: string, vehicleData: CreateVehiculeRequest): Promise<Vehicule> {
        try {
            console.log('=== Début de la mise à jour du véhicule ===');
            console.log('Immatriculation:', immatriculation);
            console.log('Données de mise à jour:', vehicleData);
            
            const token = getToken();
            console.log('Current auth token:', token ? 'Present' : 'Absent');
            
            const response = await axiosInstance.put<VehiculeResponse>(
                API_CONFIG.VEHICULE.updateVehicule(immatriculation),
                vehicleData
            );
            console.log('API Response:', response.data);
            
            if (!response.data.data) {
                throw new Error('Erreur lors de la mise à jour du véhicule');
            }
            return response.data.data;
        } catch (error) {
            console.error('Error in updateVehicle:', error);
            throw handleApiError(error);
        }
    }

    /**
     * Supprime un véhicule
     * @param immatriculation - Immatriculation du véhicule à supprimer
     * @returns Promise<void>
     */
    async deleteVehicle(immatriculation: string): Promise<void> {
        try {
            console.log('Deleting vehicle with immatriculation:', immatriculation);
            const token = getToken();
            console.log('Current auth token:', token ? 'Present' : 'Absent');
            
            await axiosInstance.delete(API_CONFIG.VEHICULE.deleteVehicule(immatriculation));
            console.log('Vehicle deleted successfully');
        } catch (error) {
            console.error('Error in deleteVehicle:', error);
            throw handleApiError(error);
        }
    }

    /**
     * Vérifie si un véhicule est disponible pour être associé à un transporteur
     * @param immatriculation - Immatriculation du véhicule
     * @returns Promise<boolean> - true si le véhicule est disponible
     */
    async isVehicleAvailable(immatriculation: string): Promise<boolean> {
        try {
            console.log('Checking availability for vehicle:', immatriculation);
            const vehicle = await this.getVehicleByImmatriculation(immatriculation);
            const isAvailable = !vehicle.transporteurVehicule;
            console.log('Vehicle availability:', isAvailable);
            return isAvailable;
        } catch (error) {
            console.error('Error in isVehicleAvailable:', error);
            throw handleApiError(error);
        }
    }
}

export default new VehicleService(); 