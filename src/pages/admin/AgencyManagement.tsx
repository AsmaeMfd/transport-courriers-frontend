import React, { useState, useEffect } from 'react';
import { AgencyForm } from '../../components/admin/AgencyForm';
import { AgencyList } from '../../components/admin/AgencyList';
import { Agence, CreateAgenceRequest } from '../../types/admin';
import agencyService from '../../services/agencyService';
import Button from '../../components/ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';
import SearchBar from '../../components/ui/SearchBar';

const AgencyManagement: React.FC = () => {
    const [agences, setAgences] = useState<Agence[]>([]);
    const [selectedAgence, setSelectedAgence] = useState<Agence | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const loadAgencies = async () => {
        try {
            setIsLoading(true);
            const agencesList = await agencyService.getAllAgencies();
            setAgences(agencesList);
        } catch (error) {
            toast.error('Erreur lors du chargement des agences');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAgencies();
    }, []);

    const handleCreate = async (data: CreateAgenceRequest) => {
        console.log('handleCreate called with data:', data);
        setIsFormLoading(true);
        try {
            console.log('Calling agencyService.createAgency...');
            const newAgency = await agencyService.createAgency(data);
            console.log('agencyService.createAgency succeeded, received:', newAgency);
            setAgences(prev => [...prev, newAgency]);
            console.log('Agency added to state.');
            setIsModalOpen(false);
            console.log('Modal closed.');
            toast.success('Agence créée avec succès');
        } catch (error) {
            console.error('Error in handleCreate:', error);
            toast.error('Erreur lors de la création de l\'agence');
        } finally {
            console.log('handleCreate finished, setting isFormLoading(false).');
            setIsFormLoading(false);
        }
    };

    const handleUpdate = async (data: CreateAgenceRequest) => {
        if (!selectedAgence) return;
        try {
            setIsFormLoading(true);
            const updatedAgency = await agencyService.updateAgency(selectedAgence.id_agence, data);
            setAgences(prev => prev.map(a => a.id_agence === updatedAgency.id_agence ? updatedAgency : a));
            setIsModalOpen(false);
            setSelectedAgence(null);
            toast.success('Agence mise à jour avec succès');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour de l\'agence');
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) {
            setIsLoading(true);
            try {
                const details = await agencyService.getAgencyDetails(id);
                if (details && (details.employes.length > 0 || details.vehicules.length > 0)) {
                    toast.error('Impossible de supprimer cette agence car elle contient des employés ou des véhicules.');
                    return;
                }
                await agencyService.deleteAgency(id);
                setAgences(prev => prev.filter(a => a.id_agence !== id));
                toast.success('Agence supprimée avec succès');
            } catch (error) {
                toast.error('Erreur lors de la suppression de l\'agence.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleEdit = (agence: Agence) => {
        setSelectedAgence(agence);
        setIsModalOpen(true);
    };

    const handleOpenCreateModal = () => {
        setSelectedAgence(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAgence(null);
    };

    const filteredAgences = agences.filter(agence =>
        agence.nomAgence.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agence.adresse_agence.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agence.id_agence.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex-grow mr-4">
                    <h1 className="text-2xl font-bold">Agences</h1>
                    <p className="text-gray-500 text-sm">Gérer les agences de coursiers dans le système</p>
                </div>
                
                <div className="flex-grow"></div>
                <Button
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm"
                >
                    <PlusIcon className="h-5 w-5" />
                    Nouvelle Agence
                </Button>
            </div>

            <div className="flex justify-between items-center mb-4">
                <SearchBar
                    onSearch={setSearchQuery}
                    placeholder="Rechercher une agence..."
                    className="w-full max-w-sm"
                />
            </div>

            <Card className="p-6">
                <AgencyList
                    agences={filteredAgences}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isLoading={isLoading}
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedAgence ? 'Modifier l\'agence' : 'Nouvelle agence'}
            >
                <AgencyForm
                    initialData={selectedAgence ? { nomAgence: selectedAgence.nomAgence, adresse_agence: selectedAgence.adresse_agence } : undefined}
                    onSubmit={selectedAgence ? handleUpdate : handleCreate}
                    isLoading={isFormLoading}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default AgencyManagement;    