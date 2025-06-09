import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Form from '../ui/Form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { CreateFactureDto, Facture } from '../../services/factureService';
import { Courrier } from '../../types/operator';

interface InvoiceFormProps {
    onSubmit: (data: CreateFactureDto) => void;
    onUpdateStatus?: (id: number, status: Facture['statutPaiement']) => void;
    isLoading?: boolean;
    courriers: Courrier[];
    initialData?: Facture;
    onValidationError?: (errors: { field: string; message: string }[]) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
    onSubmit,
    onUpdateStatus,
    isLoading,
    courriers,
    initialData,
    onValidationError
}) => {
    const [formData, setFormData] = useState<CreateFactureDto>({
        courrierId: initialData?.courrierId || 0,
        statutPaiement: initialData?.statutPaiement || 'NON_PAYE'
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                courrierId: initialData.courrierId,
                statutPaiement: initialData.statutPaiement
            });
        } else {
            setFormData({
                courrierId: 0,
                statutPaiement: 'NON_PAYE'
            });
        }
    }, [initialData]);

    const handleSelectChange = (name: keyof CreateFactureDto, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: name === 'courrierId' ? parseInt(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const errors: { field: string; message: string }[] = [];
        if (!formData.courrierId || isNaN(formData.courrierId)) errors.push({ field: 'courrierId', message: 'Courrier est requis' });
        if (!formData.statutPaiement) errors.push({ field: 'statutPaiement', message: 'Statut de paiement est requis' });

        if (errors.length > 0) {
            setError('Veuillez corriger les erreurs dans le formulaire');
            onValidationError?.(errors);
            return;
        }

        if (initialData && onUpdateStatus) {
            onUpdateStatus(initialData.id, formData.statutPaiement);
        } else {
            onSubmit(formData);
        }
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
                        disabled={!!initialData}
                    />

                    <Select
                        label="Statut de paiement"
                        value={formData.statutPaiement}
                        onChange={(value) => handleSelectChange('statutPaiement', value)}
                        options={[
                            { value: 'PAYE', label: 'Payé' },
                            { value: 'NON_PAYE', label: 'Non payé' },
                        ]}
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                    >
                        {initialData ? 'Mettre à Jour Statut' : 'Générer la Facture'}
                    </Button>
                </div>
            </Form>
        </Card>
    );
}; 