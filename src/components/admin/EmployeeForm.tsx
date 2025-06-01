import React, { useState, useEffect } from 'react';
import { Form, Input } from '../ui/Form';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { CreateEmployeRequest, CreateUserRequest, Agence, Vehicule } from '../../types/admin';
import { RoleEntity } from '../../types/auth';

interface EmployeeFormProps {
    initialData?: CreateEmployeRequest;
    initialUserData?: CreateUserRequest;
    onSubmit: (data: CreateEmployeRequest, userData?: CreateUserRequest) => void;
    agences: Agence[];
    vehicules: Vehicule[];
    roles: RoleEntity[];
    isLoading?: boolean;
    onCancel?: () => void;
}

interface FormErrors {
    empCin?: string;
    nom_emp?: string;
    prenom_emp?: string;
    emp_phone?: string;
    emp_adresse?: string;
    id_agence?: string;
    email?: string;
    mot_passe?: string;
    id_vehicule?: string;
    id_role?: string;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
    initialData,
    initialUserData,
    onSubmit,
    agences,
    vehicules,
    roles,
    isLoading = false,
    onCancel
}) => {
    const [formData, setFormData] = useState<CreateEmployeRequest>({
        empCin: initialData?.empCin || '',
        nom_emp: initialData?.nom_emp || '',
        prenom_emp: initialData?.prenom_emp || '',
        emp_phone: initialData?.emp_phone || '',
        emp_adresse: initialData?.emp_adresse || '',
        id_agence: initialData?.id_agence || ''
    });

    const [userData, setUserData] = useState<CreateUserRequest>({
        email: initialUserData?.email || '',
        mot_passe: initialUserData?.mot_passe || '',
        id_role: initialUserData?.id_role || 0
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const [selectedAgence, setSelectedAgence] = useState<string>(initialData?.id_agence || '');
    const [selectedRole, setSelectedRole] = useState<string>(initialUserData?.id_role?.toString() || '');
    const [selectedVehicule, setSelectedVehicule] = useState<string>('');

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            id_agence: selectedAgence
        }));
        setUserData(prev => ({
            ...prev,
            id_role: parseInt(selectedRole) || 0
        }));
    }, [selectedAgence, selectedRole]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email' || name === 'mot_passe') {
            setUserData(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        setErrors(prev => ({
            ...prev,
            [name]: undefined
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        if (!formData.empCin) {
            newErrors.empCin = "Le CIN est requis";
            isValid = false;
        } else if (!/^[A-Z0-9]{8}$/.test(formData.empCin)) {
            newErrors.empCin = "Le CIN doit contenir 8 caractères alphanumériques en majuscules";
            isValid = false;
        }

        if (!formData.nom_emp) {
            newErrors.nom_emp = "Le nom est requis";
            isValid = false;
        }

        if (!formData.prenom_emp) {
            newErrors.prenom_emp = "Le prénom est requis";
            isValid = false;
        }

        if (!formData.emp_phone) {
            newErrors.emp_phone = "Le numéro de téléphone est requis";
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.emp_phone)) {
            newErrors.emp_phone = "Le numéro de téléphone doit contenir 10 chiffres";
            isValid = false;
        }

        if (!formData.emp_adresse) {
            newErrors.emp_adresse = "L'adresse est requise";
            isValid = false;
        }

        if (!formData.id_agence) {
            newErrors.id_agence = "L'agence est requise";
            isValid = false;
        }

        if (!selectedRole) {
            newErrors.id_role = "Le rôle est requis";
            isValid = false;
        }

        if (selectedRole === '2') {
            if (!userData.email) {
                newErrors.email = "L'email est requis";
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
                newErrors.email = "L'email n'est pas valide";
                isValid = false;
            }

            if (!userData.mot_passe) {
                newErrors.mot_passe = "Le mot de passe est requis";
                isValid = false;
            } else if (userData.mot_passe.length < 6) {
                newErrors.mot_passe = "Le mot de passe doit contenir au moins 6 caractères";
                isValid = false;
            }
        }

        if (selectedRole === '3' && !selectedVehicule) {
            newErrors.id_vehicule = "Le véhicule est requis pour un transporteur";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData, userData);
        }
    };

    const agenceOptions = agences.map(agence => ({
        value: agence.id_agence,
        label: agence.nomAgence
    }));

    const roleOptions = roles.map(role => ({
        value: role.id_role.toString(),
        label: role.nom
    }));

    const availableVehicules = vehicules.filter(vehicule => {
        const isAvailable = !vehicule.transporteurVehicule;
        const belongsToSelectedAgence = selectedAgence ? 
            vehicule.transporteurVehicule?.agenceTransporteur?.id_agence === selectedAgence : true;
        return isAvailable && belongsToSelectedAgence;
    });

    const vehiculeOptions = availableVehicules.map(vehicule => ({
        value: vehicule.immatriculation,
        label: `${vehicule.type} (${vehicule.immatriculation})`
    }));

    const isOperateur = selectedRole === '2';
    const isTransporteur = selectedRole === '3';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {initialData ? 'Edit Employee' : 'New Employee'}
                        </h2>
                        <button
                            onClick={onCancel}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                            <Input
                                label="First Name"
                                name="prenom_emp"
                                value={formData.prenom_emp}
                                onChange={handleChange}
                                placeholder=""
                                error={errors.prenom_emp}
                                required
                            />
                            <Input
                                label="Last Name"
                                name="nom_emp"
                                value={formData.nom_emp}
                                onChange={handleChange}
                                placeholder=""
                                error={errors.nom_emp}
                                required
                            />
                            <Input
                                label="CIN"
                                name="empCin"
                                value={formData.empCin}
                                onChange={handleChange}
                                placeholder="Enter 8 characters CIN"
                                error={errors.empCin}
                                required
                            />
                             <Select
                                label="Role"
                                options={roleOptions}
                                value={selectedRole}
                                onChange={setSelectedRole}
                                placeholder="Select an option"
                                error={errors.id_role}
                            />
                             <Select
                                label="Agency"
                                options={agenceOptions}
                                value={selectedAgence}
                                onChange={setSelectedAgence}
                                placeholder="Select an option"
                                error={errors.id_agence}
                            />
                           
                            {isOperateur && (
                                <>
                                    <Input
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        placeholder=""
                                        error={errors.email}
                                        required
                                    />
                                    <Input
                                        label="Password"
                                        name="mot_passe"
                                        type="password"
                                        value={userData.mot_passe}
                                        onChange={handleChange}
                                        placeholder=""
                                        error={errors.mot_passe}
                                        required
                                    />
                                </>
                            )}
                            {isTransporteur && (
                                <Select
                                    label="Vehicle"
                                    options={vehiculeOptions}
                                    value={selectedVehicule}
                                    onChange={setSelectedVehicule}
                                    placeholder="Select an option"
                                    error={errors.id_vehicule}
                                />
                            )}
                            <Input
                                label="Phone Number"
                                name="emp_phone"
                                value={formData.emp_phone}
                                onChange={handleChange}
                                placeholder=""
                                error={errors.emp_phone}
                                required
                            />
                            <Input
                                label="Address"
                                name="emp_adresse"
                                value={formData.emp_adresse}
                                onChange={handleChange}
                                placeholder=""
                                error={errors.emp_adresse}
                                required
                            />
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <Button
                                type="submit"
                                isLoading={isLoading}
                            >
                                {initialData ? 'Save Changes' : 'Create Employee'}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};   