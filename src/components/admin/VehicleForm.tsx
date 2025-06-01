import React, { useState, useEffect } from 'react';
import { Form, Input } from '../ui/Form';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { CreateVehiculeRequest, Agence } from '../../types/admin';

interface VehicleFormProps {
    initialData?: CreateVehiculeRequest;
    onSubmit: (data: CreateVehiculeRequest) => void;
    agences: Agence[];
    isLoading?: boolean;
    onCancel?: () => void;
}

interface FormErrors {
    immatriculation?: string;
    type?: string;
    capacite?: string;
    id_agence?: string;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
    initialData,
    onSubmit,
    agences,
    isLoading = false,
    onCancel
}) => {
    const [formData, setFormData] = useState<CreateVehiculeRequest>({
        immatriculation: initialData?.immatriculation || '',
        type: initialData?.type || '',
        capacite: initialData?.capacite || 0,
        id_agence: initialData?.id_agence || ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const [selectedAgence, setSelectedAgence] = useState<string>(initialData?.id_agence || '');

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            id_agence: selectedAgence
        }));
    }, [selectedAgence]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacite' ? Number(value) : value
        }));
        // Réinitialiser l'erreur du champ modifié
        setErrors(prev => ({
            ...prev,
            [name]: undefined
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        // Validation de l'immatriculation
        if (!formData.immatriculation) {
            newErrors.immatriculation = "L'immatriculation est requise";
            isValid = false;
        } else if (!/^[A-Z0-9]{6,10}$/.test(formData.immatriculation)) {
            newErrors.immatriculation = "L'immatriculation doit contenir entre 6 et 10 caractères alphanumériques en majuscules";
            isValid = false;
        }

        // Validation du type
        if (!formData.type) {
            newErrors.type = "Le type est requis";
            isValid = false;
        }

        // Validation de la capacité
        if (!formData.capacite) {
            newErrors.capacite = "La capacité est requise";
            isValid = false;
        } else if (formData.capacite <= 0) {
            newErrors.capacite = "La capacité doit être supérieure à 0";
            isValid = false;
        }

        // Validation de l'agence
        if (!formData.id_agence) {
            newErrors.id_agence = "L'agence est requise";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const agenceOptions = agences.map(agence => ({
        value: agence.id_agence,
        label: agence.nomAgence
    }));

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                label="Immatriculation"
                name="immatriculation"
                value={formData.immatriculation}
                onChange={handleChange}
                placeholder="Entrez l'immatriculation"
                error={errors.immatriculation}
                required
            />
            <Input
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Entrez le type de véhicule"
                error={errors.type}
                required
            />
            <Input
                label="Capacité"
                name="capacite"
                type="number"
                value={formData.capacite.toString()}
                onChange={handleChange}
                placeholder="Entrez la capacité"
                error={errors.capacite}
                required
            />
            <Select
                label="Agence"
                options={agenceOptions}
                value={selectedAgence}
                onChange={setSelectedAgence}
                placeholder="Sélectionnez une agence"
                error={errors.id_agence}
            />
            <Button
                type="submit"
                isLoading={isLoading}
                fullWidth
            >
                {initialData ? 'Modifier' : 'Créer'} le véhicule
            </Button>
            {onCancel && (
                <Button
                    type="reset"
                    onClick={onCancel}
                    fullWidth
                >
                    Annuler
                </Button>
            )}
        </Form>
    );
};   