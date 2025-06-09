import React, { useState, useEffect } from 'react';
import { EmployeeForm } from '../../components/admin/EmployeeForm';
import { EmployeeList } from '../../components/admin/EmployeeList';
import { Employe, CreateEmployeRequest, CreateUserRequest, Agence, Vehicule } from '../../types/admin';
import { RoleEntity } from '../../types/auth';
import employeeService from '../../services/employeeService';
import agencyService from '../../services/agencyService';
import vehicleService from '../../services/vehicleService';
import Button from '../../components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';

const EmployeeManagement: React.FC = () => {
    const [employees, setEmployees] = useState<Employe[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employe[]>([]);
    const [agences, setAgences] = useState<Agence[]>([]);
    const [vehicules, setVehicules] = useState<Vehicule[]>([]);
    const [roles, setRoles] = useState<RoleEntity[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employe | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [employeesData, agencesData, vehiculesData, rolesData] = await Promise.all([
                employeeService.getAllEmployees(),
                agencyService.getAllAgencies(),
                vehicleService.getAllVehicles(),
                employeeService.getRoles()
            ]);
            setEmployees(employeesData);
            setFilteredEmployees(employeesData);
            setAgences(agencesData);
            setVehicules(vehiculesData);
            setRoles(rolesData);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des données');
            toast.error('Erreur lors du chargement des données');
            console.error('Erreur:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let filtered = employees;

        // Filtrage par recherche
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(emp => 
                emp.nom_emp.toLowerCase().includes(query) ||
                emp.prenom_emp.toLowerCase().includes(query) ||
                emp.empCin.toLowerCase().includes(query)
            );
        }

        // Filtrage par rôle
        if (selectedRoleId !== null) {
            filtered = filtered.filter(emp => emp.role?.id_role === selectedRoleId);
        }

        setFilteredEmployees(filtered);
    }, [employees, searchQuery, selectedRoleId]);

    const handleEdit = (employe: Employe) => {
        setSelectedEmployee(employe);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
            try {
                setIsLoading(true);
                await employeeService.deleteEmployee(id);
                setEmployees(prev => prev.filter(emp => emp.empCin !== id));
                toast.success('Employé supprimé avec succès');
            } catch (err) {
                setError('Erreur lors de la suppression de l\'employé');
                toast.error('Erreur lors de la suppression de l\'employé');
                console.error('Erreur:', err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleFormSubmit = async (data: CreateEmployeRequest, userData?: CreateUserRequest) => {
        try {
            setIsFormLoading(true);
            if (selectedEmployee) {
                await employeeService.updateEmployee(selectedEmployee.empCin, data, userData);
                toast.success('Employé mis à jour avec succès');
            } else {
                await employeeService.createEmployee(data, userData);
                toast.success('Employé créé avec succès');
            }
            fetchData();
            setIsModalOpen(false);
            setSelectedEmployee(null);
        } catch (err) {
            setError('Erreur lors de la sauvegarde de l\'employé');
            toast.error('Erreur lors de la sauvegarde de l\'employé');
            console.error('Erreur:', err);
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
    };

    const handleOpenCreateModal = () => {
        setSelectedEmployee(null);
        setIsModalOpen(true);
    };

    const roleFilterOptions = [
        { value: '', label: 'Tous les rôles' },
        ...roles.map(role => ({
            value: role.id_role.toString(),
            label: role.nom
        }))
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex-grow mr-4">
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Employés</h1>
                    <p className="text-gray-500 text-sm">Gérer les employés dans le système</p>
                </div>
                <Button
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2"
                    leftIcon={<PlusIcon className="h-5 w-5" />}
                >
                    Nouvel Employé
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <SearchBar
                    onSearch={setSearchQuery}
                    placeholder="Rechercher un employé..."
                    className="w-full md:w-1/2"
                />
                <Select
                    options={roleFilterOptions}
                    value={selectedRoleId === null ? '' : selectedRoleId.toString()}
                    onChange={(value) => setSelectedRoleId(value === '' ? null : parseInt(value))}
                    placeholder="Filtrer par rôle"
                    className="w-full md:w-1/4"
                />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <Card className="p-6">
                {isLoading ? (
                    <div className="text-center py-4">Chargement...</div>
                ) : (
                    <EmployeeList
                        employes={filteredEmployees}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isLoading={isLoading}
                    />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedEmployee ? 'Modifier l\'employé' : 'Nouvel employé'}
            >
                <EmployeeForm
                    initialData={selectedEmployee ? {
                        empCin: selectedEmployee.empCin,
                        nom_emp: selectedEmployee.nom_emp,
                        prenom_emp: selectedEmployee.prenom_emp,
                        emp_phone: selectedEmployee.emp_phone,
                        emp_adresse: selectedEmployee.emp_adresse,
                        id_agence: selectedEmployee.agence?.id_agence || 0,
                        id_role: selectedEmployee.role?.id_role || 0
                    } : undefined}
                    initialUserData={selectedEmployee?.utilisateur ? {
                        email: selectedEmployee.utilisateur.email,
                        mot_passe: '',
                        id_role: selectedEmployee.role?.id_role || 0
                    } : undefined}
                    onSubmit={handleFormSubmit}
                    agences={agences}
                    vehicules={vehicules}
                    roles={roles}
                    isLoading={isFormLoading}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default EmployeeManagement;    