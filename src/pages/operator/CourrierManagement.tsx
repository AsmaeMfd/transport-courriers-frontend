import React, { useEffect, useState } from 'react';
import { CourrierForm } from '../../components/operator/CourrierForm';
import { CourrierList } from '../../components/operator/CourrierList';
import { courrierService } from '../../services/courrierService';
import { etiquetteService } from '../../services/etiquetteService';
import { CreateCourrierDto, Courrier } from '../../types/operator';
import { Agence } from '../../types/admin';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import agencyService from '../../services/agencyService';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';

const CourrierManagement: React.FC = () => {
    const [courriers, setCourriers] = useState<Courrier[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourrier, setSelectedCourrier] = useState<CreateCourrierDto | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [agencies, setAgencies] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCourriers = async () => {
        setLoading(true);
        try {
            const response = await courrierService.getAllCourriers();
            setCourriers(response);
        } catch (error) {
            toast.error('Erreur lors du chargement des courriers.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAgencies = async () => {
        try {
            const response = await agencyService.getAllAgencies();
            setAgencies(response.map((agency: Agence) => agency.nomAgence));
        } catch (error) {
            toast.error('Erreur lors du chargement des agences.');
        }
    };

    useEffect(() => {
        fetchCourriers();
        fetchAgencies();
    }, []);

    const handleCreateCourrier = async (formData: CreateCourrierDto) => {
        try {
            const createdCourrier = await courrierService.createCourrier(formData);
            toast.success('Courrier créé avec succès !');
            await etiquetteService.generateEtiquettePDF(createdCourrier.id);
            toast.success('Étiquette générée avec succès !');
            fetchCourriers();
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Erreur lors de la création du courrier.');
        }
    };

    const handleEditCourrier = (courrier: Courrier) => {
        setSelectedCourrier({
            cin: courrier.client.cin,
            nom_clt: courrier.client.nom_clt,
            prenom_clt: courrier.client.prenom_clt,
            clt_adress: courrier.client.clt_adress,
            phone_number: courrier.client.phone_number,
            poids: courrier.poids,
            cin_dest: courrier.cin_dest,
            nom_complet_dest: courrier.nom_complet_dest,
            adresse_dest: courrier.adresse_dest,
            agenceExped: courrier.agenceExped,
            agenceDest: courrier.agenceDest,
        });
         setIsModalOpen(true);
    };

    const handleUpdateCourrierStatus = async (id: number, status: string) => {
        try {
            await courrierService.changeCourrierStatus(id, status as any);
            toast.success('Statut du courrier mis à jour avec succès !');
            fetchCourriers();
        } catch (error) {
            toast.error('Erreur lors de la mise à jour du statut du courrier.');
        }
    };

    const handleDeleteCourrier = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce courrier ?')) {
            try {
                await courrierService.deleteCourrier(id);
                toast.success('Courrier supprimé avec succès !');
                fetchCourriers();
            } catch (error) {
                toast.error('Erreur lors de la suppression du courrier.');
            }
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredCourriers = courriers.filter(courrier =>
        courrier.client.nom_clt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courrier.client.prenom_clt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courrier.cin_dest.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courrier.nom_complet_dest.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = () => {
        setSelectedCourrier(undefined);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCourrier(undefined);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Gestion des Courriers</h2>
            <div className="flex justify-between items-center mb-4">
                 <SearchBar onSearch={handleSearch} placeholder="Rechercher un courrier..." />
                <Button onClick={handleOpenModal}>+ Nouveau Courrier</Button>
            </div>

            <h2 className="text-xl font-bold mb-4">Liste des Courriers</h2>
            <CourrierList
                courriers={filteredCourriers}
                isLoading={loading}
                onEdit={handleEditCourrier}
                onDelete={handleDeleteCourrier}
                onStatusChange={handleUpdateCourrierStatus}
                onSearch={handleSearch}
            />

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Créer un nouveau Courrier">
                <CourrierForm
                    onSubmit={handleCreateCourrier}
                    agencies={agencies}
                    initialData={selectedCourrier}
                />
            </Modal>
        </div>
    );
};

export default CourrierManagement; 