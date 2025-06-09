import React, { useState, useEffect } from 'react';
import { VehicleForm } from '../../components/admin/VehicleForm';
import { VehicleList } from '../../components/admin/VehicleList';
import { Vehicule, VehiculeListResponse, AgenceListResponse, CreateVehiculeRequest } from '../../types/admin';
import { Agence } from '../../types/admin';
import vehicleService from '../../services/vehicleService';
import agencyService from '../../services/agencyService';
import Button from '../../components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';
import SearchBar from '../../components/ui/SearchBar';

const VehicleManagement: React.FC = () => {
    console.log('VehicleManagement component rendering');
    
    const [vehicules, setVehicules] = useState<Vehicule[]>([]);
    const [agences, setAgences] = useState<Agence[]>([]);
    const [selectedVehicule, setSelectedVehicule] = useState<Vehicule | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        console.log('VehicleManagement useEffect running');
        loadVehicles();
        loadAgencies();
    }, []);

    const loadVehicles = async () => {
        console.log('Loading vehicles...');
        try {
            setIsLoading(true);
            const response = await vehicleService.getAllVehicles();
            console.log('Vehicles loaded:', response);
            setVehicules(response || []);
        } catch (error) {
            console.error('Error loading vehicles:', error);
            toast.error('Erreur lors du chargement des véhicules');
            setVehicules([]);
        } finally {
            setIsLoading(false);
        }
    };

    const loadAgencies = async () => {
        console.log('Loading agencies...');
        try {
            const response = await agencyService.getAllAgencies();
            console.log('Agencies loaded:', response);
            setAgences(response || []);
        } catch (error) {
            console.error('Error loading agencies:', error);
            toast.error('Erreur lors du chargement des agences');
            setAgences([]);
        }
    };

    const handleCreate = async (vehicleData: CreateVehiculeRequest) => {
        console.log('Creating vehicle with data:', vehicleData);
        try {
            setIsFormLoading(true);
            const response = await vehicleService.createVehicle(vehicleData);
            console.log('Vehicle created:', response);
            setVehicules(prev => [...prev, response]);
            setIsModalOpen(false);
            toast.success('Véhicule créé avec succès');
        } catch (error) {
            console.error('Error creating vehicle:', error);
            toast.error('Erreur lors de la création du véhicule');
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleUpdate = async (vehicleData: CreateVehiculeRequest) => {
        if (!selectedVehicule) return;
        console.log('Updating vehicle:', selectedVehicule.immatriculation, 'with data:', vehicleData);
        try {
            setIsFormLoading(true);
            const response = await vehicleService.updateVehicle(selectedVehicule.immatriculation, vehicleData);
            console.log('Vehicle updated:', response);
            setVehicules(prev => prev.map(v => v.immatriculation === response.immatriculation ? response : v));
            setSelectedVehicule(null);
            setIsModalOpen(false);
            toast.success('Véhicule mis à jour avec succès');
        } catch (error) {
            console.error('Error updating vehicle:', error);
            toast.error('Erreur lors de la mise à jour du véhicule');
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleDelete = async (immatriculation: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
            console.log('Deleting vehicle:', immatriculation);
            try {
                setIsLoading(true);
                const isAvailable = await vehicleService.isVehicleAvailable(immatriculation);
                if (!isAvailable) {
                    toast.error('Impossible de supprimer un véhicule associé à un transporteur');
                    return;
                }
                await vehicleService.deleteVehicle(immatriculation);
                setVehicules(prev => prev.filter(v => v.immatriculation !== immatriculation));
                toast.success('Véhicule supprimé avec succès');
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                toast.error('Erreur lors de la suppression du véhicule');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleEdit = (vehicule: Vehicule) => {
        console.log('Editing vehicle:', vehicule);
        setSelectedVehicule(vehicule);
        setIsModalOpen(true);
    };

    const handleOpenCreateModal = () => {
        console.log('Opening create modal');
        setSelectedVehicule(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        console.log('Closing modal');
        setIsModalOpen(false);
        setSelectedVehicule(null);
    };

    const filteredVehicules = Array.isArray(vehicules) ? vehicules.filter(vehicule =>
        vehicule.immatriculation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicule.type.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    console.log('Rendering VehicleManagement with state:', {
        vehicules: vehicules?.length || 0,
        agences: agences?.length || 0,
        isLoading,
        isModalOpen,
        searchQuery
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex-grow mr-4">
                    <h1 className="text-2xl font-bold">Gestion des Véhicules</h1>
                    <p className="text-gray-500 text-sm">Gérer les véhicules dans le système</p>
                </div>
                <Button
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2"
                    leftIcon={<PlusIcon className="h-5 w-5" />}
                >
                    Nouveau Véhicule
                </Button>
            </div>

            <div className="mb-4">
                <SearchBar
                    onSearch={setSearchQuery}
                    placeholder="Rechercher un véhicule..."
                    className="w-full max-w-sm"
                />
            </div>

            <Card className="p-6">
                {isLoading ? (
                    <div className="text-center py-4">Chargement...</div>
                ) : (
                    <VehicleList
                        vehicules={filteredVehicules}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isLoading={isLoading}
                    />
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedVehicule ? 'Modifier le véhicule' : 'Nouveau véhicule'}
            >
                <VehicleForm
                    initialData={selectedVehicule ? {
                        immatriculation: selectedVehicule.immatriculation,
                        type: selectedVehicule.type,
                        capacite: selectedVehicule.capacite,
                        id_agence: selectedVehicule.agence?.id_agence
                    } : undefined}
                    onSubmit={selectedVehicule ? handleUpdate : handleCreate}
                    agences={agences}
                    isLoading={isFormLoading}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default VehicleManagement;    