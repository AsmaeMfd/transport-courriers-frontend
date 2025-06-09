import React from 'react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
// import SearchBar from '../ui/SearchBar'; // Remove internal SearchBar
import { Facture } from '../../services/factureService'; // Corrected import path for Facture
// No separate import needed for StatusFacture enum as it's defined in Facture interface

interface InvoiceListProps {
    factures: Facture[]; // Use Facture type
    onView: (facture: Facture) => void; // Renamed from onEdit to onView based on previous logic
    // onDelete: (id: number) => void; // Removed onDelete prop
    onSearch: (query: string) => void; // Keep onSearch prop
    isLoading?: boolean;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
    factures,
    onView,
    // onDelete, // Removed onDelete
    onSearch,
    isLoading
}) => {
    const getStatusBadgeColor = (status: Facture['statutPaiement']) => { // Use type from Facture interface
        switch (status) {
            case 'PAYE':
                return 'success';
            case 'NON_PAYE':
                return 'danger';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            header: 'ID',
            accessor: 'id' as keyof Facture,
        },
        {
            header: 'ID Courrier',
            accessor: 'courrierId' as keyof Facture,
        },
        {
            header: 'Montant',
            accessor: 'montant' as keyof Facture,
             cell: (value: number) => `${value.toFixed(2)} MAD`, // Added back currency formatting
        },
        {
            header: 'Date d\'émission',
            accessor: 'dateEmission' as keyof Facture,
             cell: (value: string) => new Date(value).toLocaleDateString(),
        },
        {
            header: 'Statut',
            accessor: 'statutPaiement' as keyof Facture,
             cell: (value: Facture['statutPaiement']) => ( // Use type from Facture interface
                <Badge variant={getStatusBadgeColor(value)}>
                    {value}
                </Badge>
            ),
        },
        {
            header: 'Actions',
            accessor: 'actions' as keyof Facture,
             cell: (value: any, row: Facture) => (
                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onView(row)}
                    >
                        Voir
                    </Button>
                    {/* Removed Delete Button */}
                    {/* <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(row.id)}
                    >
                        Supprimer
                    </Button> */}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4"> {/* Removed title and search bar from here */}

            <Table
                columns={columns}
                data={factures}
                loading={isLoading}
                emptyMessage="Aucune facture trouvée"
            />
        </div>
    );
}; 