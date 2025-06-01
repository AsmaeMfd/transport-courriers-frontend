import { useState, useEffect } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Alert from './ui/Alert';

interface LastLoginAttempt {
    email: string;
    timestamp: number;
}

interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    lastAttempt: LastLoginAttempt | null;
}

const LoginForm = ({ onSubmit, isLoading, error, lastAttempt }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Pré-remplir l'email si une dernière tentative existe
    useEffect(() => {
        if (lastAttempt) {
            setEmail(lastAttempt.email);
        }
    }, [lastAttempt]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(email, password);
    };

    return (
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            
            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Adresse email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    placeholder="exemple@email.com"
                />

                <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Mot de passe"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />

                {error && <Alert type="error">{error}</Alert>}

                <Button
                    type="submit"
                    isLoading={isLoading}
                    fullWidth
                >
                    Se connecter
                </Button>
            </form>
        </div>
    );
};

export default LoginForm;
