import React from 'react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
// import SearchBar from '../ui/SearchBar'; // Remove internal SearchBar
import { StatusCourrier, Courrier } from '../../types/operator';
import { Livraison } from '../../services/livraisonService';

interface DeliveryListProps {
    deliveries: Livraison[];
    onEdit: (delivery: Livraison) => void;
    onDelete: (id: number, courrierId: number) => void;
    onSearch: (query: string) => void; // Keep onSearch prop as it's passed from parent
    isLoading?: boolean;
}

export const DeliveryList: React.FC<DeliveryListProps> = ({
    deliveries,
    onEdit,
    onDelete,
    onSearch, // Keep onSearch
    isLoading
}) => {
    const getStatusBadgeColor = (status: StatusCourrier) => {
        switch (status) {
            case StatusCourrier.depose:
                return 'info';
            case StatusCourrier.en_cours_de_livraison:
                return 'warning';
            case StatusCourrier.livre:
                return 'success';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            header: 'ID Livraison',
            accessor: 'id' as keyof Livraison,
        },
        {
            header: 'ID Courrier',
            accessor: 'courrierId' as keyof Livraison,
        },
        {
            header: 'Statut Courrier',
            accessor: 'statut' as keyof Livraison,
            cell: (value: StatusCourrier) => (
                <Badge variant={getStatusBadgeColor(value)}>
                    {value}
                </Badge>
            ),
        },
        {
            header: 'Date Envoi',
            accessor: 'dateEnvoi' as keyof Livraison,
            cell: (value: string) => new Date(value).toLocaleDateString(),
        },
        {
            header: 'Véhicule',
            accessor: 'vehicule' as keyof Livraison,
            cell: (value: { immatriculation: string } | undefined) => value?.immatriculation || 'N/A',
        },
        {
            header: 'Transporteur',
            accessor: 'transporteur' as keyof Livraison,
            cell: (value: { nom: string; prenom: string } | undefined) => value ? `${value.nom} ${value.prenom}` : 'N/A',
        },
        {
            header: 'Actions',
            accessor: 'actions' as keyof Livraison,
            cell: (value: any, row: Livraison) => (
                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(row)}
                    >
                        Modifier
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(row.id, row.courrierId)}
                    >
                        Supprimer
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4"> {/* Removed title and search bar from here */}
            <Table
                columns={columns}
                data={deliveries}
                loading={isLoading}
                emptyMessage="Aucune livraison trouvée"
            />
        </div>
    );
}; 