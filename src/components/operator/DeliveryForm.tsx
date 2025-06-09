import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Form from '../ui/Form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { CreateLivraisonDto } from '../../services/livraisonService';
import { Livraison } from '../../services/livraisonService';
import { Courrier } from '../../types/operator';

interface DeliveryFormProps {
    onSubmit: (data: CreateLivraisonDto) => void;
    isLoading?: boolean;
    vehicules: Array<{ id: string; immatriculation: string }>;
    transporteurs: Array<{ id: string; nom: string; prenom: string }>;
    courriers: Courrier[];
    initialData?: CreateLivraisonDto;
    onValidationError?: (errors: { field: string; message: string }[]) => void;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({
    onSubmit,
    isLoading,
    vehicules,
    transporteurs,
    courriers,
    initialData,
    onValidationError
}) => {
    const [formData, setFormData] = useState<CreateLivraisonDto>({
        courrierId: initialData?.courrierId || 0,
        dateEnvoi: initialData?.dateEnvoi || '',
        vehiculeId: initialData?.vehiculeId || '',
        transporteurId: initialData?.transporteurId || ''
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                courrierId: initialData.courrierId,
                dateEnvoi: initialData.dateEnvoi,
                vehiculeId: initialData.vehiculeId,
                transporteurId: initialData.transporteurId
            });
        } else {
            setFormData({
                courrierId: 0,
                dateEnvoi: '',
                vehiculeId: '',
                transporteurId: ''
            });
        }
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'courrierId' ? parseInt(value) : value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: name === 'courrierId' ? parseInt(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const errors: { field: string; message: string }[] = [];
        if (!formData.courrierId || isNaN(formData.courrierId)) errors.push({ field: 'courrierId', message: 'ID de courrier est requis' });
        if (!formData.dateEnvoi) errors.push({ field: 'dateEnvoi', message: 'Date d\'envoi est requise' });
        if (!formData.vehiculeId) errors.push({ field: 'vehiculeId', message: 'Véhicule est requis' });
        if (!formData.transporteurId) errors.push({ field: 'transporteurId', message: 'Transporteur est requis' });

        if (errors.length > 0) {
            setError('Veuillez corriger les erreurs dans le formulaire');
            onValidationError?.(errors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <Card className="p-6">
            
            {error && (
                <div className="mb-4">
                    <Alert type="error">{error}</Alert>
                </div>
            )}

            <Form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Select
                         label="Courrier"
                         value={formData.courrierId.toString()}
                         onChange={(value) => handleSelectChange('courrierId', value)}
                         options={courriers.map(c => ({
                             value: c.id.toString(),
                             label: `ID: ${c.id} - ${c.client.nom_clt} ${c.client.prenom_clt} (${c.statut})`
                         }))}
                    />

                    <Input
                        label="Date d'envoi"
                        name="dateEnvoi"
                        type="date"
                        value={formData.dateEnvoi}
                        onChange={handleInputChange}
                        required
                    />

                    <Select
                        label="Véhicule"
                        value={formData.vehiculeId}
                        onChange={(value) => handleSelectChange('vehiculeId', value)}
                        options={vehicules.map(v => ({
                            value: v.id,
                            label: v.immatriculation
                        }))}
                    />

                    <Select
                        label="Transporteur"
                        value={formData.transporteurId}
                        onChange={(value) => handleSelectChange('transporteurId', value)}
                        options={transporteurs.map(t => ({
                            value: t.id,
                            label: `${t.nom} ${t.prenom}`
                        }))}
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                    >
                        {initialData ? 'Modifier la Livraison' : 'Affecter à la livraison'}
                    </Button>
                </div>
            </Form>
        </Card>
    );
}; 