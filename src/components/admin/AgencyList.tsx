import React, { useState } from 'react';
import Table from '../ui/Table';
import SearchBar from '../ui/SearchBar';
import { Agence } from '../../types/admin';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface AgencyListProps {
    agences: Agence[];
    onEdit: (agence: Agence) => void;
    onDelete: (id: string) => void;
    isLoading?: boolean;
}

// Type adapté pour les données du tableau, incluant les compteurs calculés
type AgenceForTable = Agence & {
    id: string; // Utiliser id_agence comme clé pour le tableau Table
    totalEmployees: number; // Nombre total d'employés (Opérateurs + Transporteurs)
    totalVehicles: number; // Nombre total de véhicules
};

export const AgencyList: React.FC<AgencyListProps> = ({
    agences,
    onEdit,
    onDelete,
    isLoading = false
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Préparer les données pour la table en calculant les compteurs
    const agenciesForTable: AgenceForTable[] = agences.map(agence => ({
        ...agence,
        id: agence.id_agence, // Utiliser id_agence comme clé pour le tableau Table
        totalEmployees: (agence.employes?.length || 0) + (agence.transporteurs?.length || 0), // Total Opérateurs + Transporteurs
        totalVehicles: agence.vehicules?.length || 0, // Compter tous les véhicules
    }));

    // Filtrer les agences en fonction de la recherche (ID, Nom, Adresse)
    const filteredAgences = agenciesForTable.filter(agence =>
        agence.nomAgence.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agence.adresse_agence.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agence.id_agence.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Définition des colonnes du tableau avec le bon typage
    const columns = [
        {
            header: 'ID',
            accessor: 'id_agence' as keyof AgenceForTable,
            render: (value: AgenceForTable[keyof AgenceForTable], item: AgenceForTable) => (
                <span className="font-mono text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded">
                    {String(value)}
                </span>
            )
        },
        {
            header: 'Nom',
            accessor: 'nomAgence' as keyof AgenceForTable
        },
        {
            header: 'Adresse',
            accessor: 'adresse_agence' as keyof AgenceForTable
        },
        {
            header: 'Employés',
            accessor: 'totalEmployees' as keyof AgenceForTable,
            render: (value: AgenceForTable[keyof AgenceForTable], item: AgenceForTable) => (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"> 
                    {String(value)} employés
                </span>
            )
        },
        {
            header: 'Véhicules',
            accessor: 'totalVehicles' as keyof AgenceForTable,
            render: (value: AgenceForTable[keyof AgenceForTable], item: AgenceForTable) => (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full"> 
                    {String(value)} véhicules
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'id' as keyof AgenceForTable,
            render: (value: AgenceForTable[keyof AgenceForTable], item: AgenceForTable) => (
                <div className="flex space-x-2 items-center">
                    <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-100 transition-colors"
                        aria-label="Modifier"
                    >
                        <PencilIcon className="h-4 w-4" /> 
                    </button>
                    <button
                        onClick={() => onDelete(item.id_agence)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-100 transition-colors"
                        aria-label="Supprimer"
                    >
                        <TrashIcon className="h-4 w-4" /> 
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-4">
            {/* Titre et description */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">Agences</h2>
            </div>

            {/* Tableau des agences */}
            <Table
                columns={columns}
                data={filteredAgences}
                loading={isLoading}
                emptyMessage="Aucune agence trouvée"
            />
        </div>
    );
};   