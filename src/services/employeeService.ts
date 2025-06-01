import axiosInstance from '../config/axiosConfig';
import { API_CONFIG } from '../config/apiConfig';
import { 
    Employe, 
    CreateEmployeRequest, 
    EmployeResponse, 
    EmployeListResponse,
    CreateUserRequest
} from '../types/admin';
import { RoleEntity } from '../types/auth';
import { handleApiError } from '../config/axiosConfig';

class EmployeeService {
    async getAllEmployees(): Promise<Employe[]> {
        try {
            const response = await axiosInstance.get<EmployeListResponse>(API_CONFIG.EMPLOYE.BASE);
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async getEmployeeByCin(cin: string): Promise<Employe> {
        try {
            const response = await axiosInstance.get<EmployeResponse>(
                API_CONFIG.EMPLOYE.getEmployeByCin(cin)
            );
            if (!response.data.data) {
                throw new Error('Employé non trouvé');
            }
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async createEmployee(employeeData: CreateEmployeRequest, userData?: CreateUserRequest): Promise<Employe> {
        try {
            let response;
            
            if (userData) {
                // Création d'un employé avec compte utilisateur (opérateur)
                response = await axiosInstance.post<EmployeResponse>(
                    API_CONFIG.UTILISATEUR.createUtilisateurWithEmploye,
                    {
                        employe: employeeData,
                        utilisateur: userData
                    }
                );
            } else {
                // Création d'un employé sans compte utilisateur (transporteur)
                response = await axiosInstance.post<EmployeResponse>(
                    API_CONFIG.EMPLOYE.createEmploye,
                    employeeData
                );
            }

            if (!response.data.data) {
                throw new Error('Erreur lors de la création de l\'employé');
            }
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async updateEmployee(cin: string, employeeData: CreateEmployeRequest, userData?: CreateUserRequest): Promise<Employe> {
        try {
            let response;
            
            if (userData) {
                // Mise à jour d'un employé avec compte utilisateur
                response = await axiosInstance.put<EmployeResponse>(
                    `${API_CONFIG.EMPLOYE.BASE}/${cin}/with-user`,
                    {
                        employe: employeeData,
                        utilisateur: userData
                    }
                );
            } else {
                // Mise à jour d'un employé sans compte utilisateur
                response = await axiosInstance.put<EmployeResponse>(
                    `${API_CONFIG.EMPLOYE.BASE}/${cin}`,
                    employeeData
                );
            }

            if (!response.data.data) {
                throw new Error('Erreur lors de la mise à jour de l\'employé');
            }
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async deleteEmployee(cin: string): Promise<void> {
        try {
            await axiosInstance.delete(`${API_CONFIG.EMPLOYE.BASE}/${cin}`);
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async getRoles(): Promise<RoleEntity[]> {
        try {
            const response = await axiosInstance.get<{ data: RoleEntity[] }>('/roles');
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async getEmployeesByAgency(agencyId: string): Promise<Employe[]> {
        try {
            const response = await axiosInstance.get<EmployeListResponse>(
                `${API_CONFIG.EMPLOYE.BASE}/agence/${agencyId}`
            );
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async getEmployeesByRole(roleId: number): Promise<Employe[]> {
        try {
            const response = await axiosInstance.get<EmployeListResponse>(
                `${API_CONFIG.EMPLOYE.BASE}/role/${roleId}`
            );
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async assignVehicleToTransporter(transporterCin: string, vehiculeId: string): Promise<Employe> {
        try {
            const response = await axiosInstance.put<EmployeResponse>(
                `${API_CONFIG.EMPLOYE.BASE}/${transporterCin}/vehicule/${vehiculeId}`
            );
            if (!response.data.data) {
                throw new Error('Erreur lors de l\'association du véhicule');
            }
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    async removeVehicleFromTransporter(transporterCin: string): Promise<Employe> {
        try {
            const response = await axiosInstance.delete<EmployeResponse>(
                `${API_CONFIG.EMPLOYE.BASE}/${transporterCin}/vehicule`
            );
            if (!response.data.data) {
                throw new Error('Erreur lors de la dissociation du véhicule');
            }
            return response.data.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }
}

export default new EmployeeService();