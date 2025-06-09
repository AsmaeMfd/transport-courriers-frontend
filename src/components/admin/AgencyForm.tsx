import React from 'react';
import { Form, Input } from '../ui/Form';
import Button from '../ui/Button';
import { CreateAgenceRequest } from '../../types/admin';

interface AgencyFormProps {
    initialData?: CreateAgenceRequest;
    onSubmit: (data: CreateAgenceRequest) => void;
    isLoading?: boolean;
    onCancel?: () => void;
}

export const AgencyForm: React.FC<AgencyFormProps> = ({
    initialData,
    onSubmit,
    isLoading = false,
    onCancel
}) => {
    const [formData, setFormData] = React.useState<CreateAgenceRequest>({
        nomAgence: initialData?.nomAgence || '',
        adresse_agence: initialData?.adresse_agence || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            // Réinitialiser le formulaire après soumission réussie
            setFormData({
                nomAgence: '',
                adresse_agence: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                label="Nom de l'agence"
                name="nomAgence"
                value={formData.nomAgence}
                onChange={handleChange}
                placeholder="Entrez le nom de l'agence"
                required
            />
            <Input
                label="Adresse"
                name="adresse_agence"
                value={formData.adresse_agence}
                onChange={handleChange}
                placeholder="Entrez l'adresse de l'agence"
                required
            />
            <div className="flex gap-4 mt-4">
                <Button
                    type="submit"
                    isLoading={isLoading}
                    fullWidth
                >
                    {initialData ? 'Modifier' : 'Créer'} l'agence
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        fullWidth
                    >
                        Annuler
                    </Button>
                )}
            </div>
        </Form>
    );
};   