import React, { useState, useEffect } from 'react';
import { InvoiceForm } from '../../components/operator/InvoiceForm';
import { InvoiceList } from '../../components/operator/InvoiceList';
import { factureService, Facture, CreateFactureDto } from '../../services/factureService';
import { courrierService } from '../../services/courrierService';
import { Courrier, StatusCourrier } from '../../types/operator';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';

const InvoiceManagement: React.FC = () => {
    const [factures, setFactures] = useState<Facture[]>([]);
    const [courriers, setCourriers] = useState<Courrier[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFacture, setSelectedFacture] = useState<Facture | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchFactures();
        fetchCourriers();
    }, []);

    const fetchFactures = async () => {
        try {
            setLoading(true);
            const data = await factureService.getAllFactures();
            setFactures(data);
        } catch (error) {
            toast.error('Erreur lors du chargement des factures');
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourriers = async () => {
        try {
            const data = await courrierService.getCourriersByStatus(StatusCourrier.livre);
            setCourriers(data);
        } catch (error) {
            toast.error('Erreur lors du chargement des courriers');
            console.error('Erreur:', error);
        }
    };

    const handleCreateFacture = async (formData: CreateFactureDto) => {
        try {
            setLoading(true);
            const newFacture = await factureService.createFacture(formData);
            toast.success('Facture créée avec succès');
            setIsModalOpen(false);
            fetchFactures();
        } catch (error) {
            toast.error('Erreur lors de la création de la facture');
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewFacture = (facture: Facture) => {
        setSelectedFacture(facture);
        setIsModalOpen(true);
    };

    const handleUpdateFactureStatus = async (id: number, newStatus: Facture['statutPaiement']) => {
        try {
            setLoading(true);
            await factureService.updateFactureStatus(id, newStatus);
            toast.success('Statut de la facture mis à jour !');
            fetchFactures();
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Erreur lors de la mise à jour du statut.');
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredFactures = factures.filter(facture => 
        facture.id.toString().includes(searchQuery) ||
        facture.courrierId.toString().includes(searchQuery) ||
        facture.statutPaiement.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = () => {
        setSelectedFacture(undefined);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFacture(undefined);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Gestion des Factures</h2>

            <div className="flex justify-between items-center mb-4">
                <SearchBar onSearch={handleSearch} placeholder="Rechercher une facture..." />
                <Button onClick={handleOpenModal}>+ Nouvelle Facture</Button>
            </div>

            <InvoiceList
                factures={filteredFactures}
                isLoading={loading}
                onView={handleViewFacture}
                onSearch={handleSearch}
            />

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedFacture ? "Modifier la Facture" : "Générer une nouvelle Facture"}>
                <InvoiceForm
                    onSubmit={handleCreateFacture}
                    onUpdateStatus={handleUpdateFactureStatus}
                    initialData={selectedFacture ? selectedFacture : undefined}
                    courriers={courriers}
                />
            </Modal>
        </div>
    );
};

export default InvoiceManagement; 