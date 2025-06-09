import React from 'react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import SearchBar from '../ui/SearchBar';
import { Courrier, StatusCourrier } from '../../types/operator';

interface CourrierListProps {
    courriers: Courrier[];
    onEdit: (courrier: Courrier) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, newStatus: StatusCourrier) => void;
    onSearch: (query: string) => void;
    isLoading?: boolean;
}

export const CourrierList: React.FC<CourrierListProps> = ({
    courriers,
    onEdit,
    onDelete,
    onStatusChange,
    onSearch,
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
            header: 'ID Tracking',
            accessor: 'id' as keyof Courrier,
        },
        {
            header: 'Statut',
            accessor: 'statut' as keyof Courrier,
            cell: (value: StatusCourrier) => (
                <Badge variant={getStatusBadgeColor(value)}>
                    {value}
                </Badge>
            ),
        },
        {
            header: 'Prix',
            accessor: 'prixTransmission' as keyof Courrier,
            cell: (value: number) => `${value.toFixed(2)} MAD`,
        },
        {
            header: 'Expéditeur',
            accessor: 'client' as keyof Courrier,
            cell: (value: any) => `${value.nom_clt} ${value.prenom_clt}`,
        },
        {
            header: 'Agence Exp.',
            accessor: 'agenceExped' as keyof Courrier,
        },
        {
            header: 'Agence Dest.',
            accessor: 'agenceDest' as keyof Courrier,
        },
        {
            header: 'Actions',
            accessor: 'actions' as keyof Courrier,
            cell: (value: any, row: Courrier) => (
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
                        onClick={() => onDelete(row.id)}
                    >
                        Supprimer
                    </Button>
                    {row.statut === StatusCourrier.depose && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onStatusChange(row.id, StatusCourrier.en_cours_de_livraison)}
                        >
                            Envoyer
                        </Button>
                    )}
                    {row.statut === StatusCourrier.en_cours_de_livraison && (
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => onStatusChange(row.id, StatusCourrier.livre)}
                        >
                            Livrer
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Liste des Courriers</h2>
                <SearchBar
                    placeholder="Rechercher un courrier..."
                    onSearch={onSearch}
                />
            </div>

            <Table
                columns={columns}
                data={courriers}
                loading={isLoading}
                emptyMessage="Aucun courrier trouvé"
            />
        </div>
    );
}; 