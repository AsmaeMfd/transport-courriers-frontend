import React, { ReactNode } from 'react';
import Table from '../ui/Table';
import Button from '../ui/Button';
import { Vehicule } from '../../types/admin';

interface VehicleListProps {
    vehicules: Vehicule[];
    onEdit: (vehicule: Vehicule) => void;
    onDelete: (immatriculation: string) => void;
    isLoading?: boolean;
}

type VehiculeWithId = Vehicule & { id: string };

export const VehicleList: React.FC<VehicleListProps> = ({
    vehicules,
    onEdit,
    onDelete,
    isLoading = false
}) => {
    const transformedData: VehiculeWithId[] = vehicules.map(vehicule => ({
        ...vehicule,
        id: vehicule.immatriculation
    }));

    const columns = [
        {
            header: 'Immatriculation',
            accessor: 'immatriculation' as const,
            render: (_: any, item: VehiculeWithId): ReactNode => item.immatriculation
        },
        {
            header: 'Type',
            accessor: 'type' as const,
            render: (_: any, item: VehiculeWithId): ReactNode => item.type
        },
        {
            header: 'Agence',
            accessor: 'transporteurVehicule' as const,
            render: (_: any, item: VehiculeWithId): ReactNode => 
                item.transporteurVehicule?.agenceTransporteur?.nomAgence || 'Non assigné'
        },
        {
            header: 'Capacité',
            accessor: 'capacite' as const,
            render: (_: any, item: VehiculeWithId): ReactNode => item.capacite
        },
        {
            header: 'Actions',
            accessor: 'immatriculation' as const,
            render: (_: any, item: VehiculeWithId): ReactNode => (
                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(item)}
                    >
                        Modifier
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(item.immatriculation)}
                    >
                        Supprimer
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-4">
            <Table
                columns={columns}
                data={transformedData}
                loading={isLoading}
                emptyMessage="Aucun véhicule trouvé"
            />
        </div>
    );
};   