import axiosInstance from '../config/axiosConfig';
import { API_CONFIG } from '../config/apiConfig';
import { Vehicule, CreateVehiculeRequest, VehiculeResponse, VehiculeListResponse } from '../types/admin';
import { handleApiError } from '../config/axiosConfig';

class VehicleService {
    /**
     * Récupère la liste de tous les véhicules
     * @returns Promise<Vehicule[]> - Liste des véhicules
     */
    async getAllVehicles(): Promise<Vehicule[]> {
        try {
            const response = await axiosInstance.get<VehiculeListResponse>(API_CONFIG.VEHICULE.getAllVehicules);
            return response.data.data;
        } catch (error) {
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
            const response = await axiosInstance.get<VehiculeResponse>(
                API_CONFIG.VEHICULE.getVehiculeByImmatriculation(immatriculation)
            );
            if (!response.data.data) {
                throw new Error('Véhicule non trouvé');
            }
            return response.data.data;
        } catch (error) {
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
            const response = await axiosInstance.post<VehiculeResponse>(
                API_CONFIG.VEHICULE.addVehicule,
                vehicleData
            );
            if (!response.data.data) {
                throw new Error('Erreur lors de la création du véhicule');
            }
            return response.data.data;
        } catch (error) {
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
            const response = await axiosInstance.put<VehiculeResponse>(
                API_CONFIG.VEHICULE.updateVehicule(immatriculation),
                vehicleData
            );
            if (!response.data.data) {
                throw new Error('Erreur lors de la mise à jour du véhicule');
            }
            return response.data.data;
        } catch (error) {
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
            await axiosInstance.delete(API_CONFIG.VEHICULE.deleteVehicule(immatriculation));
        } catch (error) {
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
            const vehicle = await this.getVehicleByImmatriculation(immatriculation);
            return !vehicle.transporteurVehicule;
        } catch (error) {
            throw handleApiError(error);
        }
    }
}

export default new VehicleService(); 