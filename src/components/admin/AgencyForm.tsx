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
    isLoading = false
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
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
            <Button
                type="submit"
                isLoading={isLoading}
                fullWidth
            >
                {initialData ? 'Modifier' : 'Créer'} l'agence
            </Button>
        </Form>
    );
};   