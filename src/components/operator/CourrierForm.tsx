import React, { useState } from 'react';
import Card from '../ui/Card';
import Form from '../ui/Form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { CreateCourrierDto } from '../../types/operator';

interface CourrierFormProps {
    initialData?: CreateCourrierDto;
    onSubmit: (data: CreateCourrierDto) => void;
    isLoading?: boolean;
    agencies: string[];
    onValidationError?: (errors: { field: string; message: string }[]) => void;
}

export const CourrierForm: React.FC<CourrierFormProps> = ({
    initialData,
    onSubmit,
    isLoading,
    agencies,
    onValidationError
}) => {
    const [formData, setFormData] = useState<CreateCourrierDto>(initialData || {
        cin: '',
        nom_clt: '',
        prenom_clt: '',
        clt_adress: '',
        phone_number: '',
        poids: 0,
        cin_dest: '',
        nom_complet_dest: '',
        adresse_dest: '',
        agenceExped: '',
        agenceDest: ''
    });

    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation basique
        const errors: { field: string; message: string }[] = [];
        if (!formData.cin) errors.push({ field: 'cin', message: 'CIN est requis' });
        if (!formData.nom_clt) errors.push({ field: 'nom_clt', message: 'Nom est requis' });
        if (!formData.prenom_clt) errors.push({ field: 'prenom_clt', message: 'Prénom est requis' });
        if (!formData.clt_adress) errors.push({ field: 'clt_adress', message: 'Adresse est requise' });
        if (!formData.phone_number) errors.push({ field: 'phone_number', message: 'Numéro de téléphone est requis' });
        if (!formData.poids || formData.poids <= 0) errors.push({ field: 'poids', message: 'Poids doit être supérieur à 0' });
        if (!formData.cin_dest) errors.push({ field: 'cin_dest', message: 'CIN du destinataire est requis' });
        if (!formData.nom_complet_dest) errors.push({ field: 'nom_complet_dest', message: 'Nom du destinataire est requis' });
        if (!formData.adresse_dest) errors.push({ field: 'adresse_dest', message: 'Adresse du destinataire est requise' });
        if (!formData.agenceExped) errors.push({ field: 'agenceExped', message: 'Agence expéditrice est requise' });
        if (!formData.agenceDest) errors.push({ field: 'agenceDest', message: 'Agence destinataire est requise' });

        if (errors.length > 0) {
            setError('Veuillez corriger les erreurs dans le formulaire');
            onValidationError?.(errors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Création d'un Courrier</h2>
            
            {error && (
                <div className="mb-4">
                    <Alert type="error">{error}</Alert>
                </div>
            )}

            <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Informations de l'expéditeur */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informations de l'expéditeur</h3>
                        
                        <Input
                            label="CIN"
                            name="cin"
                            value={formData.cin}
                            onChange={handleInputChange}
                            required
                        />

                        <Input
                            label="Nom"
                            name="nom_clt"
                            value={formData.nom_clt}
                            onChange={handleInputChange}
                            required
                        />

                        <Input
                            label="Prénom"
                            name="prenom_clt"
                            value={formData.prenom_clt}
                            onChange={handleInputChange}
                            required
                        />

                        <Input
                            label="Adresse"
                            name="clt_adress"
                            value={formData.clt_adress}
                            onChange={handleInputChange}
                            required
                        />

                        <Input
                            label="Numéro de téléphone"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Informations du destinataire */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informations du destinataire</h3>
                        
                        <Input
                            label="CIN du destinataire"
                            name="cin_dest"
                            value={formData.cin_dest}
                            onChange={handleInputChange}
                            required
                        />

                        <Input
                            label="Nom complet du destinataire"
                            name="nom_complet_dest"
                            value={formData.nom_complet_dest}
                            onChange={handleInputChange}
                            required
                        />

                        <Input
                            label="Adresse du destinataire"
                            name="adresse_dest"
                            value={formData.adresse_dest}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Informations du courrier */}
                    <div className="space-y-4 md:col-span-2">
                        <h3 className="text-lg font-semibold">Informations du courrier</h3>
                        
                        <Input
                            label="Poids (kg)"
                            name="poids"
                            type="number"
                            value={formData.poids}
                            onChange={handleInputChange}
                            required
                        />

                        <Select
                            label="Agence expéditrice"
                            value={formData.agenceExped}
                            onChange={(value) => handleSelectChange('agenceExped', value)}
                            options={agencies.map(agence => ({ value: agence, label: agence }))}
                        />

                        <Select
                            label="Agence destinataire"
                            value={formData.agenceDest}
                            onChange={(value) => handleSelectChange('agenceDest', value)}
                            options={agencies.map(agence => ({ value: agence, label: agence }))}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                    >
                        {initialData ? 'Mettre à jour' : 'Créer'} le courrier
                    </Button>
                </div>
            </Form>
        </Card>
    );
}; 