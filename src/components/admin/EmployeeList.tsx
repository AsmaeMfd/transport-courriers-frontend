import React, { ReactNode } from 'react';
import Table from '../ui/Table';
import Button from '../ui/Button';
import { Employe } from '../../types/admin';
import { RoleEntity } from '../../types/auth';

interface EmployeeListProps {
    employes: Employe[];
    onEdit: (employe: Employe) => void;
    onDelete: (id: string) => void;
    isLoading?: boolean;
}

type EmployeWithId = Employe & { id: string };

export const EmployeeList: React.FC<EmployeeListProps> = ({
    employes,
    onEdit,
    onDelete,
    isLoading = false
}) => {
    const transformedEmployes: EmployeWithId[] = employes.map(emp => ({
        ...emp,
        id: emp.empCin
    }));

    const columns = [
        {
            header: 'CIN',
            accessor: 'empCin' as const,
            render: (_: any, item: EmployeWithId): ReactNode => item.empCin
        },
        {
            header: 'Nom',
            accessor: 'nom_emp' as const,
            render: (_: any, item: EmployeWithId): ReactNode => item.nom_emp
        },
        {
            header: 'Prénom',
            accessor: 'prenom_emp' as const,
            render: (_: any, item: EmployeWithId): ReactNode => item.prenom_emp
        },
        {
            header: 'Agence',
            accessor: 'agence' as const,
            render: (_: any, item: EmployeWithId): ReactNode => item.agence?.nomAgence || '-'
        },
        {
            header: 'Rôle',
            accessor: 'role' as const,
            render: (_: any, item: EmployeWithId): ReactNode => item.role?.nom || '-'
        },
        {
            header: 'Email',
            accessor: 'utilisateur' as const,
            render: (_: any, item: EmployeWithId): ReactNode => item.utilisateur?.email || '-'
        },
        {
            header: 'Véhicule',
            accessor: 'transporteur' as const,
            render: (_: any, item: EmployeWithId): ReactNode => 
                item.transporteur?.vehiculeTransporteur?.immatriculation || '-'
        },
        {
            header: 'Actions',
            accessor: 'id' as const,
            render: (_: any, item: EmployeWithId): ReactNode => (
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
                        onClick={() => onDelete(item.id)}
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
                data={transformedEmployes}
                loading={isLoading}
                emptyMessage="Aucun employé trouvé"
            />
        </div>
    );
};   