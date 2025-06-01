import React, { useState, useEffect } from 'react';
import { VehicleForm } from '../../components/admin/VehicleForm';
import { VehicleList } from '../../components/admin/VehicleList';
import { Vehicule, VehiculeListResponse, AgenceListResponse } from '../../types/admin';
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
    const [vehicules, setVehicules] = useState<Vehicule[]>([]);
    const [agences, setAgences] = useState<Agence[]>([]);
    const [selectedVehicule, setSelectedVehicule] = useState<Vehicule | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadVehicles();
        loadAgencies();
    }, []);

    const loadVehicles = async () => {
        try {
            setIsLoading(true);
            const response = await vehicleService.getAllVehicles();
            setVehicules(response);
        } catch (error) {
            toast.error('Erreur lors du chargement des véhicules');
        } finally {
            setIsLoading(false);
        }
    };

    const loadAgencies = async () => {
        try {
            const response = await agencyService.getAllAgencies();
            setAgences(response);
        } catch (error) {
            toast.error('Erreur lors du chargement des agences');
        }
    };

    const handleCreate = async (vehicleData: any) => {
        try {
            setIsFormLoading(true);
            const response = await vehicleService.createVehicle(vehicleData);
            setVehicules([...vehicules, response]);
            setIsModalOpen(false);
            toast.success('Véhicule créé avec succès');
        } catch (error) {
            toast.error('Erreur lors de la création du véhicule');
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleUpdate = async (vehicleData: any) => {
        if (!selectedVehicule) return;
        try {
            setIsFormLoading(true);
            const response = await vehicleService.updateVehicle(selectedVehicule.immatriculation, vehicleData);
            setVehicules(vehicules.map(v => v.immatriculation === response.immatriculation ? response : v));
            setSelectedVehicule(null);
            setIsModalOpen(false);
            toast.success('Véhicule mis à jour avec succès');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour du véhicule');
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleDelete = async (immatriculation: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
            try {
                setIsLoading(true);
                const isAvailable = await vehicleService.isVehicleAvailable(immatriculation);
                if (!isAvailable) {
                    toast.error('Impossible de supprimer un véhicule associé à un transporteur');
                    return;
                }
                await vehicleService.deleteVehicle(immatriculation);
                setVehicules(vehicules.filter(v => v.immatriculation !== immatriculation));
                toast.success('Véhicule supprimé avec succès');
            } catch (error) {
                toast.error('Erreur lors de la suppression du véhicule');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleEdit = (vehicule: Vehicule) => {
        setSelectedVehicule(vehicule);
        setIsModalOpen(true);
    };

    const handleOpenCreateModal = () => {
        setSelectedVehicule(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedVehicule(null);
    };

    const filteredVehicules = vehicules.filter(vehicule =>
        vehicule.immatriculation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicule.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        id_agence: selectedVehicule.agence?.id_agence || ''
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