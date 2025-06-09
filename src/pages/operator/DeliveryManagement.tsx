import React, { useState, useEffect } from 'react';
import { DeliveryForm } from '../../components/operator/DeliveryForm';
import { DeliveryList } from '../../components/operator/DeliveryList';
import { livraisonService, Livraison, CreateLivraisonDto } from '../../services/livraisonService';
import { courrierService } from '../../services/courrierService';
import { Courrier, StatusCourrier } from '../../types/operator';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';

const DeliveryManagement: React.FC = () => {
    const [livraisons, setLivraisons] = useState<Livraison[]>([]);
    const [courriers, setCourriers] = useState<Courrier[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLivraison, setSelectedLivraison] = useState<Livraison | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [vehicules, setVehicules] = useState<Array<{ id: string; immatriculation: string }>>([]);
    const [transporteurs, setTransporteurs] = useState<Array<{ id: string; nom: string; prenom: string }>>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchLivraisons();
        fetchCourriers();
        fetchVehicules();
        fetchTransporteurs();
    }, []);

    const fetchLivraisons = async () => {
        setLoading(true);
        try {
            const data = await livraisonService.getAllLivraisons();
            setLivraisons(data || []);
        } catch (error) {
            toast.error('Erreur lors du chargement des livraisons');
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourriers = async () => {
        try {
            const deposeCourriers = await courrierService.getCourriersByStatus(StatusCourrier.depose);
            const enCoursCourriers = await courrierService.getCourriersByStatus(StatusCourrier.en_cours_de_livraison);
            setCourriers([...deposeCourriers, ...enCoursCourriers]);
        } catch (error) {
            toast.error('Erreur lors du chargement des courriers');
            console.error('Erreur:', error);
        }
    };

    const fetchVehicules = async () => {
        try {
            // TODO: Implémenter la récupération des véhicules
            setVehicules([
                { id: '1', immatriculation: '123ABC' },
                { id: '2', immatriculation: '456DEF' }
            ]);
        } catch (error) {
            toast.error('Erreur lors du chargement des véhicules');
            console.error('Erreur:', error);
        }
    };

    const fetchTransporteurs = async () => {
        try {
            // TODO: Implémenter la récupération des transporteurs
            setTransporteurs([
                { id: '1', nom: 'Doe', prenom: 'John' },
                { id: '2', nom: 'Smith', prenom: 'Jane' }
            ]);
        } catch (error) {
            toast.error('Erreur lors du chargement des transporteurs');
            console.error('Erreur:', error);
        }
    };

    const handleCreateLivraison = async (formData: CreateLivraisonDto) => {
        try {
            setLoading(true);
            const newLivraison = await livraisonService.createLivraison(formData);
            setLivraisons(prev => [...prev, newLivraison]);

            await courrierService.changeCourrierStatus(formData.courrierId, StatusCourrier.en_cours_de_livraison);

            await Promise.all([
                fetchLivraisons(),
                fetchCourriers()
            ]);

            toast.success('Livraison créée avec succès');
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Erreur lors de la création de la livraison');
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateLivraison = async (formData: CreateLivraisonDto) => {
        if (!selectedLivraison) return;
        try {
            setLoading(true);
            await livraisonService.updateLivraison(selectedLivraison.id, formData);
            toast.success('Livraison mise à jour avec succès !');
            fetchLivraisons();
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Erreur lors de la mise à jour de la livraison.');
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditLivraison = (livraison: Livraison) => {
        setSelectedLivraison(livraison);
        setIsModalOpen(true);
    };

    const handleDeleteLivraison = async (id: number, courrierId: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette livraison ?')) {
            try {
                setLoading(true);
                await livraisonService.deleteLivraison(id);
                await courrierService.changeCourrierStatus(courrierId, StatusCourrier.depose);
                toast.success('Livraison supprimée avec succès !');
                fetchLivraisons();
                fetchCourriers();
            } catch (error) {
                toast.error('Erreur lors de la suppression de la livraison');
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredLivraisons = livraisons.filter(livraison =>
        livraison.id.toString().includes(searchQuery) ||
        livraison.courrier?.client?.nom_clt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        livraison.courrier?.client?.prenom_clt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = () => {
        setSelectedLivraison(undefined);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedLivraison(undefined);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Gestion des Livraisons</h2>

            <div className="flex justify-between items-center mb-4">
                <SearchBar onSearch={handleSearch} placeholder="Rechercher une livraison..." />
                <Button onClick={handleOpenModal}>+ Nouvelle Livraison</Button>
            </div>

            <DeliveryList
                deliveries={filteredLivraisons}
                isLoading={loading}
                onEdit={handleEditLivraison}
                onDelete={(livraisonId) => {
                    const livraisonToDelete = livraisons.find(l => l.id === livraisonId);
                    if (livraisonToDelete) {
                        handleDeleteLivraison(livraisonId, livraisonToDelete.courrierId);
                    }
                }}
                onSearch={handleSearch}
            />

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedLivraison ? "Modifier la Livraison" : "Créer une nouvelle Livraison"}>
                <DeliveryForm
                    onSubmit={selectedLivraison ? handleUpdateLivraison : handleCreateLivraison}
                    initialData={selectedLivraison ? {
                        courrierId: selectedLivraison.courrierId,
                        dateEnvoi: selectedLivraison.dateEnvoi,
                        vehiculeId: selectedLivraison.vehiculeId,
                        transporteurId: selectedLivraison.transporteurId
                    } : undefined}
                    vehicules={vehicules}
                    transporteurs={transporteurs}
                    courriers={courriers}
                />
            </Modal>
        </div>
    );
};

export default DeliveryManagement; 